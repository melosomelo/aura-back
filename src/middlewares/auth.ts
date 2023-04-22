import { Request, Response, NextFunction } from "../types";
import session from "../session";
import APIError from "../errors/APIError";

async function authMiddleware(
  req: Request<any>,
  _: Response,
  next: NextFunction
) {
  const sessionId = req.headers["aura-auth"];
  if (!sessionId) throw new APIError("Authentication required", 401);
  if (typeof sessionId !== "string") {
    throw new APIError("Invalid value for aura-auth header", 400);
  }
  const userSession = await session.getUserSession(sessionId);
  if (userSession === null) throw new APIError("Authentication failed", 401);
  req.session = userSession;
  next();
}

export default authMiddleware;
