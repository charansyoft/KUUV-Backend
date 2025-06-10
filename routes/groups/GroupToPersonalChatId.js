import fs from "fs";
import path from "path";
import Chat from "../../models/chatModel.js";
import User from "../../models/userModel.js";

// Helper to convert image path to Base64 with default fallback
const convertImageToBase64 = (relativePath) => {
  try {
    if (!relativePath) {
      // Default 1x1 px transparent PNG base64
      return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGMAAQAABQABDQottAAAAABJRU5ErkJggg==";
    }

    // Normalize path separators and resolve full path
    const filePath = path.resolve(relativePath.replace(/\\/g, "/"));

    if (!fs.existsSync(filePath)) {
      console.warn("Image file does not exist at path:", filePath);
      return "";
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64 = fileBuffer.toString("base64");

    // Assuming jpeg, change if your images are different format
    return `data:image/jpeg;base64,${base64}`;
  } catch (err) {
    console.error("Error reading profilePic:", err.message);
    return "";
  }
};

const groupToPersonalChatID = async (req, res) => {
  try {
    const { item } = req.body; // mainUser
    const mainUserId = item._id;
    const opponentUserId = req.user._id;

    console.log("Main User ID (item._id):", mainUserId);
    console.log("Opponent User ID (req.user._id):", opponentUserId);

    // Try to find chat between users
    const chat = await Chat.findOne({
      users: { $all: [mainUserId, opponentUserId] },
      deleted: false,
    }).select("_id users lastMessageTime");

    if (chat) {
      console.log("Chat found:", chat);
      return res.json({
        success: true,
        id: chat._id,
      });
    } else {
      console.log("No chat found between users");

      // Fetch opponent user data from DB
      const opponentUserData = await User.findById(mainUserId).select(
        "name ccode profilePic phone role description"
      );

      if (!opponentUserData) {
        return res.status(404).json({
          success: false,
          message: "Opponent user not found",
          chatId: null,
        });
      }

      console.log("Opponent user profilePic before conversion:", opponentUserData.profilePic);

      // Convert profilePic to base64 or default
      const profilePicBase64 = convertImageToBase64(opponentUserData.profilePic);

      // Prepare user data to send back with base64 image
      const responseUserData = {
        _id: opponentUserData._id,
        name: opponentUserData.name || "",
        ccode: opponentUserData.ccode || "",
        profilePic: profilePicBase64,
        phone: opponentUserData.phone || "",
        role: opponentUserData.role || "enduser",
        description: opponentUserData.description || "",
      };

      console.log("Returning opponent user data with base64 image:", responseUserData);

      return res.json({
        success: false,
        message: "No chat exists between the provided users",
        // chatId: null,
        opponentUser: responseUserData,
      });
    }
  } catch (error) {
    console.error("Error in groupToPersonalChatID:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export default groupToPersonalChatID;
