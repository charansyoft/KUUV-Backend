import axios from "axios";
import { matchedData } from "express-validator";
import sessionModel from "../../models/sessionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import createTransaction from "../transactions/createTransaction.js";

export async function exitSession({ userId, sessionId }) {
  try {
    const exitDateTime = new Date();

    const session = await sessionModel.findOne({
      _id: sessionId,
    });

    const memberIndex = session?.members?.findIndex((member) => {
      return (
        member.user.toString() === userId.toString() &&
        member.exitDateTime === null
      );
    });

    if (memberIndex === -1) {
      // User not found in the session or already exited
      console.log("User not found in session");
      return false;
    }

    const joinDateTime = session?.members[memberIndex]?.joinDateTime;
    session.members[memberIndex].exitDateTime = exitDateTime;

    // Handle speaker change if the exiting member was speaking
    let sendSpeakerChangeSocketEvent = false;
    if (session?.members[memberIndex].speaking) {
      sendSpeakerChangeSocketEvent = true;
      const nextSpeakerIndex = findNextNonExitedMember(
        session?.members,
        memberIndex
      );
      if (nextSpeakerIndex !== -1) {
        session.members[nextSpeakerIndex].speaking = true;
        session.members[nextSpeakerIndex].speakingStartDateTime = new Date();
      }
      session.members[memberIndex].speaking = false;
      session.members[memberIndex].speakingStartDateTime = null;
    }

    // Set speaking to false for all members if only one user remains
    if (
      session?.members.filter((member) => member.exitDateTime === null)
        .length === 1
    ) {
      session.members.forEach((member) => {
        member.speaking = false;
        member.speakingStartDateTime = null;
      });
    }

    // Update session status to 'ended' if last member exits
    if (
      session.members.filter((member) => member.exitDateTime === null)
        .length === 0
    ) {
      session.status = "ended";
    }

    const updateSessionResult = await session.save();
    console.log({ updateSessionResult });

    if (sendSpeakerChangeSocketEvent) {
      await axios({
        method: "post",
        url: `${process.env.SOCKET_SERVICE_URL}/send-socket-events`,
        data: {
          roomId: sessionId,
          type: "speaker_change",
          payload: {},
        },
      });
    }

    const transaction = await createTransaction({
      userId: userId,
      type: "session",
      object: updateSessionResult,
      sessionStartTime: joinDateTime,
      sessionEndTime: exitDateTime,
    });
    console.log({ transaction });

    return updateSessionResult;
  } catch (err) {
    console.log(err);
    return false;
  }
}

export default async function exitSessionRoute(req, res) {
  try {
    const user = req.user;
    const requestData = matchedData(req);
    console.log({ user });

    const exitSessionResult = await exitSession({
      userId: user?._id,
      sessionId: requestData?.session,
    });

    response200(res, exitSessionResult);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}

// Helper function to find the next non-exited member index
function findNextNonExitedMember(members, currentIndex) {
  let nextSpeakerIndex = -1;
  for (let i = currentIndex + 1; i < members.length; i++) {
    if (members[i].exitDateTime === null) {
      nextSpeakerIndex = i;
      break;
    }
  }

  if (nextSpeakerIndex === -1 && currentIndex !== 0) {
    // Wrap around if no non-exited members found after current member
    for (let i = 0; i < currentIndex; i++) {
      if (members[i].exitDateTime === null) {
        nextSpeakerIndex = i;
        break;
      }
    }
  }

  return nextSpeakerIndex;
}
