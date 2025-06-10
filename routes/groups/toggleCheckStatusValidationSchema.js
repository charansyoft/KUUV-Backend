// toggleCheckStatusValidationSchema.js
import { body, validationResult } from 'express-validator';

const toggleCheckStatusValidation = [
  body('phoneNumber')
    .isString()
    .withMessage('Phone number must be 10 digits'),
  body('groupId')
    .isString()
    .withMessage('Group ID is required'),

  // Error handling middleware
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log("Validation Error:", errors.array()[0].msg);
      return res.status(400).json({ message: errors.array()[0].msg });
    }
    next();
  }
];

export default toggleCheckStatusValidation;
