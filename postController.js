import mongoose from "mongoose";
import multer from "multer";
import GroupMessagesModel from "./models/GroupMessagesModel.js";
import categoryModel from "./models/categoryModel.js";
import { io, connectedUsers } from "./socket/socket.js";
import fs from "fs/promises";
import path from "path";
import mime from "mime-types";

const upload = multer({ dest: "uploads/" });

// Helper function to convert image file path to base64 data URI
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

const postController = [
  upload.single("profileImage"),

  async (req, res) => {
    const groupId = req.query.GroupId;
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const createdBy = req.user;
      const { name, description, price, period, type } = req.body;

      // Fetch joined users and compute receivedBy
      const group = await categoryModel
        .findById(groupId)
        .populate("joinedUsers", "_id phone")
        .lean();

      if (!group) {
        return res.status(404).json({ error: "Group not found" });
      }

      const senderId = createdBy._id.toString();
      const senderPhone = group.joinedUsers.find(u => u._id.toString() === senderId)?.phone;

      const receivedBy = group.joinedUsers
        .filter(u => u.phone !== senderPhone && connectedUsers.has(u.phone))
        .map(u => u.phone);

      const newGroupMessage = new GroupMessagesModel({
        createdBy: createdBy._id,
        title: name,
        description,
        price: Number(price),
        period,
        type,
        image: req.file.filename,
        group: groupId,
        receivedBy,
        readBy: [],
      });

      // Populate createdBy user details
      await newGroupMessage.populate({
        path: "createdBy",
        select: "name phone profilePic",
      });

      // Convert post image to base64
      const dataUriImage = await convertImageToBase64(newGroupMessage.image);

      // Convert profilePic
      if (newGroupMessage.createdBy?.profilePic) {
        newGroupMessage.createdBy.profilePic = await convertImageToBase64(newGroupMessage.createdBy.profilePic);
      }

      const savedMessage = await newGroupMessage.save();

      const responseMessage = {
        _id: savedMessage._id,
        group: savedMessage.group,
        type: savedMessage.type,
        image: dataUriImage,
        title: savedMessage.title,
        description: savedMessage.description,
        price: savedMessage.price,
        period: savedMessage.period,
        expressedInterest: savedMessage.expressedInterest,
        receivedBy: savedMessage.receivedBy,
        readBy: savedMessage.readBy,
        createdBy: savedMessage.createdBy,
        createdAt: savedMessage.createdAt,
        updatedAt: savedMessage.updatedAt,
      };

      io.to(groupId).emit("NewGroupMessage", responseMessage);

      res.json({
        message: "Post saved successfully",
        data: responseMessage,
      });
    } catch (error) {
      console.error("Error saving post:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

export default postController;