import { injectable, inject } from "inversify";
import { TYPES } from "../config/types.config";
import { ReservationService } from "../services/reservation.service";
import { Request, Response, NextFunction } from "express";

@injectable()
export class ReservationController {
  constructor(
    @inject(TYPES.ReservationService)
    private reservationService: ReservationService
  ) {
    this.reservationService = reservationService;
  }
  async createReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const { duration, table, user ,reservationTime} = req.body;
      const result = await this.reservationService.createReservation({
        duration,
        table,
        user,
        reservationTime
      });
      res.status(201).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async getAllReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

     
      const categories = await this.reservationService.getCategories(page, limit);
      const paginationInfo = await this.reservationService.getPaginationInfo(page, limit);

      res.status(200).json({
        message: "success",
        data: categories,
        pagination: paginationInfo,
      });
    } catch (error: any) {
      next(error);
    }
  }
  async getOneReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await this.reservationService.getOneReservation(
        Number(req.params.id)
      );
      res.status(201).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async updateReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const { duration, user, table, status,reservationTime } = req.body;
      const id = Number(req.params.id);
      const result = await this.reservationService.updateReservation(id, {
        duration,
        reservationTime,
        user,
        table,
        status,
      });
      res.status(200).json({ message: "success", data: result });
    } catch (error: any) {
      next(error);
    }
  }
  async deleteReservation(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      await this.reservationService.deleteReservation(id);
      res.status(200).json({ message: "success" });
    } catch (error) {
      next(error);
    }
  }
}
