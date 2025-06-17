import express from "express";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import categoryModel from "../../models/categoryModel.js"; // Assuming categories are groups
import groupMessageModel from "../../models/GroupMessagesModel.js";
import fs from "fs/promises";
import path from "path";
import mime from "mime-types";

const router = express.Router();

async function convertImageToDataUri(imageName) {
  try {
    if (!imageName) return null;

    // Normalize slashes for cross-platform compatibility
    const normalizedPath = imageName.replace(/\\/g, "/");

    // If imageName already includes 'uploads/', treat as relative to project root
    // If not, prepend 'uploads/'
    const imagePath = normalizedPath.startsWith("uploads/")
      ? path.resolve(normalizedPath)
      : path.resolve("uploads", normalizedPath);

    const imgBuffer = await fs.readFile(imagePath);
    const contentType = mime.lookup(imagePath) || "image/jpeg";
    const base64Image = imgBuffer.toString("base64");
    return `data:${contentType};base64,${base64Image}`;
  } catch (error) {
    console.error(`Failed to convert image ${imageName} to base64:`, error);
    return null; // fallback if image conversion fails
  }
}

export default async function getGroupMessages(req, res) {
  try {
    const { groupId } = req.params;
    console.log(`getGroupMessages: Group ID received: ${groupId}`);

    const group = await categoryModel.findById(groupId);
    if (!group) {
      console.log(`getGroupMessages: Group with ID ${groupId} not found`);
      return res.status(404).json({ message: "Group not found" });
    }

    const messages = await groupMessageModel
      .find({ group: groupId })
      // .populate("createdBy", "name phone profilePic")
      .sort({ createdAt: 1 })
      .exec();

    console.log(
      `getGroupMessages: Messages fetched for groupId ${groupId}:`,
      messages
    );

    const formattedMessages = await Promise.all(
      messages.map(async (msg) => {
        const obj = msg.toObject();

        // Convert post image (if type post)
        if (obj.type === "post" && obj.image) {
          obj.image = await convertImageToDataUri(obj.image);
        }

        // Convert createdBy.profilePic
        if (obj.createdBy && typeof obj.createdBy === "object") {
          if (
            obj.createdBy.profilePic &&
            typeof obj.createdBy.profilePic === "string"
          ) {
            obj.createdBy.profilePic = await convertImageToDataUri(
              obj.createdBy.profilePic
            );
          } else {
            obj.createdBy.profilePic = null;
          }
        } else {
          obj.createdBy = { name: "", phone: "", profilePic: null }; // Safe fallback structure
        }

        return obj;
      })
    );

    return response200(res, { messages: formattedMessages });
  } catch (err) {
    console.error("getGroupMessages: Error occurred:", err);
    internalServerResponse(res, err);
  }
}
