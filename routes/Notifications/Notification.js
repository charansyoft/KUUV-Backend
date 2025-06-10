import express from "express";
import fs from "fs";
import path from "path";
import Notification from "../../models/Notifications/notificationSchema.js";
import User from "../../models/userModel.js";
import GroupMessagesModel from "../../models/GroupMessagesModel.js";

const router = express.Router();

function convertToBase64(filePath) {
  try {
    const absolutePath = path.resolve(filePath);
    const fileData = fs.readFileSync(absolutePath);
    const base64 = fileData.toString("base64");
    const mimeType = getMimeType(filePath);
    return `data:${mimeType};base64,${base64}`;
  } catch (err) {
    console.error(`⚠️ Failed to convert ${filePath} to base64:`, err.message);
    return null;
  }
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "application/octet-stream";
  }
}

export async function Notifications(req, res) {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    console.log("📩 Received Notification request for user:", userId);

    const notifications = await Notification.find({ toUser: userId }).sort({ timestamp: -1 });
    const formattedNotifications = [];

    for (const notif of notifications) {
      const fromUserId = notif.fromUser;
      const postId = notif.postId;

      // Fetch fromUser details
      const fromUser = await User.findById(fromUserId).select("name phone profilePic").lean();
      let fromUserImageBase64 = null;
      if (fromUser?.profilePic) {
        fromUserImageBase64 = convertToBase64(fromUser.profilePic);
      }

      // Fetch post details
      const post = await GroupMessagesModel.findById(postId).lean();
      let postDetails = null;
      if (post) {
        const postImagePath = `uploads/${post.image}`;
        const postImageBase64 = convertToBase64(postImagePath);
        postDetails = {
          Id: post._id,
          title: post.title,
          image: postImageBase64,
          updatedAt: post.updatedAt ? post.updatedAt.toISOString() : null, // <-- added updatedAt here
        };
      }

      // Push formatted notification object
      formattedNotifications.push({
        fromUser: {
          name: fromUser?.name || "",
          phone: fromUser?.phone || "",
          profilePic: fromUserImageBase64,
        },
        message: notif.message,
        groupId: notif.groupId,
        postDetails,
      });
    }

    console.log("formattedNotification :", formattedNotifications);
    return res.json({ notifications: formattedNotifications });

  } catch (err) {
    console.error("❌ Error fetching notifications:", err.message);
    res.status(500).json({ error: "Server error" });
  }
}
