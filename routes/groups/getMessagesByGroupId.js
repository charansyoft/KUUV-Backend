import express from "express";
import { matchedData } from "express-validator";
import chatModel from "../../models/chatModel.js";
import messageModel from "../../models/messageModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

const router = express.Router();

export default async function getMessagesByGroupId(req, res) {
  try {
    const requestData = matchedData(req);
    const groupId = requestData?.groupId;

    let chat = await chatModel.findOne({ group: groupId });
    const messages = await messageModel.find({ chat: chat?._id });

    await messageModel.updateMany(
      {
        chat: chat?._id,
        "readBy.user": { $nin: [user?._id] },
      },
      {
        readBy: {
          $push: {
            user: user?._id,
            date: Date.now(),
          },
        },
      }
    );

    return response200(res, messages);
  } catch (err) {
    console.log(err);
    internalServerResponse(res, err);
  }
}
