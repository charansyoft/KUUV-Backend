import chatModel from "../../models/chatModel.js";
import messageModel from "../../models/messageModel.js";
import User from "../../models/userModel.js";

export const createChat = async (req, res) => {
  try {
    const opponentId = req.body.users?.[0];
    const myId = req.user?._id;
    const { text, type } = req.body.lastMessage;

    console.log("------------Create-Chat------------");
    console.log("🧠 Decoded from Token (Me):", myId);
    console.log("👤 Opponent ID:", opponentId);
    console.log("💬 Message:", text);
    console.log("💬 Type:", type);

    const users = [myId, opponentId].sort();

    // Step 1: Check if chat exists
    let chat = await chatModel.findOne({ users: { $all: users } });

    if (!chat) {
      // Step 2: Create new chat
      chat = await chatModel.create({
        users,
        lastMessage: { text, type },
        lastMessageTime: new Date(),
      });
    } else {
      // Step 3: Update existing chat
      chat.lastMessage = { text, type };
      chat.lastMessageTime = new Date();
      await chat.save();
    }

    // Step 4: Create first message
    const messageDoc = await messageModel.create({
      chat: chat._id,
      payload: { text, files: [] },
      createdBy: myId,
    });

    // Step 5: Populate users with only required fields
    const populatedChat = await chatModel
      .findById(chat._id)
      .populate({
        path: "users",
        select: "_id phone name",
        model: User,
      });

    // Step 6: Send response
    return res.status(201).json({
      message: "✅ Chat and first message created successfully",
      chat: populatedChat,
      firstMessage: messageDoc,
    });
  } catch (error) {
    console.error("❌ Error in createChat:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
