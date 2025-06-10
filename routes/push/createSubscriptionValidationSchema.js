import { body } from "express-validator";

export const createSubscriptionValidationSchema = [
  body("subscription.token").custom((value, { req }) => {
    if (!value) {
      throw new Error('Token is required');
    }
    return true;
  }),
  body("subscription.deviceId").custom((value, { req }) => {
    // Check if type is 'app' and token is missing
    if (!value) {
      throw new Error('Token is required');
    }
    return true;
  }),
  body("user").optional(), // Assuming some validation for user is needed
];
