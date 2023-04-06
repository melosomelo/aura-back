import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import APIError from "../errors/APIError";

function validationMiddleware(req: Request, _: Response, next: NextFunction) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new APIError("dont please", 400);
  }
  next();
}

export default validationMiddleware;
