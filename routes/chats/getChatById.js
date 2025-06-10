import chatModel from "../../models/chatModel.js";
import { response200 } from "../../responses/successResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";

export default async function getChatById(req, res) {
  try {
    const { chatId } = req.params;
    console.log("backend CHatIDDDDDDDDDDDD :", chatId)
    const chat = await chatModel
      .findById(chatId)
      .populate("users", "name phone ccode profilePic role description groups");

    if (!chat) return res.status(404).json({ message: "Chat not found" });
console.log("CHATTTTTT:",chat)
    return response200(res, { message: "Chat fetched successfully", data: chat });
  } catch (err) {
    console.error(err);
    internalServerResponse(res, err);
  }
}
