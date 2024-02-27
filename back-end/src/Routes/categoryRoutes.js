import express from "express";
import { CategoryController } from "../Controllers/categoryController.js";
// import { Middleware } from "../Middlewares/authMiddleware.js";

const categoryRoutes = express.Router();
const Controller = new CategoryController();

categoryRoutes.get("/", Controller.getCategories);
categoryRoutes.get("/count", Controller.getCategoryCount);
categoryRoutes.get("/:id", Controller.getCategoryWithId);
categoryRoutes.post("/", Controller.createCategories);
categoryRoutes.put("/:id", Controller.updateCategory);
categoryRoutes.delete("/:id", Controller.deleteCategory);

export { categoryRoutes };
