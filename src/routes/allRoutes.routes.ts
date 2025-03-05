import authRouter from "./auth.routes";
import { Router } from "express";
import userRouter from "./user.routes";
import tableRouter from "./table.routes";
import categoryRouter from "./category.routes";
import itemRouter from "./item.routes";
import reservationRouter from "./reservation.routes";
import orderRouter from "./order.routes";
import orderDetailRouter from "./orderdetail.routes";
import paymentRouter from "./payment.routes";
const router=Router()
router.use("/auth",authRouter)
router.use("/user",userRouter)
router.use("/table",tableRouter)
router.use("/category",categoryRouter)
router.use("/item",itemRouter)
router.use("/reservation",reservationRouter)
router.use("/order",orderRouter)
router.use("/orderdetail",orderDetailRouter)
router.use("/payment",paymentRouter)
export default router