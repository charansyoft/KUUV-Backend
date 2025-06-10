// validation/leaveGroupValidation.js
import { body } from 'express-validator';

export const leaveGroupValidation = [
  body('groupId')
    .notEmpty().withMessage('groupId is required')
    .isMongoId().withMessage('groupId must be a valid MongoDB ObjectId'),
];
