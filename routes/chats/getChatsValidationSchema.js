import { query } from "express-validator";

export const getChatsValidationSchema = [
  query("phone")
    .notEmpty()
    .optional()
    .withMessage("Phone number is required.")
    .isMobilePhone()
    .withMessage("Invalid phone number."),
];
