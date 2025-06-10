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
      type: String, // or use ObjectId if referencing a File collection
     default: ""
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
      type: String,  // <-- Added field for time period like "week", "day"
    },
    expressedInterest: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    receivedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: Date,
      },
    ],
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: Date,
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GroupMessages",
    },
    mentionedUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    pinned: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Indexes for optimized queries
groupMessagesSchema.index({ group: 1, deleted: 1, createdAt: -1 });
groupMessagesSchema.index({ group: 1, _id: -1 });
groupMessagesSchema.index({ group: 1, "payload.text": "text" });

export default mongoose.model("GroupMessages", groupMessagesSchema);
