import { inject, injectable } from "inversify";
import { CategoryService } from "../services/category.service";
import { TYPES } from "../config/types.config";
import { NextFunction, Request, Response } from "express";
import { deleteFile, uploadPathCategory } from "../utils/uploads";

@injectable()
export class CategoryController {
  constructor(
    @inject(TYPES.CategoryService) private categoryService: CategoryService
  ) {
    this.categoryService = categoryService;
  }
  async createCategory(req: Request, res: Response, next: NextFunction) {
    let image: string | undefined;
    try {
      const { name, parent } = req.body;
      image = req.file?.filename;

      const result = await this.categoryService.createCategory({
        image,
        name,
        parent,
      });
      res.status(201).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async updateCategory(req: Request, res: Response, next: NextFunction) {
    let image: string | undefined;
    try {
      const { name, parent } = req.body;
      image = req.file?.filename;

      const id = Number(req.params.id);
      const result = await this.categoryService.updateCategory(id, {
        image,
        name,
        parent,
      });
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      if (req.file) deleteFile(req.file.filename, uploadPathCategory);
      next(error);
    }
  }
  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await this.categoryService.deleteCategory(id);
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async getAllCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

     
      const categories = await this.categoryService.getCategories(page, limit);
      const paginationInfo = await this.categoryService.getPaginationInfo(page, limit);

      res.status(200).json({
        message: "success",
        data: categories,
        pagination: paginationInfo,
      });
    
    } catch (error: any) {
      next(error);
    }
  }
  async getOneCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const result = await this.categoryService.getOneCategory(id);
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
}
