// routes/getMessages.js
import express from "express";
import messageModel from "../../models/messageModel.js"; // Assuming messageModel
import chatModel from "../../models/chatModel.js"; // Assuming chatModel
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

const router = express.Router();

export default async function getMessages(req, res) {
  try {
    const { chatId } = req.params; // Get the chatId from URL parameters

    // Validate if chatId is valid and exists in the database
    const chat = await chatModel.findById(chatId);
    if (!chat) {
      return res.status(404).json({ message: "Chat not found." });
    }

    // Retrieve the messages for the given chatId
    const messages = await messageModel.find({ chat: chatId })
      .populate('createdBy', 'name phone')  // Optionally populate user details
      .sort({ createdAt: 1 })  // Sort messages in ascending order (oldest to newest)
      .exec();

    // Return the messages as a response
    return response200(res, { messages });
  } catch (err) {
    console.log(err);
    internalServerResponse(res, err);
  }
}
