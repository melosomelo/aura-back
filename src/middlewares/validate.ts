import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import APIError from "../errors/APIError";

function validationMiddleware(req: Request, _: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let firstError = errors.array()[0];
    throw new APIError(
      `Invalid value for ${firstError.param}: ${firstError.msg}`,
      400
    );
  }
  next();
}

export default validationMiddleware;
