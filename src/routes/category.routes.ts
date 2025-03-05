import express from "express";
import { CategoryController } from "../controllers/category.controller";
import { TYPES } from "../config/types.config";
import { validateDataAndImage } from "../validator/unitvalidate";
import { createCategorySchema } from "../validator/zod.validator";
import { container } from "../config/inversify.config";
import fs from "fs";
import { uploadPathCategory } from "../utils/uploads";
import multer from "multer";
import verifyToken from "../middleware/authorization";
import { UserRole } from "../enum";

const categoryRouter = express.Router();

if (!fs.existsSync(uploadPathCategory)) {
  fs.mkdirSync(uploadPathCategory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPathCategory);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const uploads = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const categorycontroller = container.get<CategoryController>(
  TYPES.CategoryController
);



categoryRouter.post(
  "/create-category",
  verifyToken([UserRole.Admin]), 
  uploads.single("image"),
  validateDataAndImage(createCategorySchema),
  categorycontroller.createCategory.bind(categorycontroller)
);


categoryRouter.put(
  "/update-category/:id",
  verifyToken([UserRole.Admin]), 
  uploads.single("image"),
  validateDataAndImage(createCategorySchema),
  categorycontroller.updateCategory.bind(categorycontroller)
);


categoryRouter.delete(
  "/delete-category/:id",
  verifyToken([UserRole.Admin]), 
  categorycontroller.deleteCategory.bind(categorycontroller)
);


categoryRouter.get(
  "/getall-category",
  verifyToken([UserRole.Admin, UserRole.Employee, UserRole.Customer]), 
  categorycontroller.getAllCategory.bind(categorycontroller)
);


categoryRouter.get(
  "/getone-category/:id",
  verifyToken([UserRole.Admin, UserRole.Employee, UserRole.Customer]), 
  categorycontroller.getOneCategory.bind(categorycontroller)
);

export default categoryRouter;
