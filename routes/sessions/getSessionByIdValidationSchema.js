import { param } from "express-validator";

export const getSessionByIdValidationSchema = [
  param("sessionId").notEmpty().withMessage("sessionId is required"),
];
