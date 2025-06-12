import chatModel from "../../models/chatModel.js";
import messageModel from "../../models/messageModel.js";
import User from "../../models/userModel.js";

export const createChat = async (req, res) => {
  try {
    const opponentId = req.body.users?.[0];
    const myId = req.user?._id;
    const { text, type } = req.body.lastMessage;

    const users = [myId, opponentId].sort();
    let chat = await chatModel.findOne({ users: { $all: users } });

    if (!chat) {
      chat = await chatModel.create({
        users,
        lastMessage: { text, type },
        lastMessageTime: new Date(),
      });
    } else {
      chat.lastMessage = { text, type };
      chat.lastMessageTime = new Date();
      await chat.save();
    }

    const messageDoc = await messageModel.create({
      chat: chat._id,
      payload: { text, files: [] },
      createdBy: myId,
    });

    const populatedChat = await chatModel
      .findById(chat._id)
      .populate({
        path: "users",
        select: "_id phone name",
        model: User,
      });

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
