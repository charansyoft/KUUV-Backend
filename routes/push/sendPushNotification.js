import axios from "axios";
import express from "express";
import { matchedData } from "express-validator";
import pushSubscriptionModel from "../../models/pushSubscriptionModel.js";
import { internalServerResponse } from "../../responses/serverErrorResponses.js";
import { response200 } from "../../responses/successResponses.js";
import { firebaseServiceAccountConfig } from "./firebaseServiceAccountConfig.js";
import getFirebaseOAuthToken from "./getFirebaseOauthToken.js";

const router = express.Router();

export default async function (req, res) {
  try {
    const requestedData = matchedData(req);
    const users = requestedData?.users;
    const subscriptions = await pushSubscriptionModel.find({
      user: { $in: users },
    });

    console.log({ subscriptions });

    const projectId = firebaseServiceAccountConfig.project_id;

    let appReceivers = subscriptions
      ?.map((item) => {
        if (item?.subscription?.token) return item?.subscription?.token;
      })
      .filter(Boolean); // filter out null or undefined tokens

    if (!appReceivers.length) {
      console.log("No valid registration tokens found for the user.");
      return false;
    }

    const accessToken = await getFirebaseOAuthToken();
    let parsedActions = {};
    requestedData?.actions?.forEach((item, index) => {
      parsedActions[`button${index + 1}`] = item?.title;
      parsedActions[`redirectUrl${index + 1}`] = item?.action;
    });

    const notificationPromises = appReceivers.map(async (registrationToken) => {
      try {
        const result = await axios({
          method: "post",
          url: `https://fcm.googleapis.com/v1/projects/${projectId}/messages:send`,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          data: {
            message: {
              name: "WORKE_CAMPAIGN_PUSH_NOTIFICATION",

              token: registrationToken,
              notification: {
                title: requestedData?.title,
                body: requestedData?.message,
                image: requestedData?.image,
              },
              data: {
                buttonCount: requestedData?.actions?.length?.toString(),
                ...parsedActions,
              },
              android: {
                priority: "HIGH",
              },
            },
          },
        });
        if (result) {
          try {
            await axios.post(`${process.env.CORE_SERVICE_URL}/push/logs`, {
              subscription: subscription,
              payload: notification?.title,
              org: org,
            });
          } catch (err) {
            console.log({ err });
          }
        }
      } catch (error) {
        if (
          error.response?.data?.error?.details?.some(
            (detail) => detail.errorCode === "UNREGISTERED"
          )
        ) {
          // Remove invalid token from the database
          await pushSubscriptionModel.updateOne(
            { "subscription.token": registrationToken },
            { $unset: { "subscription.token": "" } }
          );
          console.log(`Removed invalid token: ${registrationToken}`);
        } else {
          console.log("Error sending notification:", error);
        }
      }
    });

    await Promise.all(notificationPromises);
    console.log("Notifications sent successfully.");
    response200(res, "Notification sent successfully");
  } catch (error) {
    console.log(error);
    internalServerResponse(res, error);
  }
}
