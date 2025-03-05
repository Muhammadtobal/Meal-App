import "reflect-metadata";
import { validateDataAndImage } from "../validator/unitvalidate";
import { createUserSchema, loginSchema } from "../validator/zod.validator";
import { container } from "../config/inversify.config";
import { AuthController } from "../controllers/auth.controller";
import { TYPES } from "../config/types.config";
import express from "express";

const authRouter = express.Router();
const authcontroller = container.get<AuthController>(TYPES.AuthController);


authRouter.post(
  "/signup-auth",
  validateDataAndImage(createUserSchema),
  authcontroller.singUp.bind(authcontroller)
);


authRouter.post(
  "/login-auth",
  validateDataAndImage(loginSchema),
  (req, res, next) => authcontroller.login(req, res, next)
);


authRouter.post("/verify-otp", authcontroller.verifyOtp.bind(authcontroller));


authRouter.get("/google", authcontroller.googleAuth.bind(authcontroller));


authRouter.get("/google/callback", authcontroller.googleCallback.bind(authcontroller));


authRouter.get("/logout", authcontroller.logout.bind(authcontroller));

export default authRouter;
