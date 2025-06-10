import { param } from "express-validator";

export const getCategoryByIdValidationSchema = [
  param("categoryId").notEmpty().withMessage("categoryId is required"),
];
