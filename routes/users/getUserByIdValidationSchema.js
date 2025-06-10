import { param } from "express-validator";

export const getUserByIdValidationSchema = [
  param("userId").notEmpty().withMessage("User id is required"),
];
