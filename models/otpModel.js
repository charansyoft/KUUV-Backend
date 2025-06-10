import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId, // Correct reference to user._id
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60, // Auto-delete OTP after 60 seconds
    },
  },
  { timestamps: true }
);

export default mongoose.model("Otp", otpSchema);
