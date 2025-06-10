import { rzp } from "../../config/razorpayConfig.js";
import calculateMinutes from "../../helpers/calculateMinutes.js";
import transactionModel from "../../models/transactionModel.js";
import userModel from "../../models/userModel.js";

export default async function createTransaction({
  userId,
  type,
  object,
  sessionStartTime,
  sessionEndTime,
  service,
}) {
  try {
    if (!userId || !type || !object) {
      return;
    }
    const user = await userModel.findOne({ _id: userId, deleted: false });

    let billAmount = 0;
    if (type === "subscription") {
      billAmount = parseFloat(object?.cost);
    }
    if (type === "topup") {
      billAmount = parseFloat(object?.cost);
    }
    if (type === "session" && sessionStartTime && sessionEndTime) {
      const billableMinutes = calculateMinutes(
        sessionStartTime,
        sessionEndTime
      );
      const costPerMinute = 10;
      billAmount = parseFloat(billableMinutes).toFixed(2) * costPerMinute;

      await userModel.findOneAndUpdate(
        {
          _id: userId,
        },
        {
          credits: parseFloat(user?.credits ?? 0) - parseFloat(billAmount),
        },
        { new: true }
      );
    }

    const transaction = new transactionModel({
      user: userId,
      type,
      object,
      sessionStartTime,
      sessionEndTime,
      billAmount,
      // status: type === "session" ? "completed" : "initiated",
      status: "completed",
    });
    const createTransactionResult = await transaction.save();

    let rzpOrder;
    if (service === "razorpay") {
      rzpOrder = await rzp.orders.create({
        amount: billAmount * 100,
        currency: "INR",
        receipt: createTransactionResult?._id,
        partial_payment: false,
      });
    }

    return {
      ...createTransactionResult?._doc,
      ...(service === "razorpay" ? { rzpOrderId: rzpOrder?.id } : {}),
    };
  } catch (err) {
    console.log(err);
  }
}
