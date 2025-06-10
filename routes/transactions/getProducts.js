import { matchedData } from "express-validator";
import productModel from "../../models/productModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function getProducts(req, res) {
  try {
    const requestData = matchedData(req);
    const products = await productModel.find();

    response200(res, products);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
