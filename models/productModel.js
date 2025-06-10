import mongoose from "mongoose";

const productModel = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    credits: {
      type: Number,
      required: true,
    },
    cost: {
      type: Number,
      required: true,
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model("Product", productModel);
