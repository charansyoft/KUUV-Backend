import express from "express";
import { matchedData } from "express-validator";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import pushLogsModel from "../../models/pushLogsModel.js";

const router = express.Router();
export default async function (req, res) {
  try {
    const requestData = matchedData(req);

    const pushLogs = await pushLogsModel({
      ...requestData,
    }).save();

    console.log({ pushLogs });

    response200(res, pushLogs);
  } catch (err) {
    internalServerResponse(res, err);
  }
}
