import { body } from "express-validator";

export const verifyOtpValidationSchema = [
  body("otp").isString().notEmpty().withMessage("Otp is required"),
  body("phone")
    .isMobilePhone()
    .notEmpty()
    .withMessage("Phone number is required"),
];
