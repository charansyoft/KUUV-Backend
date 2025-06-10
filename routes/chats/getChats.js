import fs from "fs";
import path from "path";
import chatModel from "../../models/chatModel.js";
import User from "../../models/userModel.js";
import messageModel from "../../models/messageModel.js"; // Import message model

// Helper to convert image path to Base64
const convertImageToBase64 = (relativePath) => {
  try {
    const filePath = path.resolve(relativePath.replace(/\\/g, "/")); // Normalize path
    if (!fs.existsSync(filePath)) return "";

    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString("base64");

    // Defaulting to JPEG – update if your images are PNG or others
    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.error("Error reading profilePic:", err.message);
    return "";
  }
};

export const getChats = async (req, res) => {
  try {
    const { phone } = req.user; // ✅ Get phone from verified token
    console.log("PHONE FROM TOKEN:", phone);

    if (!phone) {
      return res.status(400).json({
        message: "Phone number is required.",
      });
    }

    const user = await User.findOne({ phone });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    const chats = await chatModel
      .find({
        users: user._id,
        deleted: false,
      })
      .populate("users", "name phone ccode role description profilePic")
      .sort({ lastMessageTime: -1 });

    // 🔸 Map chats and append unread count + base64 profilePic
    const enrichedChats = await Promise.all(
      chats.map(async (chat) => {
        const chatObj = chat.toObject();

        // Convert each user's profilePic to base64
        chatObj.users = chatObj.users.map((u) => {
          return {
            ...u,
            profilePic:
              u.profilePic && !u.profilePic.startsWith("data:")
                ? convertImageToBase64(u.profilePic)
                : u.profilePic || "",
          };
        });

        // Identify opponent and get unread message count
        const opponentId = chat.users.find(
          (u) => u._id.toString() !== user._id.toString()
        );

        const unreadCount = await messageModel.countDocuments({
          chat: chat._id,
          createdBy: opponentId,
          "readBy.user": { $ne: user._id },
          deleted: false,
        });

        return {
          ...chatObj,
          unreadCount,
        };
      })
    );

    console.log("CHATS::", enrichedChats);
    return res.status(200).json({
      message: "Chats fetched successfully",
      chats: enrichedChats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
