import { body } from 'express-validator';

// Validation schema for getting joined groups by phone number
export const joinedGroupsValidationSchema = [
  body('phone')
    .isString().withMessage('Phone number must be a string')
    .notEmpty().withMessage('Phone number is required')
];
