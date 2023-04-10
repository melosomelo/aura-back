import { SessionProvider, User } from "./types";
import redis from "./redis";

const RedisSessionProvider: SessionProvider = {
  async startUserSession(sessionId: string, user: User) {
    await redis.set(sessionId, JSON.stringify(user));
  },
};

const session: SessionProvider = RedisSessionProvider;

export default session;
