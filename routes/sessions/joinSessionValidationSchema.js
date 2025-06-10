import { body } from "express-validator";

export const joinSessionValidationSchema = [
  body("topic").isString().optional(),
  body("session").isString().optional(),
];
