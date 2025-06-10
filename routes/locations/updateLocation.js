import { matchedData } from "express-validator";
import locationModel from "../../models/locationModel.js";
import { response200 } from "../../responses/successResponses.js";

export default async function updateLocation(req, res) {
  try {
    const requestData = matchedData(req);
    const user = req?.user;

    const result = await locationModel.findOneAndUpdate(
      { _id: requestData?.locationId },
      { ...requestData, updatedBy: user?._id },
      { new: true }
    );

    response200(res, result);
  } catch (error) {
    console.log({ error });
    res.status(500).json({ error: "Server error" });
  }
}
