import { Product } from "../Models/productModel.js";
import mongoose from "mongoose";

class FrontController {
  getProducts = async (req, res) => {
    try {
      const products = await Product.find({});
      if (Object.entries(products) === 0) {
        res.status(404).json({
          success: false,
          message: "No Blogs Found!",
        });
      }
      res.status(200).json({
        success: true,
        message: "Here are you Products",
        data: products,
        total: products.length,
      });
    } catch (error) {
      console.log("Error in Product Listing", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };

  getProductswId = async (req, res) => {
    try {
      const productId = req.params.id;

      if (!productId) {
        return res.status(400).json({
          success: false,
          message: "Provide Product Id",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Product Id",
        });
      }

      const products = await Product.findById(productId);

      if (Object.entries(products) === 0) {
        res.status(404).json({
          success: false,
          message: "No Blogs Found!",
        });
      }
      res.status(200).json({
        success: true,
        message: "Here are you Products",
        data: products,
      });
    } catch (error) {
      console.log("Error in Product Listing", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };

  getProductswPaginate = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
      const pageSize = parseInt(req.query.pageSize) || 10; // Default page size to 10 if not provided

      const totalProducts = await Product.countDocuments({});
      const totalPages = Math.ceil(totalProducts / pageSize);

      const products = await Product.find({})
        .skip((page - 1) * pageSize)
        .limit(pageSize);

      if (products.length === 0) {
        return res.status(404).json({
          success: false,
          message: "No Products Found!",
        });
      }

      res.status(200).json({
        success: true,
        message: "Here are your Products",
        data: products,
        currentPage: page,
        totalPages: totalPages,
        totalProducts: totalProducts,
      });
    } catch (error) {
      console.log("Error in Product Listing", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };

  getProductswCategoryId = async (req, res) => {
    try {
      const categoryId = req.params.categoryId;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: "Provide Product Id",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid Product Id",
        });
      }

      const products = await Product.find({ category: categoryId });

      if (products) {
        res.status(200).json({
          success: true,
          message: "Product fetched successfully",
          data: products,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    } catch (error) {
      console.log("Error in Product W Category", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
}

export { FrontController };
