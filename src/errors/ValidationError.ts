import * as expressValidator from "express-validator";
import APIError from "./APIError";

class ValidationError extends APIError {
  errors: expressValidator.ValidationError[];

  constructor(
    message: string,
    code: number,
    errs: expressValidator.ValidationError[]
  ) {
    super(message, code);
    this.errors = errs;
  }
}

export default ValidationError;
