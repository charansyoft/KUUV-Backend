// routes/posts/createPost.js
import express from "express";
import { matchedData } from "express-validator";
import postModel from "../../models/postModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

const router = express.Router();

export default async function createPost(req, res) {
  try {
    const requestData = matchedData(req);
    const user = req?.user;

    const newPost = new postModel({
      media: requestData.media,
      text: requestData.text,
      deleted: false,
      createdBy: user?._id,
      likedBy: [],
      viewedBy: [],
    });

    const result = await newPost.save();

    return response200(res, result);
  } catch (err) {
    console.error("Error in createPost:", err);
    internalServerResponse(res, err);
  }
}
