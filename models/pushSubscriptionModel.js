import mongoose from "mongoose";
import "./userModel.js";

const subscriptionSubSchema = new mongoose.Schema({
  token: {
    type: String,
    required: function () {
      // Require if type is 'app'
      return this.type === "app";
    },
  },
  deviceId: {
    type: String,
    required: function () {
      // Require if type is 'app'
      return this.type === "app";
    },
  },
});

const pushSubscriptionSchema = new mongoose.Schema(
  {
    subscription: {
      type: subscriptionSubSchema,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PushSubscription", pushSubscriptionSchema);
pushSubscriptionSchema.index({ org: 1, type: 1, user: 1 }, { sparse: true });
