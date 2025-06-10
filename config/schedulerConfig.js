import {
  CreateScheduleCommand,
  DeleteScheduleCommand,
  SchedulerClient,
} from "@aws-sdk/client-scheduler"; // ES Modules import
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const client = new SchedulerClient({
  region: process.env.SQS_REGION,
  credentials: {
    accessKeyId: process.env.SQS_ACCESS_KEY,
    secretAccessKey: process.env.SQS_SECRET_KEY,
  },
});
/**
 * common function that will send message to event scheduler to (sqs ->> lambda)
 * message will ben send entirely to sqs then to lambda
 * scheduledTime only for push notification (run at specified time)
 * delay block addition
 * MessageGroupId unique queue identification key to give priority
 */

export async function sendMessageToEventBridge({
  name,
  message,
  scheduledTime = null,
  scheduledTimeZone = null,
  delayTime = null,
  messageGroupId,
}) {
  let now = new Date();
  if (scheduledTime) {
    now = new Date(scheduledTime);
  }
  if (delayTime && !scheduledTime) {
    now.setHours(now.getHours() + 5);
    now.setMinutes(now.getMinutes() + 29);
    now.setSeconds(now.getSeconds() + 58);
    now.setMinutes(now.getMinutes() + Number(delayTime));
  } else if (delayTime) {
    now.setMinutes(now.getMinutes() + Number(delayTime));
  }

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed, so add 1 and pad with leading zero if necessary
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDateTime = `at(${year}-${month}-${day}T${hours}:${minutes}:${seconds})`;
  console.log({ formattedDateTime });
  const input = {
    // CreateScheduleInput
    Name: name ?? uuidv4(), // required -- use unique schedule name maybe uuid
    ScheduleExpression: formattedDateTime,
    ScheduleExpressionTimezone: "UTC+05:30",
    ...(scheduledTimeZone && {
      ScheduleExpressionTimezone: scheduledTimeZone,
    }),
    Target: {
      Arn: process.env.SQS_ARN, // required sqs arn
      RoleArn: process.env.SQS_ROLE_ARN, // required sqs role arn
      Input: JSON.stringify(message),
      SqsParameters: {
        MessageGroupId: messageGroupId,
        // MessageDeduplicationId: uuidv4(),
      },
    },
    FlexibleTimeWindow: {
      Mode: "OFF", // required
    },
  };
  const command = new CreateScheduleCommand(input);
  return new Promise(async (resolve, reject) => {
    client.send(command, (err, data) => {
      if (err) {
        console.log({ err, hi: "dd" });
        reject(err);
      } else {
        // console.log({ data });
        resolve(data);
        // setTimeout(() => {
        //   console.log(JSON.stringify(message));
        // }, 5000);
      }
    });
  });
}

export async function deleteMessageFromEventBridge({ messageId }) {
  const input = {
    Name: messageId, // required
  };
  const command = new DeleteScheduleCommand(input);
  const response = await client.send(command);
  console.log({ deleteScheduleResponse: response });
  return response;
}
