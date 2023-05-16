import { Request as ExpressRequest } from "express";

interface Request<B = any, Q extends qs.ParsedQs = any> extends ExpressRequest {
  body: B;
  query: Q;
  session?: UserSession;
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
  gameId?: string;
}

interface SessionProvider {
  startUserSession: (sessionId: string, user: User) => Promise<void>;
  getUserSession: (sessionId: string) => Promise<UserSession | null>;
  createGame: (ownerSessionId: string, game: Game) => Promise<void>;
  getGame: (id: string) => Promise<Game | null>;
  joinGame: (gameId: string, user: User) => Promise<void>;
  startGame: (gameId: string, user: User) => Promise<void>;
}
interface GameTeam {
  players: Array<
    Omit<
      User,
      | "password"
      | "passwordResetToken"
      | "createdAt"
      | "updatedAt"
      | "email"
      | "username"
    >
  >;
  score: number;
}

interface Game {
  id: string;
  owner: Omit<
    User,
    | "password"
    | "passwordResetToken"
    | "createdAt"
    | "updatedAt"
    | "email"
    | "username"
  >;
  status: "setup" | "active" | "over";
  teamA: GameTeam;
  teamB: GameTeam;
}

interface Transform {
  x: String;
  y: String;
  z: String;
}

export {
  Request,
  User,
  UserSession,
  SessionProvider,
  FriendshipRequest,
  Game,
  GameTeam,
  Transform,
};
export { Response, NextFunction } from "express";
