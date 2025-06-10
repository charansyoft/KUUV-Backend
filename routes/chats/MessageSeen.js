import messageModel from "../../models/messageModel.js";
import { response200 } from "../../responses/successResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";

export default async function MessageSeen(req, res) {
  try {
    const userId = req.user._id;
    const chatId = req.params.chatId;
    const { messageIds } = req.body;

    // Update only messages with these IDs and in this chat,
    // where this user hasn't marked them read yet
    const updateResult = await messageModel.updateMany(
      {
        _id: { $in: messageIds },
        chat: chatId,
        "readBy.user": { $ne: userId },
      },
      {
        $push: {
          readBy: {
            user: userId,
            timestamp: new Date(),
          },
        },
      }
    );

    console.log(
      `Messages marked as read by user ${userId} in chat ${chatId}: ${updateResult.modifiedCount}`
    );

    return response200(res, {
      message: "Messages marked as read",
      updatedCount: updateResult.modifiedCount,
    });
  } catch (err) {
    console.error("MessageSeen error:", err);
    return internalServerResponse(res, err);
  }
}
