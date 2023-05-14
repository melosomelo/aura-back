import { Game, SessionProvider, User } from "./types";
import redis from "./redis";

const RedisSessionProvider = {
  async startUserSession(sessionId: string, user: User) {
    await redis.set(`user_${sessionId}`, JSON.stringify({ user }));
    await redis.expire(sessionId, 60 * 60 * 24); // 1 day
  },
  async getUserSession(sessionId: string) {
    const session = await redis.get(`user_${sessionId}`);
    return session === null ? session : JSON.parse(session);
  },
  async createGame(ownerSessionId: string, game: Game) {
    const ownerSession = await this.getUserSession(ownerSessionId);
    ownerSession!.gameId = game.id;
    await redis.set(`user_${ownerSessionId}`, JSON.stringify(ownerSession));
    await redis.set(`game_${game.id}`, JSON.stringify(game));
  },
  async getGame(id: string) {
    const game = await redis.get(`game_${id}`);
    return game === null ? game : JSON.parse(game);
  },
  async joinGame(gameId: string, user: User) {
    const game = await this.getGame(gameId);
    // Since it's 1x1, then anyone joining the game will join team B.
    game!.teamB.players.push({ id: user.id, nickname: user.nickname });
    await redis.set(`game_${game!.id}`, JSON.stringify(game));
  },
  async startGame(gameId: string, user: User) {
    const game = await this.getGame(gameId);
    game!.status = "active";
    await redis.set(`game_${game!.id}`, JSON.stringify(game));
  },
};

const session: SessionProvider = RedisSessionProvider;

export default session;
