import * as AWS from "@aws-sdk/client-sqs";
import dotenv from "dotenv";
dotenv.config();

const sqs = new AWS.SQS({
  apiVersion: process.env.SQS_API_VERSION,
  region: process.env.SQS_REGION,
  credentials: {
    accessKeyId: process.env.SQS_ACCESS_KEY,
    secretAccessKey: process.env.SQS_SECRET_KEY,
  },
});
/**
 * common function to send Message to sqs
 * message will be send entirely to sqs and will be received in lambda
 * message group id will be unique for each automation
 * to make in a single execution queue and priority
 * eg:enquiry create automation ->> all actions of the automation will have same message group id
 */
export function sendMessageToSqs({ message, messageGroupId }) {
  return new Promise((resolve, reject) => {
    sqs.sendMessage(
      {
        MessageBody: JSON.stringify(message),
        QueueUrl: process.env.SQS_QUEUE_URL,
        MessageGroupId: messageGroupId,
        DelaySeconds: 0,
        // MessageDeduplicationId: messageDeduplicationId,
      },
      function (err, data) {
        if (err) {
          reject(err);
          console.log({ err });
        } else {
          resolve(data);
          // console.log({ data: JSON.stringify(message) });
        }
      }
    );
  });
}
