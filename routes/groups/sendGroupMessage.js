import { matchedData } from "express-validator";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import { io, connectedUsers } from "../../socket/socket.js";
import groupMessageModel from "../../models/GroupMessagesModel.js";
import categoryModel from "../../models/categoryModel.js";

import fs from "fs/promises";
import path from "path";
import mime from "mime-types";

// Helper: Convert image path to base64 data URI
async function convertImageToBase64(imagePath) {
  if (!imagePath) return null;

  try {
    const normalizedPath = imagePath.replace(/\\/g, "/");
    const fullPath = normalizedPath.startsWith("uploads/")
      ? path.resolve(normalizedPath)
      : path.resolve("uploads", normalizedPath);

    const imgBuffer = await fs.readFile(fullPath);
    const contentType = mime.lookup(fullPath) || "image/jpeg";
    const base64Data = imgBuffer.toString("base64");

    return `data:${contentType};base64,${base64Data}`;
  } catch (error) {
    console.error("Failed to convert image to base64:", error);
    return null;
  }
}

export default async function sendGroupMessages(req, res) {
  console.log("📨 SEND AND EMIT MSGS FILE IS STARTED TO RUN");

  try {
    const requestData = matchedData(req);
    const groupId = req.params.groupId;
    const { message, type } = req.body;
    const user = req.user;

if (!["msg", "post"].includes(type)) {
  return res.status(400).json({ message: "Only 'msg' and 'post' types are supported" });
}

// 1. Get group with joined user phones
const group = await categoryModel
  .findById(groupId)
  .populate("joinedUsers", "_id phone")
  .lean();

if (!group) {
  console.log("❌ Group not found");
  return res.status(404).json({ message: "Group not found" });
}

// 2. Prepare receivedBy (phones of online users except sender)
const senderId = user._id.toString();
const senderPhone = group.joinedUsers.find(u => u._id.toString() === senderId)?.phone;

const receivedBy = group.joinedUsers
  .filter(u => u.phone !== senderPhone && connectedUsers.has(u.phone))
  .map(u => u.phone);

console.log("📱 Online Users Receiving:", receivedBy);

// 3. Create message/post
const newMessage = await groupMessageModel.create({
  group: groupId,
  type,
  Message: message || "", // optional fallback
  createdBy: user._id,
  updatedBy: user._id,
  receivedBy,
  readBy: [],
});


    // 4. Populate sender
    await newMessage.populate({ path: "createdBy", select: "name phone profilePic" });

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

    if (responseMessage.createdBy?.profilePic) {
      responseMessage.createdBy.profilePic = await convertImageToBase64(responseMessage.createdBy.profilePic);
    }

    // 5. Emit and return
io.to(groupId).emit("NewGroupMessage", responseMessage);
    console.log("📤 Emitted Message to:", groupId);

    return response200(res, {
      message: "Group message sent successfully",
      data: responseMessage,
    });
  } catch (err) {
    console.log("❌ Error sending group message:", err);
    internalServerResponse(res, err);
  }
}