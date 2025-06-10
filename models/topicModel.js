import mongoose from "mongoose";

const topicSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "File",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    maximumMembersPerSession: {
      type: Number,
      required: true,
    },
    public: {
      type: Boolean,
      default: false,
    },
    femaleOnly: {
      type: Boolean,
      default: false,
    },
    elite: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true }
);

export default mongoose.model("Topic", topicSchema);
