import axios from "axios";
import { matchedData } from "express-validator";
import sessionModel from "../../models/sessionModel.js";
import { badRequest } from "../../responses/errorResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function passSpeakingStatusToNextUser(req, res) {
  try {
    const requestData = matchedData(req);

    // Find the session
    const session = await sessionModel.findById(requestData?.sessionId);

    // Find the index of the current active speaker (not just speaking, but also not exited)
    const currentSpeakerIndex = session.members.findIndex(
      (member) => member.speaking
    );

    let nextSpeakerIndex;
    if (currentSpeakerIndex === -1) {
      // No active speaker, start with the first non-exited member
      nextSpeakerIndex = session.members.findIndex(
        (member) => !member.exitDateTime
      );
    } else {
      let foundNextSpeaker = false;
      for (let i = currentSpeakerIndex + 1; i < session.members.length; i++) {
        if (!session.members[i].exitDateTime) {
          nextSpeakerIndex = i;
          foundNextSpeaker = true;
          break;
        }
      }

      if (!foundNextSpeaker) {
        // Wrap around if no non-exited members found after current speaker
        nextSpeakerIndex = session.members.findIndex(
          (member) => !member.exitDateTime
        );
      }
    }

    // Handle edge case of no non-exited members
    if (nextSpeakerIndex === -1) {
      // Consider throwing an error or handling the scenario differently
      console.error("No non-exited members found in the session");
      return badRequest(res, [
        { msg: "the room doesn't contain any active members" },
      ]);
    }

    // Set speaking to false for all members (if only one speaker allowed)
    session.members.forEach((member) => {
      member.speaking = false;
    });

    // Update speaking status
    session.members.forEach((member, index) => {
      member.speaking = index === nextSpeakerIndex;
      member.speakingStartDateTime =
        index === nextSpeakerIndex ? new Date() : null;
    });

    // Save the updated session
    const updateSessionResult = await session.save();

    await axios({
      method: "post",
      url: `${process.env.SOCKET_SERVICE_URL}/send-socket-events`,
      data: {
        roomId: requestData?.sessionId,
        type: "speaker_change",
        payload: {},
      },
    });

    response200(res, updateSessionResult);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
