import express from "express";
import { matchedData } from "express-validator";
import postModel from "../../models/postModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

const router = express.Router();

export default async function updatePost(req, res) {
  try {
    const requestData = matchedData(req);

    const result = await postModel.findOneAndUpdate(
      {
        _id: requestData?.postId,
      },
      {
        ...requestData,
      },
      {
        new: true,
      }
    );

    return response200(res, result);
  } catch (err) {
    console.log(err);
    internalServerResponse(res, err);
  }
}
