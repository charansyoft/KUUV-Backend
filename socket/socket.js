// socket/socket.js

import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "*", // Replace with your frontend URL in production
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡️ New client connected: ${socket.id}`);

    socket.on("joinRoom", (chatId) => {
      socket.join(chatId);
      console.log(`📥 Socket ${socket.id} joined room: ${chatId}`);
    });

    socket.on("JoinGroupChat", (GroupId) => {
      socket.join(GroupId);
      console.log(`📥 Socket ${socket.id} joined room: ${GroupId}`);
    });

    socket.on("leaveRoom", (chatId) => {
      socket.leave(chatId);
      console.log(`📤 Socket ${socket.id} left room: ${chatId}`);
    });

    socket.on("LeaveGroupChat", (GroupId) => {
      socket.leave(GroupId);
      console.log(`📤 Socket ${socket.id} left room: ${GroupId}`);
    });

    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  console.log("✅ Socket.io initialized");
  return io;
};

export { io };
