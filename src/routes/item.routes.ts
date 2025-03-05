import express from "express";
import { ItemController } from "../controllers/item.controller";
import { container } from "../config/inversify.config";
import { TYPES } from "../config/types.config";
import multer from "multer";
import fs from "fs";
import { uploadPathItem } from "../utils/uploads";
import { validateDataAndImage } from "../validator/unitvalidate";
import { createItemSchema, updateItemSchema } from "../validator/zod.validator";
import { UserRole } from "../enum";
import verifyToken from "../middleware/authorization";

const itemRouter = express.Router();

if (!fs.existsSync(uploadPathItem)) {
  fs.mkdirSync(uploadPathItem, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPathItem);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const uploads = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const itemcontroller = container.get<ItemController>(TYPES.ItemController);

itemRouter.get(
  "/getall-item",
  verifyToken([UserRole.Admin, UserRole.Employee, UserRole.Customer]), 
  itemcontroller.getAllItem.bind(itemcontroller)
);


itemRouter.post(
  "/create-item",
  verifyToken([UserRole.Admin]), 
  uploads.single("image"),
  validateDataAndImage(createItemSchema),
  itemcontroller.createItem.bind(itemcontroller)
);


itemRouter.put(
  "/update-item/:id",
  verifyToken([UserRole.Admin]), 
  uploads.single("image"),
  validateDataAndImage(updateItemSchema),
  itemcontroller.updateItem.bind(itemcontroller)
);

itemRouter.get(
  "/getone-item/:id",
  verifyToken([UserRole.Admin, UserRole.Employee, UserRole.Customer]), 
  itemcontroller.getOneItem.bind(itemcontroller)
);


itemRouter.delete(
  "/delete-item/:id",
  verifyToken([UserRole.Admin]), 
  itemcontroller.deleteItem.bind(itemcontroller)
);

export default itemRouter;
