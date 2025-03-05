import express from "express";
import {
  createReservationSchema,
  updateReservationSchema,
} from "../validator/zod.validator";
import { validateDataAndImage } from "../validator/unitvalidate";
import { container } from "../config/inversify.config";
import { TYPES } from "../config/types.config";
import { ReservationController } from "../controllers/reservation.controller";
import verifyToken from "../middleware/authorization";
import { UserRole } from "../enum";

const reservationRouter = express.Router();
const reservationcontroller = container.get<ReservationController>(TYPES.ReservationController);



reservationRouter.post(
  "/create-reservation",
  verifyToken([UserRole.Admin, UserRole.Customer]), 
  validateDataAndImage(createReservationSchema),
  reservationcontroller.createReservation.bind(reservationcontroller)
);


reservationRouter.get(
  "/getall-reservation",
  verifyToken([UserRole.Admin, UserRole.Employee]), 
  reservationcontroller.getAllReservation.bind(reservationcontroller)
);


reservationRouter.get(
  "/getone-reservation/:id",
  verifyToken([UserRole.Admin, UserRole.Employee, UserRole.Customer]), 
  reservationcontroller.getOneReservation.bind(reservationcontroller)
);


reservationRouter.put(
  "/update-reservation/:id",
  verifyToken([UserRole.Admin, UserRole.Employee]),
  validateDataAndImage(updateReservationSchema),
  reservationcontroller.updateReservation.bind(reservationcontroller)
);


reservationRouter.delete(
  "/delete-reservation/:id",
  verifyToken([UserRole.Admin]), 
  validateDataAndImage(updateReservationSchema),
  reservationcontroller.deleteReservation.bind(reservationcontroller)
);

export default reservationRouter;
