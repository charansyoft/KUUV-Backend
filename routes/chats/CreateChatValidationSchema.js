import { body } from 'express-validator';
import mongoose from 'mongoose';

export const createChatValidationSchema = [
  body('users')
    .custom((users) => {
      if (!Array.isArray(users) || users.length < 2) {
        throw new Error('Users must be an array with at least two user IDs.');
      }
      users.forEach(userId => {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error(`Invalid user ID: ${userId}`);
        }
      });
      return true;
    }),
  body('lastMessage')
    .optional()
    .isObject()
    .withMessage('Last message must be an object'),
  body('category')
    .optional()
    .isMongoId()
    .withMessage('Invalid category ID'),
];
