import { OrdersController } from "../Controllers/orderController.js";
import express from "express";

const orderRoutes = express.Router();
const Controller = new OrdersController();

orderRoutes.post("/orders", Controller.createOrder);
orderRoutes.post("/success", Controller.verifyPayment);
orderRoutes.get("/orderList", Controller.getAllOrders);
orderRoutes.get("/orderDeatils/:id", Controller.getOrderDetails);

export { orderRoutes };
