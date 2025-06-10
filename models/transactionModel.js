import mongoose from "mongoose";

const transactionModel = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    type: {
      type: String,
      enum: ["subscription", "topup", "session"],
    },
    object: {
      type: Object,
    },
    sessionStartTime: {
      type: Number,
    },
    sessionEndTime: {
      type: Number,
    },
    billAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ["initiated", "completed"],
      default: "initiated",
    },
  },

  { timestamps: true }
);

export default mongoose.model("Transaction", transactionModel);
