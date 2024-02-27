import express from "express";
import { AdminController } from "../Controllers/adminController.js";

const authRoutes = express.Router();
const Controller = new AdminController();

authRoutes.post("/signin", Controller.createAdmin);
authRoutes.post("/login", Controller.login);

export { authRoutes };
