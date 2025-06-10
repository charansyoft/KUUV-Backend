import express from "express";
import { matchedData } from "express-validator";
import productModel from "../../models/productModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

const router = express.Router();
export default async function getProductById(req, res) {
  try {
    const requestData = matchedData(req);
    const product = await productModel.findOne({
      _id: requestData.productId,
    });
    response200(res, product);
  } catch (err) {
    console.log({ err });
    internalServerResponse(res, err);
  }
}
