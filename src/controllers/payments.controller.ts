import { injectable, inject } from "inversify";
import { TYPES } from "../config/types.config";
import { PaymentService } from "../services/payments.service";
import { NextFunction, Request, Response } from "express";
import { sendPaymentConfirmationEmail } from "../helpers/notfication";

@injectable()
export class PaymentController {
  constructor(
    @inject(TYPES.PaymentService) private paymentservice: PaymentService
  ) {
    this.paymentservice = paymentservice;
  }
  async createCheckoutSession(req: Request, res: Response, next: NextFunction) {
    try {
      const { 
         order, user, discount } = req.body;
      const { sessionUrl, newPayment } =
        await this.paymentservice.createCheckoutSession({
          
          

          user,
          order,
          discount,
        });

      await sendPaymentConfirmationEmail(
        newPayment.user.email,
        
        
        user,
        newPayment.id
      );
      await newPayment.save();
      res.status(200).json({
        success: true,
        paymentId: newPayment.id,
        paymentUrl: sessionUrl,
      });
      await sendPaymentConfirmationEmail(
        newPayment.user.email,
       
        
        user,
        newPayment.id
      );
    } catch (error) {
      next(error);
    }
  }
  async getAllPayments(req:Request,res:Response,next:NextFunction){
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

     
      const categories = await this.paymentservice.getCategories(page, limit);
      const paginationInfo = await this.paymentservice.getPaginationInfo(page, limit);

      res.status(200).json({
        message: "success",
        data: categories,
        pagination: paginationInfo,
      });
    } catch (error) {
      next(error)
    }
  }
}
