import { google } from "googleapis";
const MESSAGING_SCOPE = "https://www.googleapis.com/auth/firebase.messaging";
const SCOPES = [MESSAGING_SCOPE];
import { firebaseServiceAccountConfig as key } from "./firebaseServiceAccountConfig.js";

export default function getFirebaseOAuthToken() {
  return new Promise(function (resolve, reject) {

    const jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    );
    jwtClient.authorize(function (err, tokens) {
      if (err) {
        reject(err);
        return;
      }
      resolve(tokens.access_token);
    });
  });
}
