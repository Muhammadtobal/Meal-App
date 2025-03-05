import express from "express";
import { container } from "../config/inversify.config";
import { TYPES } from "../config/types.config";
import { OrderController } from "../controllers/order.cotroller";
import { validateDataAndImage } from "../validator/unitvalidate";
import { createOrderSchema, updateOrderSchema } from "../validator/zod.validator";
import verifyToken from "../middleware/authorization";
import { UserRole } from "../enum";

const orderRouter = express.Router();
const ordercontroller = container.get<OrderController>(TYPES.OrderController);


orderRouter.post(
  "/create-order",
  verifyToken([UserRole.Admin, UserRole.Customer]), 
  validateDataAndImage(createOrderSchema),
  ordercontroller.createOrder.bind(ordercontroller)
);

orderRouter.get(
  "/getall-order",
verifyToken([UserRole.Admin, UserRole.Employee]), 
  ordercontroller.getAllOrder.bind(ordercontroller)
);


orderRouter.get(
  "/getone-order/:id",
  verifyToken([UserRole.Admin, UserRole.Employee, UserRole.Customer]), 
  ordercontroller.getOneOrder.bind(ordercontroller)
);



orderRouter.put(
  "/update-order/:id",
  verifyToken([UserRole.Admin, UserRole.Employee]), 
  validateDataAndImage(updateOrderSchema),
  ordercontroller.updateOrder.bind(ordercontroller)
);


orderRouter.delete(
  "/delete-order/:id",
  verifyToken([UserRole.Admin]), 
  ordercontroller.deleteOrder.bind(ordercontroller)
);

export default orderRouter;
