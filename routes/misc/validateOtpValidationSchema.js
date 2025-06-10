import { body } from "express-validator";

export const validateOtpValidationSchema = [
  body("email").isString().notEmpty().withMessage("Email is required"),
  body("otp").isString().notEmpty().withMessage("otp is required"),
];
