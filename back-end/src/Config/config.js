import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);
    console.log("Database Connected!!");
  } catch (error) {
    console.log("Opps Error in Connecting");
    console.error(error);
    process.exit(1);
  }
};

export { connectDb };
