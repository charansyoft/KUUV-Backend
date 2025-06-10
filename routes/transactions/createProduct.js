import { matchedData } from "express-validator";
import productModel from "../../models/productModel.js";
import { unauthorized } from "../../responses/errorResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function createProduct(req, res) {
  try {
    const role = req.user.role;
    if (role !== "admin") {
      return unauthorized(res);
    }

    const requestData = matchedData(req);

    const product = new productModel({
      ...requestData,
    });

    await product.save();
    response200(res, product);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
