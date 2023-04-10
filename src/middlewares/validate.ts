import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import APIError from "../errors/APIError";

function validationMiddleware(req: Request, _: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.array()[0];
    // Deal with cases of nested errors so as to not return a generic message.
    while (firstError.nestedErrors) {
      firstError = firstError.nestedErrors[0] as ValidationError;
    }
    // No parameter specifically. Probably entire body validation.
    let msg;
    if (firstError.param === "") {
      msg = `Invalid request body: ${firstError.msg}`;
    } else {
      msg = `Invalid value for ${firstError.param} in ${firstError.location}: ${firstError.msg}`;
    }
    throw new APIError(msg, 400);
  }
  next();
}

export default validationMiddleware;
