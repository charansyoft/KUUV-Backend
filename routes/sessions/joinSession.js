import { matchedData } from "express-validator";
import createVideoSdkRoom from "../../helpers/createVideoSdkRoom.js";
import generateVideoSdkToken from "../../helpers/generateVideoSdkToken.js";
import sessionModel from "../../models/sessionModel.js";
import topicModel from "../../models/topicModel.js";
import { badRequest } from "../../responses/errorResponses.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";

export default async function joinSession(req, res) {
  try {
    const user = req.user;
    const requestData = matchedData(req);
    console.log({ requestData });

    if (!requestData?.session && !requestData?.topic) {
      return badRequest(res, [{ msg: "One of topic or session is required" }]);
    }

    let session;
    if (requestData?.session) {
      session = await sessionModel.findOne({
        _id: requestData?.session,
      });
      console.log({ session });
    }

    if (requestData?.topic) {
      const sessionsByTopic = await sessionModel.find({
        topic: requestData?.topic,
        status: "open",
      });
      if (sessionsByTopic && sessionsByTopic?.length > 0) {
        session = sessionsByTopic[0];
      }
    }

    if (session?.elite && !user.elite) {
      return badRequest(res, [
        { msg: "Elite memberbership is required to join this session" },
      ]);
    }

    if (session && session.status === "closed") {
      return badRequest(res, [
        { msg: "Unable to join session. Session is full" },
      ]);
    }

    if (session && session.status === "open") {
      const sessionToJoin = session;

      const updateSessionResult = await sessionModel.findOneAndUpdate(
        {
          _id: sessionToJoin?._id,
        },
        {
          $push: {
            members: {
              user: user._id,
              joinDateTime: new Date(),
              exitDateTime: null,
              speaking: false,
              speakingStartDateTime: null,
            },
          },
          ...(sessionToJoin?.members?.filter((member) => {
            return member.exitDateTime === null;
          }).length +
            1 >=
            sessionToJoin?.maximumMembers && {
            status: "closed",
          }),
        },
        { new: true }
      );

      const activeMembers = updateSessionResult.members.filter(
        (member) => !member.exitDateTime || member.exitDateTime === null
      );
      console.log({ activeMembers });
      if (activeMembers.length === 2) {
        const updateres = await sessionModel.findOneAndUpdate(
          {
            _id: sessionToJoin?._id,
            "members.exitDateTime": null,
          },
          {
            "members.$.speaking": true,
            "members.$.speakingStartDateTime": new Date(),
          },
          { new: true }
        );
      }
    } else if (requestData?.topic) {
      const topic = await topicModel.findOne({
        _id: requestData.topic,
      });
      console.log({ topic });
      const newSession = new sessionModel({
        name: `${topic?.name}`,
        members: [
          {
            user: user?._id,
            joinDateTime: new Date(),
            exitDateTime: null,
            speaking: false,
            speakingStartDateTime: null,
          },
        ],
        speaking: true,
        maximumMembers: topic?.maximumMembersPerSession ?? 6,
        topic: topic?._id,
        public: topic?.public,
        femaleOnly: topic?.femaleOnly,
        status: "open",
        elite: topic?.elite,
      });

      const createSessionResult = await newSession.save();
      session = createSessionResult;

      const videoSdkToken = generateVideoSdkToken();
      const videoSdkRoom = await createVideoSdkRoom({
        token: videoSdkToken,
        sessionId: session?._id,
      });

      const updateSessionResult = await sessionModel.findOneAndUpdate(
        {
          _id: session?._id,
        },
        {
          $set: { room: { ...videoSdkRoom, token: videoSdkToken } },
        },
        { new: true }
      );
      console.log({ updateSessionResult });
    }

    response200(res, session);
  } catch (err) {
    console.log(err);
    internalServerResponse(res);
  }
}
