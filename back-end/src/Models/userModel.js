import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide full user name"],
    default: "",
  },
  email: {
    type: String,
    required: [true, "Enter your email"],
    trim: true,
    lowercase: true,
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
  },
  mobile: {
    type: Number,
    required: [true, "Please enter phone number"],
    unique: true,
  },
});

const User = mongoose.model("User", userSchema);

export { User };
