import { body } from "express-validator";

export const createProductValidationSchema = [
  body("cost").isNumeric().notEmpty().withMessage("Cost is required"),
  body("name").isString().notEmpty().withMessage("Name is required"),
  body("credits").isNumeric().notEmpty().withMessage("Credits is required"),
  body("popular").isBoolean().optional(),
];
