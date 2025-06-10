import { query } from "express-validator";

const commonGetRequestValidationSchema = [
  /**
   * checking for page is existing or not it is the index for page
   */
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page should be a number"),
  /**
   * checking for limit is existing or not it is the number of records per page
   */
  query("limit").optional().isNumeric().withMessage("limit should be a number"),

  /**
   * this can be used in common validation for filtering the requests
   */
  query("status")
    .optional()
    .isBoolean()
    .withMessage("status should be a boolean"),
  query("active")
    .optional()
    .isBoolean()
    .withMessage("active should be a boolean"),
  query("q").optional().isString().withMessage("q should be a string"),
];

export { commonGetRequestValidationSchema };
