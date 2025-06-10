import { query } from "express-validator";

export const getTopicsByCategoryIdValidationSchema = [
  query("categoryId").isString().optional(),
  query("femaleOnly").isBoolean().optional(),
];
