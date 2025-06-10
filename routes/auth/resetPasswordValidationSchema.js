import { body } from "express-validator";

export const resetPasswordValidationSchema = [
  body("email").isString().notEmpty().withMessage("Email is required"),
  body("otp").isString().notEmpty().withMessage("Otp is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];
