import { body } from "express-validator";

export const exitSessionValidationSchema = [
  body("session").isString().notEmpty().withMessage("Session is required"),
];
