import { body } from "express-validator";

export const createOrderValidationSchema = [
  body("objectId").isString().optional(),
  body("type")
    .isString()
    .notEmpty()
    .withMessage("type is required")
    .matches(/^(subscription|topup)$/i),
  body("service")
    .isString()
    .notEmpty()
    .withMessage("service is required")
    .matches(/^(apple|razorpay)$/i),
];
