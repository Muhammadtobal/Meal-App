import express from "express";
import { TYPES } from "../config/types.config";
import { container } from "../config/inversify.config";
import { TableController } from "../controllers/table.controller";
import { validateDataAndImage } from "../validator/unitvalidate";
import { createTableSchema, updateTableSchema } from "../validator/zod.validator";
import verifyToken from "../middleware/authorization";
import { UserRole } from "../enum";

const tableRouter = express.Router();
const tablecontroller = container.get<TableController>(TYPES.TableController);

tableRouter.post(
  "/create-table",
  verifyToken([UserRole.Admin]),
  validateDataAndImage(createTableSchema),
  tablecontroller.createTable.bind(tablecontroller)
);


tableRouter.get(
  "/getall-table",
  verifyToken([UserRole.Admin]),
  tablecontroller.getAllTable.bind(tablecontroller)
);


tableRouter.get(
  "/getone-table/:id",
  verifyToken([UserRole.Admin]),
  tablecontroller.getOneTable.bind(tablecontroller)
);


tableRouter.put(
  "/update-table/:id",
  verifyToken([UserRole.Admin]),
  validateDataAndImage(updateTableSchema),
  tablecontroller.updateTable.bind(tablecontroller)
);

tableRouter.delete(
  "/delete-table/:id",
  verifyToken([UserRole.Admin]),
  tablecontroller.deleteTable.bind(tablecontroller)
);

export default tableRouter;
