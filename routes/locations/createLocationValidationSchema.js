import { body } from "express-validator";

export const createLocationValidationSchema = [
  body("name").notEmpty().withMessage("Name is required"),
  body("location").optional(),
  body("radius").optional(),
];
