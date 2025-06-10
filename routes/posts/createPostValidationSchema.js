// validationSchema/posts/createPostValidationSchema.js
import { body } from "express-validator";

const createPostValidationSchema = [
  body("media")
    .isArray({ min: 1 })
    .withMessage("At least one image is required in media."),
  body("media.*")
    .isString()
    .isURL()
    .withMessage("Each media item must be a valid URL."),
  body("text")
    .isString()
    .notEmpty()
    .withMessage("Text is required and must be a string."),
];

export default createPostValidationSchema;
