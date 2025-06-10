import { validationResult } from "express-validator";
import { badRequest } from "../responses/errorResponses.js";

const validateRequest = (req, res, next) => {
  // console.log("ValidateRequest:From FRONTEND as body: ", req.body);
  // console.log("ValidateRequest:From FRONTEND as params: ", req.params);
console.log("------------Validate-Request------------")
  const result = validationResult(req);
  if (result.isEmpty()) next();
  else badRequest(res, result.array());
};

export { validateRequest };
