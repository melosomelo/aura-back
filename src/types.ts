import { Request as ExpressRequest } from "express";

interface Request<T> extends ExpressRequest {
  body: T;
}

export { Request };
export { Response, NextFunction } from "express";
