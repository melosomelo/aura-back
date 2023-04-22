import { Request as ExpressRequest } from "express";

interface Request<B = any, Q extends qs.ParsedQs = any> extends ExpressRequest {
  body: B;
  query: Q;
  session?: UserSession;
}

interface AuthenticatedRequest<B = any, Q extends qs.ParsedQs = any>
  extends Request<B, Q> {
  session: UserSession;
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

export type FriendshipRequestStatus = "accepted" | "refused" | "pending";

interface FriendshipRequest {
  id: number;
  senderId: string;
  receiverId: string;
  status: "accepted" | "refused" | "pending";
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

export {
  Request,
  SessionProvider,
  User,
  UserSession,
  FriendshipRequest,
  AuthenticatedRequest,
};
export { Response, NextFunction } from "express";
