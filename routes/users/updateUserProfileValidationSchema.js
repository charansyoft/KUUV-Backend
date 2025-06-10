import { body, validationResult } from "express-validator";

export const UpdateUserProfileValidationSchema = [
  // Optional: validate phoneNumber if you plan to use/update it
  body("phoneNumber")
    .optional()
    .isMobilePhone()
    .withMessage("Invalid phone number"),

  body("name")
    .optional()
    .isString()
    .withMessage("Name must be a string")
    .isLength({ max: 100 })
    .withMessage("Name cannot exceed 100 characters"),

  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string")
    .isLength({ max: 500 })
    .withMessage("Description cannot exceed 500 characters"),

  // Multer handles profileImage validation (e.g., file type, size)

  // Run the validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
];
