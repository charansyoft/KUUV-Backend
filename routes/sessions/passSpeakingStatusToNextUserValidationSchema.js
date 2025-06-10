import { param } from "express-validator";

export const passSpeakingStatusToNextUserValidationSchema = [
  param("sessionId").notEmpty().withMessage("sessionId is required"),
];
