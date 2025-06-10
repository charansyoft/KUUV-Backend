import { matchedData } from "express-validator";
import transactionModel from "../../models/transactionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getTransactionHistoryByUserId(req, res) {
  try {
    const requestData = matchedData(req);
    let transactions;
    if (requestData?.userId) {
      transactions = await transactionModel.find({
        user: requestData?.userId,
      });
    } else {
      transactions = await transactionModel.find();
    }

    response200(res, transactions);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
