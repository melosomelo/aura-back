import { Request as ExpressRequest } from "express";

interface Request<B = any, Q extends qs.ParsedQs = any> extends ExpressRequest {
  session?: UserSession;
  body: B;
  query: Q;
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

interface FriendshipRequest {
  id: number;
  senderId: string;
  receiverId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface UserSession {
  user: User;
}

interface SessionProvider {
  startUserSession: (sessionId: string, user: User) => Promise<void>;
  getUserSession: (sessionId: string) => Promise<UserSession | null>;
}

export { Request, SessionProvider, User, UserSession, FriendshipRequest };
export { Response, NextFunction } from "express";
