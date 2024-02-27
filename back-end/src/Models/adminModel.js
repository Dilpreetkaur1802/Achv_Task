import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
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
});

const Admin = mongoose.model("Admin", adminSchema);

export { Admin };

// const adminUser = new Admin({ username: "admin", password: "12345678" });
// adminUser.save();
// console.log("Admin created");
