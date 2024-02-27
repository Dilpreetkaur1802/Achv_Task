import mongoose from "mongoose";
import { Product } from "../Models/productModel.js";
import { v2 as cloudinary } from "cloudinary";

class ProductController {
  create = async (req, res) => {
    try {
      let { name, description, price, category, quantity } = req.body;
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !quantity ||
        name === "" ||
        description === "" ||
        price === "" ||
        quantity === ""
      ) {
        return res.status(404).json({
          success: false,
          message: "Please provide Product details",
        });
      }
      if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
        return res.status(404).json({
          success: false,
          message: "Please provide valid price and quantity",
        });
      }
      if (category.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Please select product category",
        });
      }

      category = category.split(",");

      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded." });
      }

      const fileUpload = cloudinary.uploader
        .upload_stream(
          {
            folder: "products",
            resource_type: "auto",
          },
          async (error, result) => {
            if (error) {
              return res.status(500).json({
                success: false,
                message: "Error in uploading File",
                error: error.message,
              });
            }
            const product = Product({
              name,
              description,
              category,
              price,
              quantity,
              file: result.url,
            });

            const newProduct = await product.save();
            if (newProduct) {
              res.status(200).json({
                success: true,
                message: "Product added successfully",
                data: newProduct,
              });
            } else {
              res.status(400).json({
                success: false,
                message: "Error in adding product",
              });
            }
          }
        )
        .end(req.file.buffer);
    } catch (error) {
      console.log("Error in Product creation", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };

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

  edit = async (req, res) => {
    try {
      const productId = req.params.id;
      const updateData = req.body;

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

      let { name, description, price, category, quantity } = updateData;
      if (
        !name ||
        !description ||
        !price ||
        !category ||
        !quantity ||
        name === "" ||
        description === "" ||
        price === "" ||
        quantity === ""
      ) {
        return res.status(404).json({
          success: false,
          message: "Please provide Product details",
        });
      }
      if (isNaN(price) || isNaN(quantity) || price < 0 || quantity < 0) {
        return res.status(404).json({
          success: false,
          message: "Please provide valid price and quantity",
        });
      }
      if (category.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Please select product category",
        });
      }

      updateData.category = category.split(",");

      if (req.file) {
        const fileUpload = cloudinary.uploader
          .upload_stream(
            {
              folder: "products",
              resource_type: "auto",
            },
            async (error, result) => {
              if (error) {
                return res.status(400).json({
                  success: false,
                  message: "Error in uploading the file",
                  error: error.message,
                });
              }

              updateData.file = result.url;
              const data = await Product.findByIdAndUpdate(
                productId,
                updateData,
                {
                  new: true,
                  runValidators: true,
                }
              );

              if (data) {
                res.status(200).json({
                  success: true,
                  message: "Product added successfully",
                  data: data,
                });
              } else {
                res.status(400).json({
                  success: false,
                  message: "Error in adding product",
                });
              }
            }
          )
          .end(req.file.buffer);
      } else {
        const data = await Product.findById(productId);
        updateData.file = data.file;
        const newdata = await Product.findByIdAndUpdate(productId, updateData, {
          new: true,
          runValidators: true,
        });

        if (Object.entries(newdata) === 0) {
          res.status(404).json({
            success: false,
            message: "Error in updating product data",
          });
        } else {
          res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: newdata,
          });
        }
      }
    } catch (error) {
      console.log("Error in Product Updation", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };

  delete = async (req, res) => {
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

      const deletedProduct = await Product.findByIdAndDelete(productId);

      if (deletedProduct) {
        res.status(200).json({
          success: true,
          message: "Product deleted successfully",
          data: deletedProduct,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }
    } catch (error) {
      console.log("Error in Product Deletion", error.message);
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
          data: deletedProduct,
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

export { ProductController };
