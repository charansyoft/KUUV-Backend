import { body } from "express-validator";

export const createTopicValidationSchema = [
  body("name").notEmpty().withMessage("Name is required"),
  body("category").isString().optional().withMessage("Category is required"),
  body("maximumMembersPerSession")
    .isNumeric()
    .notEmpty()
    .withMessage("maximumMembersPerSession is required"),
  body("image").optional(),
  body("public").optional(),
  body("femaleOnly").isBoolean().optional(),
  body("elite").isBoolean().optional(),
];
