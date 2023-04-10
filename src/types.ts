import { Request as ExpressRequest } from "express";

interface Request<T> extends ExpressRequest {
  body: T;
}

interface User {
  id: string;
  username: string;
  email: string;
  nickname: string;
  password: string;
  passwordResetToken: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface SessionProvider {
  startUserSession: (sessionId: string, user: User) => Promise<void>;
}

export { Request, SessionProvider, User };
export { Response, NextFunction } from "express";
