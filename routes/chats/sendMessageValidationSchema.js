import { body } from "express-validator";
export const sendMessageValidationSchema = [
  body("message")
    .notEmpty()
    .withMessage("Message text is required"),
  body("type")
    .notEmpty()
    .withMessage("Message type is required"),
];
