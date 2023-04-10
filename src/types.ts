import { Request as ExpressRequest } from "express";

interface Request<T> extends ExpressRequest {
  body: T;
}

export interface User {
  username: string;
  email: string;
  nickname: string;
  password: string;
  passwordResetToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export { Request, RequireAtLeastOne };
export { Response, NextFunction } from "express";
