import { body, param } from "express-validator";

export const updatePostValidationSchema = [
  param("postId").isMongoId().withMessage("postId is required"),
  body("text").optional(),
  body("media").optional(),
  body("deleted").optional(),
];
