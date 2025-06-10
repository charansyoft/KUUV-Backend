// path: validators/groupDetailsValidationSchema.js
import { body } from 'express-validator';

export const getGroupDetailsByGroupIdValidationSchema = [
  body('phone')
    .notEmpty()
    .optional()
    .withMessage('GroupId is required')
    .isString()
    .withMessage('GroupId must be a string'),
];
