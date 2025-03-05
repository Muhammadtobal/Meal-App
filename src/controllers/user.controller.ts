import { TYPES } from "../config/types.config";
import { inject, injectable } from "inversify";
import { UserService } from "../services/user.service";
import { Request, Response, NextFunction } from "express";
@injectable()
export class UserController {
  private userService: UserService;
  constructor(@inject(TYPES.UserService) userService: UserService) {
    this.userService = userService;
  }
  async getAllUser(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

     
      const categories = await this.userService.getCategories(page, limit);
      const paginationInfo = await this.userService.getPaginationInfo(page, limit);

      res.status(200).json({
        message: "success",
        data: categories,
        pagination: paginationInfo,
      });
    } catch (error: any) {
      next(error);
    }
  }
  async getOneUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.getone(req.body);
      res.status(200).json({ message: "success", data: user });
    } catch (error: any) {
      next(error);
    }
  }
  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await this.userService.updateUser(req.body);
      res.status(200).json({ message: "success", data: user });
    } catch (error: any) {
      next(error);
    }
  }
  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        const id=Number (req.params.id)
      const user = await this.userService.deleteUser(id);
      res.status(200).json({ message: "success", data: user });
    } catch (error: any) {
      next(error);
    }
  }
}
