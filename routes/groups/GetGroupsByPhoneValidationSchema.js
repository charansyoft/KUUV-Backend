import { body } from 'express-validator';

// Validation schema to validate the phone number
const GetGroupsByPhoneValidationSchema = [
  body('phoneNumber')
    .isLength({ min: 10, max: 10 }) // Ensure it's exactly 10 digits
    .withMessage('Phone number must be exactly 10 digits')
    .isNumeric()
    .withMessage('Phone number must contain only numbers'),
];

export default GetGroupsByPhoneValidationSchema;
