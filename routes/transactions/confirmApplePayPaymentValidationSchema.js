import { body } from "express-validator";

export const confirmApplePayPaymentValidationSchema = [
  body("transactionId").isString().notEmpty(),
];
