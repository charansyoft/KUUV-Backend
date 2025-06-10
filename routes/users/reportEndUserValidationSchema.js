import { body } from "express-validator";

export const reportEndUserValidationSchema = [
  body("reporterId").notEmpty().withMessage("reporterId is required"),
  body("reportedUserId").notEmpty().withMessage("reportedUserId is required"),
  body("reason").notEmpty().withMessage("reason is required"),
];
