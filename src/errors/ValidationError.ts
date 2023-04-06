import * as expressValidator from "express-validator";
import APIError from "./APIError";

type Errors = expressValidator.Result<expressValidator.ValidationError>;
class ValidationError extends APIError {
  errors: Errors;

  constructor(message: string, code: number, errs: Errors) {
    super(message, code);
    this.errors = errs;
  }
}

export default ValidationError;
