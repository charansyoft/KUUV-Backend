import { param } from "express-validator";

export const getLocationByIdValidationSchema = [
  param("locationId").notEmpty().withMessage("LocationId is required"),
];
