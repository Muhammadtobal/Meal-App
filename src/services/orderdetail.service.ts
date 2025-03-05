import { injectable } from "inversify";
import AppDataSource from "../database/db";
import { OrderDetail } from "../entities/orderdetail.entity";
import { DeepPartial } from "typeorm";

import { Item } from "../entities/item.entity";
import { Order } from "../entities/order.entity";
import { getPaginationInfo, paginate } from "../utils/pagination";

@injectable()
export class OrderDetailService {
  private orderdetailRepository = AppDataSource.getRepository(OrderDetail);
  async createOrderDetail(
    data: DeepPartial<OrderDetail>
  ): Promise<OrderDetail> {
    return await this.orderdetailRepository.save(data);
  }

async getCategories(page: number = 1, limit: number = 10): Promise<OrderDetail[]> {
      return paginate(this.orderdetailRepository, page, limit);
    }
  
  
    async getPaginationInfo(page: number = 1, limit: number = 10) {
      return getPaginationInfo(this.orderdetailRepository, page, limit);
    }
  async getOneOrderDetail(id: number): Promise<OrderDetail | null> {
    const exist = await this.orderdetailRepository.findOne({
      where: { id },
      relations: ["item", "order"],
    });
    if (!exist) throw new Error("the user not found");
    return exist;
  }
  async updateOrderDetail(
    id: number,
    data: DeepPartial<OrderDetail>
  ): Promise<OrderDetail> {
    const exist = await this.orderdetailRepository.findOne({
      where: { id },
      relations: ["order", "item"],
    });
    if (!exist) throw new Error("the orderdetail not found");
    if (data.item) {
      const existItem = await Item.findOne({
        where: {
          id: Number(data.item),
        },
      });
      if (!existItem) throw new Error("the itme not found");
      exist.item = existItem;
    }
    if (data.order) {
      const existOrder = await Order.findOne({
        where: {
          id: Number(data.order),
        },
      });
      if (!existOrder) throw new Error("the order not found");
      exist.order = existOrder;
    }
    if (data.quantity) exist.quantity = data.quantity;
    return this.orderdetailRepository.save(exist);
  }
  async deleteOrderDetail(id: number): Promise<void> {
    const exist = await this.orderdetailRepository.findOne({
      where: { id },
      relations: ["order", "item"],
    });
    if (!exist) throw new Error("the orderdetail not found");
    this.orderdetailRepository.remove(exist);
  }
}
