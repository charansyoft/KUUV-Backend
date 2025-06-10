import { matchedData } from "express-validator";
import locationModel from "../../models/locationModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getLocationById(req, res) {
  try {
    const requestData = matchedData(req);
    console.log("Received Request from getLocationById:".requestData);
    const location = await locationModel.findOne({
      _id: requestData.locationId,
      deleted: false,
    });
    response200(res, location);
  } catch (err) {
    console.log({ err });
    internalServerResponse(res, err);
  }
}
