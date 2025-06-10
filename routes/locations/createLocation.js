import { matchedData } from "express-validator";
import locationModel from "../../models/locationModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function createLocation(req, res) {
  try {
    const requestData = matchedData(req);
    const user = req.user;

    const result = await new locationModel({
      ...requestData,
      createdBy: user?._id,
      updatedBy: user?._id,
    }).save();

    response200(res, result);
  } catch (err) {
    console.log({ err });
    internalServerResponse(res);
  }
}
