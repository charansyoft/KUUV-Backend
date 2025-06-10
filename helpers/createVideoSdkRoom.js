import axios from "axios";

export default async function createVideoSdkRoom({ token, sessionId }) {
  const createRoomResponse = await axios({
    method: "post",
    url: "https://api.videosdk.live/v2/rooms",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      customRoomId: sessionId,
      webhook: {
        endPoint: "https://api.practe.in/sessions/videosdk/webhook",
        events: ["participant-left", "session-ended"],
      },
      autoCloseConfig: {
        type: "session-ends",
        duration: 480,
      },
    }),
  });

  return createRoomResponse?.data;
}
