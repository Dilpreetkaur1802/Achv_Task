import mongoose from "mongoose";
import { Category } from "../Models/categoryModel.js";

class CategoryController {
  getCategories = async (req, res) => {
    try {
      const categories = await Category.find({});
      if (!categories) {
        return res.status(404).json({
          success: false,
          message: "No Categories found!",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Here are the categories",
          data: categories,
          total: categories.length,
        });
      }
    } catch (error) {
      console.log("Error in getting categories!");
      return res.status(400).json({
        success: false,
        message: "Something went wrong in getting category",
        error: error.message,
      });
    }
  };
  getCategoryWithId = async (req, res) => {
    try {
      const categoryId = req.params.id;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: "Invalid Category Id",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Please provide Valid Category id.",
        });
      }

      const category = await Category.findById(categoryId);

      if (!category) {
        res.status(404).json({
          success: false,
          message: "No Categories found!",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Here is the category",
          data: category,
        });
      }
    } catch (error) {
      console.log("Error in getting categories!");
      res.status(400).json({
        success: false,
        message: "Something went wrong in getting category with Id",
        error: error.message,
      });
    }
  };
  getCategoryCount = async (req, res) => {
    try {
      const count = await Category.countDocuments();
      if (count) {
        res.status(200).json({
          success: true,
          message: `${count} Categories Found`,
          data: count,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Undefined categories",
        });
      }
    } catch (error) {
      console.log("error in category count", error);
      res.status(500).json({
        success: true,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };
  createCategories = async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || name === "") {
        res.status(204).json({
          success: false,
          message: "Please enter the category name",
        });
      }

      const categoryExist = await Category.findOne({ name: name });
      if (categoryExist) {
        res.status(300).json({
          success: false,
          message: `${name} Already exists, Please enter a different Category`,
        });
      }
      let category = Category({
        name: name,
      });

      await category.save();
      res.status(200).json({
        success: true,
        message: "Category added Successfully!",
        data: category,
      });
    } catch (error) {
      console.log("Error in Creating!");
      res.status(400).json({
        success: false,
        message: "Something went wrong with creating category",
        error: error.message,
      });
    }
  };
  updateCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;
      const updatedCategory = req.body;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: "Invalid Category Id",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Please provide Valid Category id.",
        });
      }

      const categoryData = await Category.findById(categoryId);

      if (!categoryData) {
        res.status(404).json({
          success: false,
          message: "No Categories found!",
        });
      }

      if (Object.entries(updatedCategory) === 0) {
        return res.status(400).json({
          success: false,
          message: "Please provide data to update.",
        });
      }

      let category = await Category.findByIdAndUpdate(
        categoryId,
        updatedCategory,
        {
          new: true,
          runValidators: true,
        }
      );
      if (Object.entries(category) !== 0) {
        res.status(200).json({
          success: true,
          message: "Category updated successfully.",
          data: category,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Category not found.",
        });
      }
    } catch (error) {
      console.log("Error in updating");
      res.status(400).json({
        success: false,
        message: "Something went wrong with updating category",
        error: error.message,
      });
    }
  };
  deleteCategory = async (req, res) => {
    try {
      const categoryId = req.params.id;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: "Invalid Category Id",
        });
      }

      if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Please provide Valid Category id.",
        });
      }

      const categoryData = await Category.findByIdAndDelete(categoryId);

      if (categoryData) {
        res.status(200).json({
          success: true,
          message: "Category Deleted Successfully!",
          data: categoryData,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "Category not found!",
        });
      }
    } catch (error) {
      console.log("Error in deleting");
      res.status(400).json({
        success: false,
        message: "Something went wrong with deleting category!",
        error: error.message,
      });
    }
  };
}

export { CategoryController };
