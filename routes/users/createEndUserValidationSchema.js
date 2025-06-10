import { body } from "express-validator";

export const createEndUserValidationSchema = [
  body("name").notEmpty().withMessage("Name is required"),
  body("email").notEmpty().withMessage("Email is required"),
  body("phoneNumber").notEmpty().withMessage("Phone Number is required"),
  body("country").optional(),
  body("city").optional(),
  body("gender")
    .notEmpty()
    .withMessage("Gender is required")
    .matches(/^(male|female|prefernotsay)$/i)
    .isString(),
  body("password").notEmpty().withMessage("Password is required"),
  body("proficiency")
    .notEmpty()
    .withMessage("Proficiency is required")
    .matches(
      /^(beginner|intermediate|advanced|usAccent|britishAccent|europeanAccent)$/i
    )
    .isString(),
];
