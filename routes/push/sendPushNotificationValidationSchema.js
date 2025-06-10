import { body } from "express-validator";

export const sendPushNotificationValidationSchema = [
  body("users").notEmpty(),
  body("title").notEmpty(),
  body("message").optional(),
  body("actions").optional(),
];
