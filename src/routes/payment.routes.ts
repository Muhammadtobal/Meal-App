import express from "express";
import { container } from "../config/inversify.config";
import { TYPES } from "../config/types.config";
import { validateDataAndImage } from "../validator/unitvalidate";
import {
  createOrderDetailSchema,
  updateOrderdetailSchema,
} from "../validator/zod.validator";
import { UserRole } from "../enum";
import verifyToken from "../middleware/authorization";
import { PaymentController } from "../controllers/payments.controller";

const paymentRouter = express.Router();
const paymentconttroller = container.get<PaymentController>(TYPES.PaymentController);



paymentRouter.post(
  "/create-payment",
  verifyToken([UserRole.Admin, UserRole.Customer]), 
  validateDataAndImage(createOrderDetailSchema),
  paymentconttroller.createCheckoutSession.bind(paymentconttroller)
);

paymentRouter.get(
  "/getall-payment",
 verifyToken([UserRole.Admin, UserRole.Customer]), 
  paymentconttroller.getAllPayments.bind(paymentconttroller)
);

export default paymentRouter;
