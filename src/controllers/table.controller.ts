import { inject, injectable } from "inversify";
import { TYPES } from "../config/types.config";
import { TableService } from "../services/table.service";
import { NextFunction, Request, Response } from "express";

@injectable()
export class TableController {
  constructor(@inject(TYPES.TableService) private tableService: TableService) {
    this.tableService = tableService;
  }
  async createTable(req: Request, res: Response, next: NextFunction) {
    try {
      const { capacity, numberTable } = req.body;

      const result = await this.tableService.createTable({
        capacity,
        numberTable,
      });
      res.status(201).json({ message: "success", data: result });
    } catch (error) {
      next(error);
    }
  }

  async getAllTable(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

     
      const categories = await this.tableService.getCategories(page, limit);
      const paginationInfo = await this.tableService.getPaginationInfo(page, limit);

      res.status(200).json({
        message: "success",
        data: categories,
        pagination: paginationInfo,
      });
    } catch (error) {
      next(error);
    }
  }
  async getOneTable(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await this.tableService.getOneTable(id);
      res.status(200).json({ message: "success", data: result });
    } catch (error) {
      next(error);
    }
  }
  async updateTable(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const { capacity, numberTable } = req.body;
      const result = await this.tableService.updateTable(id, {
        capacity,
        numberTable,
      });
      res.status(200).json({ message: "success", data: result });
    } catch (error) {
      next(error);
    }
  }
  async deleteTable(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

       await this.tableService.deleteTable(id);
      res.status(200).json({ message: "success" });
    } catch (error) {
      next(error);
    }
  }
}
