import jwt from "jsonwebtoken";

export default function generateVideoSdkToken() {
  const API_KEY = "6cfdee4c-7e9c-4f2f-81ea-af469437227f";
  const SECRET =
    "190bb3daeaf2f0942ba6ab956d060bad1e1aa2fd836e8d60adfd87731952be18";

  const options = {
    expiresIn: "120m",
    algorithm: "HS256",
  };
  const payload = {
    apikey: API_KEY,
    permissions: [`allow_join`], // `ask_join` || `allow_mod`
    version: 2, //OPTIONAL
    //  roomId: `2kyv-gzay-64pg`, //OPTIONAL
    //  participantId: `lxvdplwt`, //OPTIONAL
    //  roles: ['crawler', 'rtc'], //OPTIONAL
  };

  const token = jwt.sign(payload, SECRET, options);
  console.log({ videoSdkToken: token });
  return token;
}
