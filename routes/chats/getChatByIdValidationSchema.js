import { param } from "express-validator";

export function getChatByIdValidationSchema() {
  return [
    param("chatId").isMongoId().withMessage("Invalid chatId"),
  ];
}
