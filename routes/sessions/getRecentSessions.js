import { matchedData } from "express-validator";
import sessionModel from "../../models/sessionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getRecentSessions(req, res) {
  try {
    const user = req.user;
    const requestData = matchedData(req);

    const sessions = await sessionModel
      .find({
        "members.user": user._id,
        ...(req.query?.elite ? { elite: req.query.elite } : {}),
        ...(req.query?.femaleOnly ? { elite: req.query.femaleOnly } : {}),
      })
      .sort({ updatedAt: -1 })
      .limit(5);
    //show last 5
    response200(res, sessions);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
