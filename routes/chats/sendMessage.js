import express from "express";
import { matchedData } from "express-validator";
import chatModel from "../../models/chatModel.js";
import messageModel from "../../models/messageModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import { io } from "../../socket/socket.js";
import User from "../../models/userModel.js"; // Import userModel to fetch user details

const router = express.Router();

export default async function sendMessage(req, res) {
  try {
    console.log("sendMessage: Function started");

    // Extract only validated fields from the body
    const requestData = matchedData(req);
    console.log("sendMessage: Validated request data:", requestData);

    const chatId = req.params.chatId;
    console.log(`sendMessage: Chat ID received: ${chatId}`);

    // Extract message and type from requestData
    const { message, type } = requestData;
    console.log("sendMessage: message:", message, "type:", type);

    // Build the payload object expected by your schema
    const payload = {
      text: message,
      files: [], // assuming files empty array if none provided
    };

    // Get the user info from middleware (assumed attached on req)
    const user = req?.user;
    console.log("sendMessage: User info:", user);

    // Check if chat exists
    const chat = await chatModel.findById(chatId);
    if (!chat) {
      console.log(`sendMessage: Chat with ID ${chatId} not found`);
      return res.status(404).json({ message: "Chat not found" });
    }

    console.log(`sendMessage: Chat with ID ${chatId} found, creating message`);

    // Create and save the new message
    const newMessage = new messageModel({
      chat: chatId,
      payload,
      type,
      createdBy: user?._id,
      updatedBy: user?._id,
    });

    await newMessage.save();
    console.log("sendMessage: Message saved:", newMessage);

    // Fetch user details for response population
    const messageUser = await User.findById(user._id).select("name phone");
    if (!messageUser) {
      console.log("sendMessage: User not found");
      return res.status(404).json({ message: "User not found" });
    }

    console.log("sendMessage: User details fetched:", messageUser);

    // Construct response message with user info populated
    const responseMessage = {
      ...newMessage.toObject(),
      createdBy: {
        _id: messageUser._id,
        phone: messageUser.phone,
        name: messageUser.name,
      },
    };

    // Update chat's lastMessage and lastMessageTime
    chat.lastMessage = {
      _id: newMessage._id,
      payload: newMessage.payload,
      createdBy: {
        _id: messageUser._id,
        name: messageUser.name,
        phone: messageUser.phone,
      },
      createdAt: newMessage.createdAt,
    };

    chat.lastMessageTime = newMessage.createdAt;

    await chat.save();
    console.log("sendMessage: Chat updated with last message:", chat.lastMessage);

    // Emit new message event to clients in the chat room
    console.log(`sendMessage: Emitting 'newMessage' event to chatId: ${chatId}`);
    io.to(chatId).emit("newMessage", responseMessage);
    console.log(`sendMessage: 'newMessage' event emitted for chatId: ${chatId}`, responseMessage);

    return response200(res, {
      message: "Message sent successfully",
      data: responseMessage,
    });
  } catch (err) {
    console.error("sendMessage: Error occurred:", err);
    internalServerResponse(res, err);
  }
}
