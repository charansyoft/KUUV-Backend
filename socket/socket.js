import { Server } from "socket.io";
import groupMessageModel from "../models/GroupMessagesModel.js";

export const connectedUsers = new Map(); // phone -> socket.id

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡️ New client connected: ${socket.id}`);

    // ✅ User Registration
    socket.on("registerUser", async (phone) => {
      if (phone) {
        connectedUsers.set(phone, socket.id);
        socket.user = { phone };
        console.log(`📲 Registered user: ${phone} -> ${socket.id}`);

        // 🔁 Mark missed messages as received
        try {
          const missedMessages = await groupMessageModel.find({
            receivedBy: { $ne: phone }, // not yet received by this user
          }).select("_id group");

          for (const msg of missedMessages) {
            await groupMessageModel.updateOne(
              { _id: msg._id },
              { $addToSet: { receivedBy: phone } }
            );
            console.log(`📥 Missed message marked received: ${msg._id} by ${phone}`);
          }
        } catch (err) {
          console.error(`❌ Error marking missed messages for ${phone}:`, err.message);
        }
      }
    });

    // ✅ Join/Leave Group Chat
    socket.on("JoinGroupChat", (GroupId) => {
      socket.join(GroupId);
      console.log(`📥 ${socket.id} joined group: ${GroupId}`);
    });

    socket.on("LeaveGroupChat", (GroupId) => {
      socket.leave(GroupId);
      console.log(`📤 ${socket.id} left group: ${GroupId}`);
    });

    // ✅ Join/Leave Rooms (DMs etc.)
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
      console.log(`📥 ${socket.id} joined room: ${chatId}`);
    });

    socket.on("leaveRoom", (chatId) => {
      socket.leave(chatId);
      console.log(`📤 ${socket.id} left room: ${chatId}`);
    });

    // ✅ When client confirms message received (live)
    socket.on("MessageReceived", async ({ messageId, groupId }) => {
      try {
        const userPhone = socket.user?.phone;
        if (!userPhone) return;

        await groupMessageModel.updateOne(
          { _id: messageId, group: groupId },
          { $addToSet: { receivedBy: userPhone } } // prevent duplicates
        );

        console.log(`📦 Message ${messageId} marked received by ${userPhone}`);
      } catch (err) {
        console.error("❌ Failed to update receivedBy:", err.message);
      }
    });


    socket.on("MessageRead", async ({ messageId, groupId }) => {
  try {
    const userPhone = socket.user?.phone;
    if (!userPhone) return;

    await groupMessageModel.updateOne(
      { _id: messageId, group: groupId },
      { $addToSet: { readBy: userPhone } }
    );

    console.log(`📖 Message ${messageId} marked as read by ${userPhone}`);
  } catch (err) {
    console.error("❌ Failed to update readBy:", err.message);
  }
});


    // ✅ Handle Disconnects
    socket.on("disconnect", () => {
      for (const [phone, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(phone);
          console.log(`❌ Disconnected: ${phone} removed from online map`);
          break;
        }
      }
    });
  });

  console.log("✅ Socket.io initialized");
  return io;
};

export { io };
