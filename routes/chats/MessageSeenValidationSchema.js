import { param, body } from "express-validator";

const MessageSeenValidationSchema = [
  param("chatId").isMongoId().withMessage("Invalid chatId"),
  body("messageIds")
    .isArray({ min: 1 })
    .withMessage("messageIds must be a non-empty array"),
  body("messageIds.*")
    .isMongoId()
    .withMessage("Each messageId must be a valid Mongo ID"),
];

export default MessageSeenValidationSchema;
