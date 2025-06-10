import { matchedData } from "express-validator";
import topicModel from "../../models/topicModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getPublicTopics(req, res) {
  try {
    const requestData = matchedData(req);
    const topics = await topicModel.find({
      public: true,
    });

    response200(res, topics);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
