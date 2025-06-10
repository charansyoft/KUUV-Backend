import { param, query } from "express-validator";
import mongoose from "mongoose";

export const getGroupMessagesValidationSchema = [
  // Validate groupId parameter
  param("groupId")
    .isMongoId()
    .withMessage("Invalid groupId format")
    .notEmpty()
    .withMessage("groupId is required"),

];
