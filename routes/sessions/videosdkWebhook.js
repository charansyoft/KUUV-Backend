import sessionModel from "../../models/sessionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import { exitSession } from "./exitSession.js";

export default async function videosdkWebhook(req, res) {
  try {
    /**
     *
     {
        "webhookType": "participant-joined",
        "data": {
            "meetingId": "jvsg-8rjn-j304",
            "sessionId": "613731342f27f56e4fc4b6d0",
            "participantId": "fkd74h",
            "participantName": "John",
        },
    }
     */

    console.log({ req: req.body });
    const eventType = req?.body?.webhookType;
    const sessionId = req?.body?.data?.sessionId;
    const meetingId = req?.body?.data?.meetingId;
    const userId = req?.body?.data?.participantId;
    console.log({ eventType, sessionId, userId, meetingId });
    const session = await sessionModel.findOne({ "room.roomId": meetingId });

    if (eventType === "participant-left") {
      const exitSessionResult = await exitSession({
        userId: userId,
        sessionId: session?._id,
      });
      console.log({ exitSessionResult });
    }

    if (eventType === "session-ended") {
      console.log({ session });

      const activeMembers = session.members?.filter(
        (member) => member.exitDateTime === null
      );

      for (let member of activeMembers) {
        const exitSessionResult = await exitSession({
          userId: member?.user,
          sessionId: sessionId,
        });
        console.log({ exitSessionResult });
      }
      //update session status to ended
      session.status = "ended";
      const updateSessionResult = await session.save();
      console.log({ updateSessionResult });
    }

    response200(res, { status: true });
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
