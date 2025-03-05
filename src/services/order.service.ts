import { injectable } from "inversify";
import AppDataSource from "../database/db";
import { Order } from "../entities/order.entity";
import { DeepPartial } from "typeorm";

import { User } from "../entities/user.entity";
import { Reservation } from "../entities/reservation.entity";
import { getPaginationInfo, paginate } from "../utils/pagination";

@injectable()
export class OrderService {
  private orderRpository = AppDataSource.getRepository(Order);
  async createOrder(data: DeepPartial<Order>): Promise<Order> {
    return await this.orderRpository.save(data);
  }
   async getCategories(page: number = 1, limit: number = 10): Promise<Order[]> {
        return paginate(this.orderRpository, page, limit);
      }
    
    
      async getPaginationInfo(page: number = 1, limit: number = 10) {
        return getPaginationInfo(this.orderRpository, page, limit);
      }
  async getOneOrder(id: number): Promise<Order | null> {
    const existOrder = await this.orderRpository.findOne({
      where: { id },
      relations: ["reservation", "user"],
    });
    if (!existOrder) {
      throw new Error("the order not found");
    }
    return existOrder;
  }
  async updateOrder(id: number, data: DeepPartial<Order>): Promise<Order> {
    const existOrder = await this.orderRpository.findOne({
      where: { id },
      relations: ["reservation", "user"],
    });
    if (!existOrder) {
      throw new Error("the order not found");
    }
    if (data.status) existOrder.status = data.status;
    if (data.user) {
      const existUser = await User.findOne({
        where: { id: Number(data.user) },
      });
      if (!existUser) {
        throw new Error("the User not found");
      }
      existOrder.user = existUser;
    }
    if (data.reservation) {
      const existReservation = await Reservation.findOne({
        where: { id: Number(data.reservation) },
      });
      if (!existReservation) {
        throw new Error("the Reservation not found");
      }
      existOrder.reservation = existReservation;
    }
    return await this.orderRpository.save(existOrder);
  }
  async deleteOrder(id: number): Promise<void> {
    const existOrder = await this.orderRpository.findOne({
      where: { id },
      relations: ["reservation", "user"],
    });
    if (!existOrder) {
      throw new Error("the order not found");
    }
    await this.orderRpository.remove(existOrder);
  }
}
