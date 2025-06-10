// routes/getMessagesValidationSchema.js
import { param } from "express-validator";
import mongoose from "mongoose";

export const getMessagesValidationSchema = [
  param("chatId")
    .isMongoId()
    .withMessage("Invalid chatId format")
    .notEmpty()
    .withMessage("chatId is required")
];
