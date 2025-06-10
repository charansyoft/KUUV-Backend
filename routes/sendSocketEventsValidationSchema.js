import { body } from "express-validator";

export const sendSocketEventsValidationSchema = [
  body("roomId").notEmpty(),
  body("type").notEmpty(),
  body("payload").isObject(),
];
