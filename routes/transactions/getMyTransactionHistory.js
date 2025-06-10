import { matchedData } from "express-validator";
import transactionModel from "../../models/transactionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getMyTransactionHistory(req, res) {
  try {
    const user = req.user;
    const requestData = matchedData(req);

    const transactions = await transactionModel
      .find({
        user: user._id,
      })
      .sort({ createdAt: -1 });

    response200(res, transactions);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
