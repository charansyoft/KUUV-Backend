import mongoose from "mongoose";

// Chat Schema definition
const chatSchema = new mongoose.Schema(
  {
    // Stores the most recent message of the chat (can contain text, media, etc.)
    lastMessage: {
      type: Object,
      default: {},
    },

    // Timestamp for when the last message was sent
    lastMessageTime: {
      type: Date,
      default: null,
    },

    // List of User references (ObjectId) involved in the chat
    users: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",  // Refers to the User model
      required: true,
    },

    // Category the chat belongs to (optional)
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",  // Refers to the Category model
    },

    // Soft delete flag to mark chats as deleted
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }  // Automatically includes createdAt and updatedAt fields
);

// Indexes for optimization
chatSchema.index({ users: 1 });             // Index on users for faster queries involving users
chatSchema.index({ deleted: 1 });           // Index on deleted flag for soft delete queries
chatSchema.index({ lastMessageTime: -1 });  // Index on lastMessageTime for sorting chats by most recent message

// Export the Chat model
export default mongoose.model("Chat", chatSchema);
