import { matchedData } from "express-validator";
import topicModel from "../../models/topicModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getTopicsByCategoryId(req, res) {
  try {
    const requestData = matchedData(req);
    console.log({
      requestData: {
        ...(requestData?.categoryId
          ? { category: requestData.categoryId }
          : {}),
      },
    });

    const filterObject = {
      ...(requestData?.categoryId ? { category: requestData.categoryId } : {}),
      ...(requestData?.femaleOnly && requestData?.femaleOnly === "true"
        ? { femaleOnly: true }
        : { femaleOnly: false }),
    };

    console.log({ filterObject });

    const topics = await topicModel.find({
      ...filterObject,
    });

    response200(res, topics);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
