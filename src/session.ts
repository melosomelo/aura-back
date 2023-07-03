import { Game, User, UserSession } from "./types";
import redis from "./redis";

const session = {
  async startUserSession(sessionId: string, user: User): Promise<void> {
    await redis.set(`user_${sessionId}`, JSON.stringify({ user }));
    await redis.expire(sessionId, 60 * 60 * 24); // 1 day
  },
  async getUserSession(sessionId: string): Promise<UserSession | null> {
    const session = await redis.get(`user_${sessionId}`);
    return session === null ? session : JSON.parse(session);
  },
  async createGame(ownerSessionId: string, game: Game): Promise<void> {
    const ownerSession = await this.getUserSession(ownerSessionId);
    ownerSession!.gameId = game.id;
    await redis.set(`user_${ownerSessionId}`, JSON.stringify(ownerSession));
    await redis.set(`game_${game.id}`, JSON.stringify(game));
  },
  async getGame(id: string): Promise<Game | null> {
    const game = await redis.get(`game_${id}`);
    return game === null ? game : JSON.parse(game);
  },
  async joinGame(
    gameId: string,
    joinedTeam: "A" | "B",
    user: User
  ): Promise<void> {
    const game = await this.getGame(gameId);
    if (joinedTeam === "B") {
      game!.teamB.players.push({ id: user.id, nickname: user.nickname });
    } else {
      game!.teamA.players.push({ id: user.id, nickname: user.nickname });
    }
    await redis.set(`game_${game!.id}`, JSON.stringify(game));
  },
  async startGame(gameId: string, user: User): Promise<void> {
    const game = await this.getGame(gameId);
    game!.status = "active";
    await redis.set(`game_${game!.id}`, JSON.stringify(game));
  },
};

export default session;
