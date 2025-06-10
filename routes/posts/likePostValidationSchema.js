import { param } from "express-validator";

export const likePostValidationSchema = [
  param("postId")
    .notEmpty().withMessage("postId is required")
    .isMongoId().withMessage("Invalid postId format, must be a valid MongoDB ObjectId"),
];
