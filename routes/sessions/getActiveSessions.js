import { matchedData } from "express-validator";
import sessionModel from "../../models/sessionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getActiveSessions(req, res) {
  try {
    const user = req.user;
    const requestData = matchedData(req);
    console.log({ user });

    let sessions;
    if (requestData.limit) {
      sessions = await sessionModel
        .find({
          status: "open",
          ...(req.query?.elite ? { elite: req.query.elite } : {}),
          ...(req.query?.femaleOnly ? { elite: req.query.femaleOnly } : {}),
        })
        .sort({ updatedAt: -1 })
        .limit(parseInt(requestData?.limit));
    } else {
      sessions = await sessionModel.find({
        status: "open",
        ...(req.query?.elite ? { elite: req.query.elite } : {}),
        ...(req.query?.femaleOnly ? { elite: req.query.femaleOnly } : {}),
      });
    }

    response200(res, sessions);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
