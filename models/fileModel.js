import mongoose, { Schema } from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    mimetype: {
      type: String,
      required: true,
    },
    fileSize: {
      type: Number,
      required: true,
    },
    associatedId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "associatedWith",
    },

    associatedWith: {
      type: String,
      required: true,
      enum: ["Category", "User"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);
export default mongoose.model("File", fileSchema);
