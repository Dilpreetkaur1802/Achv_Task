import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "User",
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentStatus: {
      type: "String",
      enum: ["pending", "paid"],
      default: "pending",
    },
    razorpayPaymentId: {
      type: String,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Orders = mongoose.model("Order", orderSchema);
export { Orders };
