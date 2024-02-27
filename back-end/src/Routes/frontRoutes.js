import express from "express";
import { FrontController } from "../Controllers/frontController.js";

const Controller = new FrontController();
const frontRoutes = express.Router();

frontRoutes.get("/products", Controller.getProducts);
frontRoutes.get("/productswPage", Controller.getProductswPaginate);
frontRoutes.get("/products/:id", Controller.getProductswId);
frontRoutes.get("/productwc/:categoryId", Controller.getProductswCategoryId);

export { frontRoutes };
