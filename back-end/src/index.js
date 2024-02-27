import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDb } from "./Config/config.js";
import { productRoutes } from "./Routes/productRoutes.js";
import { categoryRoutes } from "./Routes/categoryRoutes.js";
import { userRoutes } from "./Routes/userRoutes.js";
import { authRoutes } from "./Routes/authRoutes.js";
import { frontRoutes } from "./Routes/frontRoutes.js";
import { orderRoutes } from "./Routes/orderRoutes.js";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();
const app = express();
connectDb();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", authRoutes);
app.use("/api/home", frontRoutes);
app.use("/api", orderRoutes);

const port = process.env.PORT || 3000;
app.listen(9002, () => {
  console.log(`Listening on port ${port}`);
});
