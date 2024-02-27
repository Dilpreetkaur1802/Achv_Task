import express from "express";
import { UserController } from "../Controllers/userController.js";

const userRoutes = express.Router();
const Controller = new UserController();

userRoutes.post("/", Controller.create);
userRoutes.get("/", Controller.getUsers);
userRoutes.get("/:id", Controller.getUserswId);
userRoutes.put("/:id", Controller.edit);
userRoutes.delete("/:id", Controller.delete);
userRoutes.post("/login", Controller.login);

export { userRoutes };
