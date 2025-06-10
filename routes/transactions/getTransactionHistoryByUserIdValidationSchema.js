import { query } from "express-validator";

export const getTransactionHistoryByUserIdValidationSchema = [
  query("userId").isString().optional(),
];
