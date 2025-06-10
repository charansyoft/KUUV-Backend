import { matchedData } from "express-validator";
import { internalServerResponse } from "../responses/serverErrorResponses.js";
import { response200 } from "../responses/successResponses.js";
import { emitMessage } from "../socket/socket.js";

export default async function sendSocketEvents(req, res) {
  try {
    const requestData = matchedData(req);
    const { roomId, type, payload } = requestData;
    emitMessage({
      roomId: roomId,
      type: type,
      payload: payload,
    });
    response200(res, {
      message: "Message sent successfully",
    });
  } catch (err) {
    internalServerResponse(res, err);
  }
}
