import express from "express";
import { matchedData } from "express-validator";
import pushSubscriptionModel from "../../models/pushSubscriptionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { createdResponse } from "../../responses/successResponses.js";

const router = express.Router();

//create chatbot function
export default async function (req, res) {
  try {
    const requestData = matchedData(req);
    console.log({ requestData });

    const subscription = await new pushSubscriptionModel({
      ...requestData,
      user: requestData?.user
    }).save();
    createdResponse(res, subscription);
  } catch (err) {
    internalServerResponse(res, err);
  }
}

//route for creating chatbot
