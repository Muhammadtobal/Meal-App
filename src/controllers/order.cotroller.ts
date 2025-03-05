import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.config";
import { OrderService } from "../services/order.service";
import { NextFunction, Request, Response } from "express";

@injectable()
export class OrderController {
  constructor(@inject(TYPES.OrderService) private orderService: OrderService) {
    this.orderService = orderService;
  }
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.orderService.createOrder(req.body);
      res.status(201).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async getAllOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

     
      const categories = await this.orderService.getCategories(page, limit);
      const paginationInfo = await this.orderService.getPaginationInfo(page, limit);

      res.status(200).json({
        message: "success",
        data: categories,
        pagination: paginationInfo,
      });

    } catch (error: any) {
      next(error);
    }
  }
  async getOneOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await this.orderService.getOneOrder(id);
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async updateOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const { status, user, reservation } = req.body;
      const id = Number(req.params.id);
      const result = await this.orderService.updateOrder(id, {
        status,
        user,
        reservation,
      });
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await this.orderService.deleteOrder(id);
      res.status(200).json({ message: "success" });
    } catch (error: any) {
      next(error);
    }
  }
}
