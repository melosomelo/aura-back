import { SessionProvider, User } from "./types";
import redis from "./redis";

const RedisSessionProvider: SessionProvider = {
  async startUserSession(sessionId: string, user: User) {
    await redis.set(sessionId, JSON.stringify({ user }));
    await redis.expire(sessionId, 60 * 60 * 24); // 1 day
  },
  async getUserSession(sessionId: string) {
    const session = await redis.get(sessionId);
    return session === null ? session : JSON.parse(session);
  },
};

const session: SessionProvider = RedisSessionProvider;

export default session;
