import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.config";
import { OrderDetailService } from "../services/orderdetail.service";
import { Request, Response, NextFunction } from "express";

@injectable()
export class OrderDetailController {
  constructor(
    @inject(TYPES.OrderDetailService)
    private orderDetailService: OrderDetailService
  ) {
    this.orderDetailService = orderDetailService;
  }
  async createOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.orderDetailService.createOrderDetail(req.body);
      res.status(201).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }

  async getAllOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

     
      const categories = await this.orderDetailService.getCategories(page, limit);
      const paginationInfo = await this.orderDetailService.getPaginationInfo(page, limit);

      res.status(200).json({
        message: "success",
        data: categories,
        pagination: paginationInfo,
      });

    } catch (error: any) {
      next(error);
    }
  }
  async getOneOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await this.orderDetailService.getOneOrderDetail(id);
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async updateOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { item, order, quantity } = req.body;
      const result = await this.orderDetailService.updateOrderDetail(id, {
        item,
        order,
        quantity,
      });
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async deleteOrderDetail(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await this.orderDetailService.deleteOrderDetail(id);
      res.status(200).json({ message: "success" });
    } catch (error: any) {
      next(error);
    }
  }
}
