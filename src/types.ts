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
    > & { x: number; y: number; z: number }
  >;
  score: number;
}

export type GameType = "2v2" | "golden_goal";

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
  type: GameType;
  status: "setup" | "active" | "over";
  teamA: GameTeam;
  teamB: GameTeam;
  ball: { x: number; y: number; z: number };
}

interface Transform {
  x: String;
  y: String;
  z: String;
}

interface GameStrategy {
  onJoin: (user: User, game: Game) => Promise<"A" | "B">;
  onGoal: (game: Game, team: "A" | "B") => Promise<boolean>;
}

export {
  Request,
  User,
  UserSession,
  FriendshipRequest,
  Game,
  GameTeam,
  Transform,
  GameStrategy,
};
export { Response, NextFunction } from "express";
