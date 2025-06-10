import transactionModel from "../../models/transactionModel.js";
import userModel from "../../models/userModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function razorPayWebhook(req, res) {
  try {
    console.log({ request: JSON.stringify(req.body) });
    const eventType = req.body?.event;

    if (eventType === "order.paid") {
      const orderId = req.body?.payload?.order?.entity?.id;
      const transactionId = req.body?.payload?.order?.entity?.receipt;
      console.log({ orderId });
      console.log({ transactionId });

      const transaction = await transactionModel.findOne({
        _id: transactionId,
      });

      if (transaction.type === "topup") {
        const user = await userModel.findOne({
          _id: transaction?.user,
          deleted: false,
        });
        const updateUserResult = await userModel.findOneAndUpdate(
          { _id: transaction.user },
          { credits: user?.credits + transaction?.object?.credits },
          { new: true }
        );
      }

      if (transaction.type === "subscription") {
        await userModel.findOneAndUpdate(
          { _id: transaction.user },
          { elite: true, subscriptionDate: new Date() },
          { new: true }
        );
      }

      const updateTransactionResult = await transactionModel.findOneAndUpdate(
        {
          _id: transactionId,
        },
        {
          status: "completed",
        },
        { new: true }
      );
      console.log({ updateTransactionResult });
    }

    response200(res, {});
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
