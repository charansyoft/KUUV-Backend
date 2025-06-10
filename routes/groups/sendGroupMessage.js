import { matchedData } from "express-validator";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import { io } from "../../socket/socket.js";
import groupMessageModel from "../../models/GroupMessagesModel.js";

import fs from "fs/promises";
import path from "path";
import mime from "mime-types";

// Helper function to convert image path to base64 data URI
async function convertImageToBase64(imagePath) {
  if (!imagePath) return null;

  try {
    // Normalize path (replace backslash with slash)
    const normalizedPath = imagePath.replace(/\\/g, "/");

    // Resolve full absolute path to uploads folder
    // Assuming 'uploads' folder is in your project root
    const fullPath = normalizedPath.startsWith("uploads/")
      ? path.resolve(normalizedPath)
      : path.resolve("uploads", normalizedPath);

    // Read image file as buffer
    const imgBuffer = await fs.readFile(fullPath);

    // Get MIME type (fallback to 'image/jpeg' if not detected)
    const contentType = mime.lookup(fullPath) || "image/jpeg";

    // Convert buffer to base64 string
    const base64Data = imgBuffer.toString("base64");

    // Return full data URI string
    return `data:${contentType};base64,${base64Data}`;
  } catch (error) {
    console.error("Failed to convert image to base64:", error);
    return null; // Return null on error so it doesn't break the response
  }
}

export default async function sendGroupMessages(req, res) {
    console.log("SEND AND EMIT MSGS FILE IS STARTED TO RUN")

  try {
    const requestData = matchedData(req);
    const groupId = req.params.groupId;
    const { message, type } = req.body;
    const user = req?.user;
    console.log(`groupId: ${groupId}, message: ${message}, type: ${type}, user: ${user} ----`)
    if (type !== "msg") {
      return res.status(400).json({ message: "Currently only 'msg' type is supported" });
    }

    // Create the message document
    const newMessage = await groupMessageModel.create({
      group: groupId,
      type,
      Message: message,
      createdBy: user._id,
      updatedBy: user._id,
      receivedBy: [],
      readBy: [],
    });

    // Populate createdBy user details
    await newMessage.populate({
      path: "createdBy",
      select: "name phone profilePic",
    });

    // Prepare response message object
    const responseMessage = {
      _id: newMessage._id,
      group: newMessage.group,
      type: newMessage.type,
      Message: newMessage.Message,
      receivedBy: newMessage.receivedBy,
      readBy: newMessage.readBy,
      createdBy: newMessage.createdBy,
      createdAt: newMessage.createdAt,
      updatedAt: newMessage.updatedAt,
    };

    // Convert createdBy.profilePic from filepath to base64 data URI
    if (responseMessage.createdBy?.profilePic) {
      responseMessage.createdBy.profilePic = await convertImageToBase64(responseMessage.createdBy.profilePic);
    }

    console.log("Response Message GROUP CHATTTTTT emit :", responseMessage)
    // Emit the message to the group room via socket.io
    io.to(groupId).emit("newGroupMessage", responseMessage);
    console.log("Message emitted")
    // Send back the success response
    return response200(res, {
      message: "Group message sent successfully",
      data: responseMessage,
    });
  } catch (err) {
    internalServerResponse(res, err);
  }
}
