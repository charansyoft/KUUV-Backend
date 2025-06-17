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


      socket.on("registerUser", (phone) => {
    if (phone) {
      connectedUsers.set(phone, socket.id);
      console.log(`📲 Registered user with phone: ${phone} -> socket ${socket.id}`);
    }
  });
  
    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
      console.log(`📥 Socket ${socket.id} joined room: ${chatId}`);
    });

    socket.on("JoinGroupChat", (GroupId) => {
      socket.join(GroupId);
      console.log(`📥 Socket ${socket.id} joined group chat room: ${GroupId}`);
    });

    socket.on("leaveRoom", (chatId) => {
      socket.leave(chatId);
      console.log(`📤 Socket ${socket.id} left room: ${chatId}`);
    });

    socket.on("LeaveGroupChat", (GroupId) => {
      socket.leave(GroupId);
      console.log(`📤 Socket ${socket.id} left group chat: ${GroupId}`);
    });

    socket.on("disconnect", () => {
      for (const [phone, sockId] of connectedUsers.entries()) {
        if (sockId === socket.id) {
          connectedUsers.delete(phone);
          console.log(`❌ Disconnected: User with phone [${phone}] removed from online map`);
          break;
        }
      }
    });
  });

  console.log("✅ Socket.io initialized");
  return io;
};

export { io };
