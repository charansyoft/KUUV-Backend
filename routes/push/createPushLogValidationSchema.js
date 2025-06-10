import { body } from "express-validator";

export const addPushLogValidationSchema = [
  body("subscription").notEmpty(),
  body("payload").optional(),
];

