import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        joinDateTime: {
          type: Date,
        },
        exitDateTime: {
          type: Date,
        },
        speaking: {
          type: Boolean,
        },
        speakingStartDateTime: {
          type: Date,
        },
      },
    ],
    maximumMembers: {
      type: Number,
    },
    topic: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Topic",
    },
    status: {
      type: "String",
      enum: ["open", "closed", "ended"],
    },
    room: {
      type: Object,
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

export default mongoose.model("Session", sessionSchema);
