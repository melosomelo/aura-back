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
      game!.teamB.players.push({
        id: user.id,
        nickname: user.nickname,
        x: 0,
        y: 0,
        z: 0,
      });
    } else {
      game!.teamA.players.push({
        id: user.id,
        nickname: user.nickname,
        x: 0,
        y: 0,
        z: 0,
      });
    }
    await redis.set(`game_${game!.id}`, JSON.stringify(game));
  },
  async startGame(gameId: string, user: User): Promise<void> {
    const game = await this.getGame(gameId);
    game!.status = "active";
    await redis.set(`game_${game!.id}`, JSON.stringify(game));
  },
  async movePlayer(
    gameId: string,
    playerNickname: string,
    coordinates: { x: number; y: number; z: number }
  ) {
    const game = (await this.getGame(gameId)) as Game;
    let index = -1;
    if (
      (index = game.teamA.players.findIndex(
        (p) => p.nickname === playerNickname
      )) !== -1
    ) {
      game.teamA.players[index].x = coordinates.x;
      game.teamA.players[index].y = coordinates.y;
      game.teamA.players[index].z = coordinates.z;
    } else if (
      (index = game.teamB.players.findIndex(
        (p) => p.nickname === playerNickname
      )) !== -1
    ) {
      game.teamB.players[index].x = coordinates.x;
      game.teamB.players[index].y = coordinates.y;
      game.teamB.players[index].z = coordinates.z;
    }
    await redis.set(`game_${gameId}`, JSON.stringify(game));
    return game;
  },
};

export default session;
