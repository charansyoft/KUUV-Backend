import { body, param } from "express-validator";

export const updateLocationValidationSchema = [
  param("locationId").isMongoId().withMessage("locationId is required"),
  body("name").optional(),
  body("location").optional(),
  body("radius").optional(),
  body("deleted").optional(),
  body("disabled").optional(),
];
