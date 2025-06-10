import { body } from "express-validator";

export const createCategoryValidationSchema = [
  body("name")
    .notEmpty()
    .withMessage("Name is required"),

  body("location")
    .notEmpty()
    .withMessage("Location is required"),

  body("image")
    .optional()
    .isString()
    .withMessage("Image must be a string or URL"),

  body("joinedUsers")
    .optional()
    .isArray()
    .withMessage("Joined users must be an array of user IDs")
    .custom((arr) => arr.every(id => typeof id === "string"))
    .withMessage("Each user ID must be a string"),
];
