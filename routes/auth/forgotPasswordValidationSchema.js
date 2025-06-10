import { body } from "express-validator";

export const forgotPasswordValidationSchema = [
  body("email").isString().notEmpty().withMessage("Email is required"),
];
