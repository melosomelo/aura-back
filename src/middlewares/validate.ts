import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ValidationError from "../errors/ValidationError";

function validationMiddleware(req: Request, _: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new ValidationError("Invalid input", 400, errors.array());
  }
  next();
}

export default validationMiddleware;
