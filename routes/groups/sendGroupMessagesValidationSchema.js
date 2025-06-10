import { body, param } from "express-validator";

export const sendGroupMessagesValidationSchema = [
  param("groupId")
    .isMongoId()
    .withMessage("Valid groupId (as URL param) is required"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message text is required")
    .isString()
    .withMessage("Message text must be a string"),

  body("type")
    .trim()
    .notEmpty()
    .withMessage("Type is required")
    .isIn(["msg", "post"])
    .withMessage("Type must be either 'msg' or 'post'"),
];
