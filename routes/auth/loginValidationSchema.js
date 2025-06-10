import { body } from "express-validator";

export const loginValidationSchema = [
  body("phone")
    .isMobilePhone()
    .notEmpty()
    .withMessage("Phone number is required"),

  body("ccode")
    .isString()
    .notEmpty()
    .withMessage("Country code is required"), // ✅ Add this
];
