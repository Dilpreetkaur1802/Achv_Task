import { Orders } from "../Models/orderModel.js";
import { User } from "../Models/userModel.js";
import { Product } from "../Models/productModel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import mongoose from "mongoose";

class OrdersController {
  // API for creating the order
  createOrder = async (req, res) => {
    try {
      var { amount, currency, receipt } = req.body;
      if (!amount || !currency || !receipt) {
        return res.status(400).json({
          success: false,
          message: "Please provide amount, currency, and receipt",
        });
      }

      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_SECRET,
      });

      const options = {
        amount: amount, // Pass the amount in paisa
        currency: currency,
        receipt: receipt,
      };

      const order = await instance.orders.create(options);

      if (!order) {
        return res.status(500).json({
          success: false,
          message: "Couldn't create order. Please try again",
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "Order created successfully!",
          data: order,
        });
      }
    } catch (error) {
      console.log("Error in creating order", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
  // We will complete it with our front
  verifyPayment = async (req, res) => {
    const {
      orderCreationId,
      razorpayPaymentId,
      razorpayOrderId,
      razorpaySignature,
      userId,
      products,
      totalAmount,
    } = req.body;

    const shasum = crypto.createHmac(
      "sha256",
      `${process.env.RAZORPAY_SECRET}`
    );
    shasum.update(`${orderCreationId}|${razorpayPaymentId}`);

    const digest = shasum.digest("hex");
    if (digest !== razorpaySignature) {
      return res.status(400).json({
        success: false,
        message: "Invalid Payment/Transaction not legit!",
      });
    }

    const newOrderData = Orders({
      user: userId,
      products: products,
      totalAmount: totalAmount / 100, //converting to ruppess
      paymentStatus: "paid",
      razorpayPaymentId: razorpayPaymentId,
    });

    await newOrderData.save();

    console.log("Payment Successful");
    return res.status(200).json({
      success: true,
      message: "Payment successful",
      data: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
      },
    });
  };
  // get all order details
  getAllOrders = async (req, res) => {
    try {
      const orders = await Orders.find().populate("user");
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          // Map through each product in the order and populate its details
          const productsWithDetails = await Promise.all(
            order.products.map(async (product) => {
              const productDetails = await Product.findById(product.product);
              return {
                _id: productDetails._id,
                name: productDetails.name,
                quantity: product.quantity,
                price: product.price,
              };
            })
          );

          return {
            ...order._doc,
            products: productsWithDetails,
            userName: order.user.name, // Assuming 'name' is the field in the User model
          };
        })
      );
      if (ordersWithDetails.length !== 0) {
        res.status(200).json({
          success: true,
          messsage: "Order Details",
          data: ordersWithDetails,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No orders found",
        });
      }
    } catch (error) {
      console.log("Error in getting orders", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
  // get order details
  getOrderDetails = async (req, res) => {
    try {
      const orderId = req.params.id;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Invalid Order Id",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Please provide Valid order id.",
        });
      }

      const orders = await Orders.find({ _id: orderId }).populate("user");
      const ordersWithDetails = await Promise.all(
        orders.map(async (order) => {
          // Map through each product in the order and populate its details
          const productsWithDetails = await Promise.all(
            order.products.map(async (product) => {
              const productDetails = await Product.findById(product.product);
              return {
                _id: productDetails._id,
                name: productDetails.name,
                quantity: product.quantity,
                price: product.price,
              };
            })
          );

          return {
            ...order._doc,
            products: productsWithDetails,
            userName: order.user.name, // Assuming 'name' is the field in the User model
          };
        })
      );
      if (ordersWithDetails.length !== 0) {
        res.status(200).json({
          success: true,
          messsage: "Order Details",
          data: ordersWithDetails,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No orders found",
        });
      }
    } catch (error) {
      console.log("Error in getting orders", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
}

export { OrdersController };
