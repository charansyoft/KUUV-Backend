import mongoose from "mongoose";
import multer from "multer";
import GroupMessagesModel from "./models/GroupMessagesModel.js"; // adjust path if needed
import { io } from "./socket/socket.js";
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
    const group = req.query.GroupId;
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const createdBy = req.user;

      const { name, description, price, period, type } = req.body;
      const newGroupMessage = new GroupMessagesModel({
        createdBy,
        title: name,
        description,
        price: Number(price),
        period,
        type,
        image: req.file.filename,
        group,
      });

      // Populate createdBy user details
      await newGroupMessage.populate({
        path: "createdBy",
        select: "name phone profilePic",
      });

      // Convert post image to base64 data URI
      let dataUriImage = null;
      try {
        const imagePath = path.resolve("uploads", newGroupMessage.image);
        const imgBuffer = await fs.readFile(imagePath);
        const contentType = mime.lookup(imagePath) || "image/jpeg";
        const base64Image = imgBuffer.toString("base64");
        dataUriImage = `data:${contentType};base64,${base64Image}`;
      } catch (imgErr) {
        console.error("Failed to convert post image to base64:", imgErr);
      }

      // Convert createdBy.profilePic to base64 data URI if exists
      if (newGroupMessage.createdBy?.profilePic) {
        newGroupMessage.createdBy.profilePic = await convertImageToBase64(newGroupMessage.createdBy.profilePic);
      }

      const savedMessage = await newGroupMessage.save();

      // Prepare the response message object
      const responseMessage = {
        _id: newGroupMessage._id,
        group: newGroupMessage.group,
        type: newGroupMessage.type,
        image: dataUriImage,
        title: newGroupMessage.title,
        description: newGroupMessage.description,
        price: newGroupMessage.price,
        period: newGroupMessage.period,
        expressedInterest: newGroupMessage.expressedInterest,
        receivedBy: newGroupMessage.receivedBy,
        readBy: newGroupMessage.readBy,
        createdBy: newGroupMessage.createdBy,
        createdAt: newGroupMessage.createdAt,
        updatedAt: newGroupMessage.updatedAt,
      };
        console.log( responseMessage,"responseMessage for postt:")
      io.to(group).emit("newGroupMessage", responseMessage);

      res.json({
        message: "Post saved successfully",
        data: savedMessage,
      });
    } catch (error) {
      console.error("Error saving post:", error);
      res.status(500).json({ error: "Server error" });
    }
  },
];

export default postController;
