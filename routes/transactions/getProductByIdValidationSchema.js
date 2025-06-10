import { param } from "express-validator";

export const getProductByIdValidationSchema = [
  param("productId").isString().notEmpty().withMessage("productId is required"),
];
