import { matchedData } from "express-validator";
import topicModel from "../../models/topicModel.js";
import { badRequest, unauthorized } from "../../responses/errorResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function createTopic(req, res) {
  try {
    const role = req.user.role;
    if (role !== "admin") {
      return unauthorized(res);
    }

    const requestData = matchedData(req);
    const existingTopic = await topicModel.findOne({
      name: requestData.name,
      category: requestData.categoryId,
      elite: requestData?.elite,
      femaleOnly: requestData?.femaleOnly,
    });
    if (existingTopic) {
      return badRequest(res, [{ msg: "Topic already exists" }]);
    }
    const topic = new topicModel({
      ...requestData,
    });

    const createTopicResult = await topic.save();
    response200(res, createTopicResult);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
