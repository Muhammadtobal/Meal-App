import { UserController } from "../controllers/user.controller";
import express from "express";
import { container } from "../config/inversify.config";
import { TYPES } from "../config/types.config";
import { validateDataAndImage } from "../validator/unitvalidate";
import { getOneUserSchema, updateUserSchema } from "../validator/zod.validator";
import verifyToken from "../middleware/authorization";
import { UserRole } from "../enum";

const usercontroller = container.get<UserController>(TYPES.UserController);
const userRouter = express.Router();

userRouter.get(
  "/getall-user",
  verifyToken([UserRole.Admin]),
  usercontroller.getAllUser.bind(usercontroller)
);

userRouter.post(
  "/getone-user",
  verifyToken([UserRole.Admin, UserRole.Employee]),
  validateDataAndImage(getOneUserSchema),
  usercontroller.getOneUser.bind(usercontroller)
);

userRouter.put(
  "/update-user",
  verifyToken([UserRole.Admin]),
  validateDataAndImage(updateUserSchema),
  usercontroller.updateUser.bind(usercontroller)
);

userRouter.delete(
  "/delete-user/:id",
  verifyToken([UserRole.Admin]),
  usercontroller.deleteUser.bind(usercontroller)
);

export default userRouter;
