import mongoose from "mongoose";

const postModel = new mongoose.Schema(
  {
    media: {
      type: [String], // array of image URLs
    },
    
    text: {
      type: String,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    viewedBy: [
      {
        date: {
          type: Date,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    likedBy: [
      {
        date: {
          type: Date,
        },
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Post", postModel);
