import { injectable } from "inversify";
import AppDataSource from "../database/db";
import { Payment } from "../entities/payments.entity";
import { User } from "../entities/user.entity";
import { Order } from "../entities/order.entity";
import { paymentRole } from "../enum";
import Stripe from "stripe";
import { DeepPartial } from "typeorm";
import { getPaginationInfo, paginate } from "../utils/pagination";

const stripe = new Stripe(process.env.SECRET_STRIPE_KEY as string);

@injectable()
export class PaymentService {
  private paymentRepository = AppDataSource.getRepository(Payment);
  private userRepository = AppDataSource.getRepository(User);
  private orderRepository = AppDataSource.getRepository(Order);

  async createCheckoutSession(data: DeepPartial<Payment>) {
    const user = await this.userRepository.findOne({
      where: { id: Number(data.user) },
    });
    if (!user) {
      throw new Error("User not found");
    }

    const order = await this.orderRepository.findOne({
      where: { id: Number(data.order) },
      relations: ["orderDetails", "orderDetails.item"],
    });
    if (!order) {
      throw new Error("Order not found");
    }
    let totalAmount = order.orderDetails.reduce(
      (sum, orderDetail) => sum + orderDetail.item.price * orderDetail.quantity,
      0
    );
    
    const discount = data.discount || 0;
    const finalAmount = totalAmount - discount;
    
    const lineItems = order.orderDetails.map((orderDetail) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: orderDetail.item.name,
        },
        unit_amount: orderDetail.item.price * 100, 
      },
      quantity: orderDetail.quantity, 
    }));
    
    

    try {
      const successUrl =
        "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}";
      const cancelUrl = "http://localhost:3000/cancel";

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: user.email,
        line_items: lineItems,
        metadata: {
          userId: user.id.toString(),
          orderId: order.id.toString(),
          discount: discount.toString(),
        },
        success_url: successUrl,
        cancel_url: cancelUrl,
      });

      const newPayment = this.paymentRepository.create({
        order,
        user,
        amount: data.amount,
        discount,
        totalAmount: totalAmount,
        finalAmount:finalAmount,
        paymentDate: new Date(),
        status: paymentRole.Pending,
      });

      await this.paymentRepository.save(newPayment);

      return { sessionUrl: session.url, newPayment };
    } catch (error) {
      console.error(error);
      throw new Error("Error creating checkout session");
    }
  }
 async getCategories(page: number = 1, limit: number = 10): Promise<Payment[]> {
       return paginate(this.paymentRepository, page, limit);
     }
   
   
     async getPaginationInfo(page: number = 1, limit: number = 10) {
       return getPaginationInfo(this.paymentRepository, page, limit);
     }
}
