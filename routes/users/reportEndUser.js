import { matchedData } from "express-validator";
import reportedUserModel from "../../models/reportedUserModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function reportEndUser(req, res) {
  try {
    const requestData = matchedData(req);
    const report = new reportedUserModel({
      ...requestData,
    });

    const saveReportResult = await report.save();

    response200(res, saveReportResult);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
