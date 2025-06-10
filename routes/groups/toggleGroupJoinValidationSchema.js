import { body } from 'express-validator';

export const toggleGroupJoinValidation = [
  body('phoneNumber')
    .isString()
    .withMessage('Phone number is required'),
  
  body('groupId')
    .isString()
    .withMessage('Group ID is required'),
];
