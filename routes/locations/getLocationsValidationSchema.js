import { query } from "express-validator";

export const getLocationsValidationSchema = [
  query("q").optional(),
  query("lat").optional(),
  query("lng").optional(),
];
