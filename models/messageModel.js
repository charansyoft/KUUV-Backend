import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    payload: {
      text: {
        type: String,
      },
      files: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "File",
      },
    },
    receivedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
        },
      },
    ],
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        timestamp: {
          type: Date,
        },
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
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

messageSchema.index({ chat: 1, deleted: 1, hidden: 1, createdBy: 1 });
messageSchema.index({ chat: 1, hidden: 1, _id: -1 });
messageSchema.index({ chat: 1, createdByType: 1, createdAt: -1 });
export default mongoose.model("Message", messageSchema);
