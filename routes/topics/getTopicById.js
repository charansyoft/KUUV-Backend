import { matchedData } from "express-validator";
import topicModel from "../../models/topicModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getTopicById(req, res) {
  try {
    const requestData = matchedData(req);
    const topic = await topicModel.findOne({
      _id: requestData.topicId,
    });
    response200(res, topic);
  } catch (err) {
    console.log({ err });
    internalServerResponse(res, err);
  }
}
