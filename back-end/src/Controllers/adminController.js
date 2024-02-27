import { Admin } from "../Models/adminModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

class AdminController {
  createAdmin = async (req, res) => {
    try {
      const { username, email, password } = req.body;

      if (
        !username ||
        !email ||
        !password ||
        username === "" ||
        email === "" ||
        password === ""
      ) {
        return res.status(404).json({
          success: false,
          message: "Please provide email, usename and password!",
        });
      }

      const newAdmin = new Admin({
        username: username,
        email: email,
        password: await bcrypt.hash(password, 10),
      });

      newAdmin.save();

      res.status(200).json({
        success: true,
        message: "Admin created Successfully",
        token: jwt.sign(
          { username: username, email: email },
          "secretkey123@@##",
          {
            expiresIn: "20d",
          }
        ),
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

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password || email === "" || password === "") {
        return res.status(404).json({
          success: false,
          message: "Please provide email and password!",
        });
      } else {
        const user = await Admin.findOne({ email: email });
        if (!user) {
          return res.status(404).json({
            success: false,
            message: "No user found with this email.",
          });
        }

        const matchPasswords = await bcrypt.compare(password, user.password);

        if (matchPasswords) {
          res.status(200).json({
            success: true,
            message: "Logging in Successfully",
            token: jwt.sign(
              { username: user.username, email: user.email },
              process.env.JWT_SECRET_KEY,
              {
                expiresIn: "20d",
              }
            ),
          });
        } else {
          return res.status(400).json({
            success: false,
            message: "Incorrect Password",
          });
        }
      }
    } catch (error) {
      console.log("Error in login!", error);
      res.status(500).json({
        success: false,
        message: "Something went wrong!",
        error: error.message,
      });
    }
  };
}

export { AdminController };
