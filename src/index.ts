import "reflect-metadata";
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import "./database/db";

import errorHandler from "../src/helpers/errorHandler";
import morgan from "morgan";
import { Request, Response, NextFunction } from "express";
import AppDataSource from "../src/database/db";

import passport from "passport";
import { PassportConfig } from "./middleware/passport";
import { container } from "./config/inversify.config";
import { setupSwagger } from "./config/swagger";
import router from "./routes/allRoutes.routes";

const app = express();

container.get(PassportConfig);
app.use(passport.initialize());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));
app.use(express.json());
app.use(helmet());

async function initializeDatabase() {
  try {
    await AppDataSource.initialize();
    console.log(" Database connection successful!");
  } catch (error) {
    console.error(" Database connection failed:", error);
  }
}

initializeDatabase();

app.use("/api", router);
setupSwagger(app);
app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
  console.log(
    `📄 Swagger docs available at http://localhost:${process.env.PORT}/api-docs`
  );
});

process.env.TZ = "Asia/Riyadh";

app.use((err: unknown, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});
