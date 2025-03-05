import express from "express";
import { container } from "../config/inversify.config";
import { TYPES } from "../config/types.config";
import { OrderDetailController } from "../controllers/orderdetail.controller";
import { validateDataAndImage } from "../validator/unitvalidate";
import {
  createOrderDetailSchema,
  updateOrderdetailSchema,
} from "../validator/zod.validator";
import { UserRole } from "../enum";
import verifyToken from "../middleware/authorization";

const orderDetailRouter = express.Router();
const orderdetailcontroller = container.get<OrderDetailController>(TYPES.OrderDetailController);




orderDetailRouter.post(
  "/create-orderdetail",
  verifyToken([UserRole.Admin, UserRole.Employee]), 
  validateDataAndImage(createOrderDetailSchema),
  orderdetailcontroller.createOrderDetail.bind(orderdetailcontroller)
);


orderDetailRouter.get(
  "/getall-orderdetail",
 verifyToken([UserRole.Admin, UserRole.Employee]), 
  orderdetailcontroller.getAllOrderDetail.bind(orderdetailcontroller)
);


orderDetailRouter.get(
  "/getone-orderdetail/:id",
  verifyToken([UserRole.Admin, UserRole.Employee, UserRole.Customer]),
  orderdetailcontroller.getOneOrderDetail.bind(orderdetailcontroller)
);


orderDetailRouter.put(
  "/update-orderdetail/:id",
  verifyToken([UserRole.Admin, UserRole.Employee]), 
  validateDataAndImage(updateOrderdetailSchema),
  orderdetailcontroller.updateOrderDetail.bind(orderdetailcontroller)
);


orderDetailRouter.delete(
  "/delete-orderdetail/:id",
  verifyToken([UserRole.Admin]), 
  orderdetailcontroller.deleteOrderDetail.bind(orderdetailcontroller)
);

export default orderDetailRouter;
