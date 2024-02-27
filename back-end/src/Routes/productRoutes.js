import { ProductController } from "../Controllers/productController.js";
import express from "express";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const productRoutes = express.Router();
const Controller = new ProductController();

productRoutes.post("/", upload.single("file"), Controller.create);
productRoutes.get("/", Controller.getProducts);
productRoutes.get("/:id", Controller.getProductswId);
productRoutes.put("/:id", upload.single("file"), Controller.edit);
productRoutes.delete("/:id", Controller.delete);

export { productRoutes };
