import { param } from "express-validator";

export const getTopicByIdValidationSchema = [
  param("topicId").notEmpty().withMessage("topicId is required"),
];
