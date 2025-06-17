import mongoose from "mongoose";

const groupMessagesSchema = new mongoose.Schema(
  {
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    type: {
      type: String,
      enum: ["post", "msg"],
      default: "msg",
    },
    Message: {
      type: String,
    },
    image: {
      type: String,
      default: "",
    },
    title: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
    },
    period: {
      type: String, // like "week", "day"
    },
    expressedInterest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // ✅ NEW FIELDS BELOW
    receivedBy: [
      {
        type: String, // or use ObjectId if tracking users
      },
    ],
    readBy: [
      {
        type: String, // or use ObjectId if tracking users
      },
    ],
  },
  { timestamps: true }
);

// Indexes for optimized queries
groupMessagesSchema.index({ group: 1, deleted: 1, createdAt: -1 });
groupMessagesSchema.index({ group: 1, _id: -1 });
groupMessagesSchema.index({ group: 1, "payload.text": "text" });

export default mongoose.model("GroupMessages", groupMessagesSchema);
