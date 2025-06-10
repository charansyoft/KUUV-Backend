import { matchedData } from "express-validator";
import productModel from "../../models/productModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import createTransaction from "./createTransaction.js";

export default async function createOrder(req, res) {
  try {
    const user = req.user;
    const requestData = matchedData(req);
    let object;
    console.log({ requestData });
    if (requestData?.type === "subscription") {
      object = { subscription: "elite", cost: 5000 };
    }
    if (requestData?.type === "topup") {
      object = await productModel.findOne({
        _id: requestData?.objectId,
      });
    }

    console.log({ object });
    const createTransactionResult = await createTransaction({
      userId: user?._id,
      type: requestData?.type,
      object: object,
      service: requestData?.service,
    });

    response200(res, createTransactionResult);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
