import { User } from "../Models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

class UserController {
  create = async (req, res) => {
    try {
      const { name, email, password, mobile } = req.body;

      if (
        !name ||
        !email ||
        !password ||
        !mobile ||
        name === "" ||
        email === "" ||
        mobile === "" ||
        password === ""
      ) {
        return res.status(404).json({
          success: false,
          message: "Please provide name, email, mobile and password!",
        });
      }

      if (isNaN(mobile)) {
        return res.status(404).json({
          success: false,
          message: "Please enter a valid mobile number",
        });
      }

      const newUser = new User({
        name: name,
        email: email,
        mobile: mobile,
        password: await bcrypt.hash(password, 10),
      });

      newUser.save();

      res.status(200).json({
        success: true,
        message: "User created Successfully",
        token: jwt.sign({ name: name, email: email }, "secretkey123@@##", {
          expiresIn: "20d",
        }),
        data: newUser,
      });
    } catch (error) {
      console.log("Error in creating admin!", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: error.message,
      });
    }
  };

  getUsers = async (req, res) => {
    try {
      const data = await User.find({});
      if (Object.entries(User) !== 0) {
        res.status(200).json({
          success: true,
          message: "Users fetched Successfully",
          data: data,
          total: data.length,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "No users found",
        });
      }
    } catch (error) {
      console.log("Error in getting user");
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };

  getUserswId = async (req, res) => {
    const userId = req.params.id;
    if (!userId) {
      return res.send(400).json({
        success: false,
        message: "Please provide user ID",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.send(404).json({
        success: false,
        message: "Please provide a valid user ID",
      });
    }

    const user = await User.findById(userId);
    if (user) {
      res.status(200).json({
        success: true,
        message: "User found Successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  };

  edit = async (req, res) => {
    try {
      const userId = req.params.id;
      // const { name, email, mobile, password } = req.body;

      if (!userId) {
        return res.send(400).json({
          success: false,
          message: "Please provide user ID",
        });
      }
      if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.send(404).json({
          success: false,
          message: "Please provide a valid user ID",
        });
      }

      let updatedData = req.body;

      if (!updatedData || Object.entries(updatedData) === 0) {
        return res.status(404).json({
          success: false,
          message: "Please provide data to update!",
        });
      }

      if (updatedData.mobile && isNaN(updatedData.mobile)) {
        return res.status(404).json({
          success: false,
          message: "Please enter a valid mobile number",
        });
      }
      if (updatedData.name && updatedData.name === "") {
        return res.status(404).json({
          success: false,
          message: "Name can not be empty",
        });
      }
      if (updatedData.email && updatedData.email === "") {
        return res.status(404).json({
          success: false,
          message: "Email can not be empty",
        });
      }

      if (updatedData.password && updatedData.password !== "") {
        updatedData.password = await bcrypt.hash(updatedData.password, 10);
      }

      const userData = await User.findByIdAndUpdate(userId, updatedData, {
        new: true,
        runValidators: true,
      });

      if (Object.entries(userData) !== 0) {
        res.status(200).json({
          success: true,
          message: "User updated successfully",
          data: userData,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
      }
    } catch (error) {
      console.log("Error in editing user", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  };

  delete = async (req, res) => {
    const userId = req.params.id;

    if (!userId) {
      return res.send(400).json({
        success: false,
        message: "Please provide user ID",
      });
    }
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.send(404).json({
        success: false,
        message: "Please provide a valid user ID",
      });
    }

    const user = await User.findByIdAndDelete(userId);

    if (Object.entries(user) !== 0) {
      res.status(200).json({
        success: true,
        message: "User Deleted successfully",
        data: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
  };
  login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password || email === "" || password === "") {
        res.status(404).json({
          success: false,
          message: "Please provide email and password",
        });
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        res.status(500).json({
          success: false,
          message: "Please provide a valid email address",
        });
      }

      const user = await User.findOne({ email });

      if (user) {
        const verifyPassword = await bcrypt.compare(password, user.password);

        if (!verifyPassword) {
          res.status(401).json({
            success: false,
            message: "Incorrect Password",
          });
        }

        const token = jwt.sign(
          { name: user.name, email: user.email },
          process.env.JWT_SECRET_KEY,
          {
            expiresIn: "20d",
          }
        );

        res.status(200).json({
          success: true,
          message: "Logging in Successfully",
          token: token,
          data: user,
        });
      } else {
        res.status(404).json({
          success: false,
          message: "User not found with this Email Address",
        });
      }
    } catch (error) {
      console.log("Error in loggin in", error.message);
      res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: error.message,
      });
    }
  };
}

export { UserController };
