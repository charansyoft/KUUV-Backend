import mongoose from "mongoose";

const pushLogsSchema = new mongoose.Schema(
  {
    subscription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PushSubscription",
    },
    payload: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PushLogs", pushLogsSchema);
