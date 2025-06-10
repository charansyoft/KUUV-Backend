import { matchedData } from "express-validator";
import categoryModel from "../../models/categoryModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getCategoryById(req, res) {
  try {
    const requestData = matchedData(req);
    const category = await categoryModel.findOne({
      _id: requestData.categoryId,
    });
    response200(res, category);
  } catch (err) {
    console.log({ err });
    internalServerResponse(res, err);
  }
}
