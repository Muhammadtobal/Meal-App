import { inject, injectable } from "inversify";
import { ItemService } from "../services/item.service";
import { TYPES } from "../config/types.config";
import { NextFunction, Request, Response } from "express";
import { deleteFile, uploadPathItem } from "../utils/uploads";

injectable();
export class ItemController {
  constructor(@inject(TYPES.ItemService) private itemService: ItemService) {
    this.itemService = itemService;
  }

  async getAllItem(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

     
      const categories = await this.itemService.getCategories(page, limit);
      const paginationInfo = await this.itemService.getPaginationInfo(page, limit);

      res.status(200).json({
        message: "success",
        data: categories,
        pagination: paginationInfo,
      });

   
    } catch (error: any) {
      next(error);
    }
  }
  async createItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price, description, category } = req.body;

      const image = req.file ? req.file.filename : undefined;

      const result = await this.itemService.createItem({
        name,
        price,
        description,
        image,
        category,
      });

      res.status(200).json({ message: "success", Data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async updateItem(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, price, description, category } = req.body;
      const image: string | undefined = req.file
        ? req.file.filename
        : undefined;
      const id = Number(req.params.id);
      const result = await this.itemService.updateItem(id, {
        name,
        price,
        description,
        category,
        image,
      });
      res.status(200).json({ message: "success", data: result });
    } catch (error) {
      if (req.file) deleteFile(req.file.filename, uploadPathItem);

      next(error);
    }
  }
  async getOneItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await this.itemService.getOneItem(id);
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async deleteItem(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await this.itemService.deleteItem(id);
      res.status(200).json({ message: "success delete" });
    } catch (error: any) {
      next(error);
    }
  }
}
