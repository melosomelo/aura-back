import { Game, User } from "../types";
import GameDAO from "../models/game";
import APIError from "../errors/APIError";
import session from "../session";

const GameService = {
  async createGame(ownerId: string): Promise<Game> {
    return GameDAO.create(ownerId);
  },
  async getById(gameId: string) {
    return GameDAO.getById(gameId);
  },
  async joinGame(user: User, gameId: string): Promise<void> {
    const game = await session.getGame(gameId);
    if (game === null) throw new APIError("Game not found!", 404);
    if (game.status !== "setup")
      throw new APIError(
        game.status === "active"
          ? "Cannot join an active game!"
          : "Cannot join a game that has already ended!",
        400
      );
    if (game.owner.id === user.id)
      throw new APIError("Cannot rejoin a game you own!", 400);
    if (game.teamB.players.find((p) => p.id === user.id) !== undefined)
      throw new APIError("Cannot rejoin a game you're already on!", 400);
    // only 1x1 for now.
    if (game.teamA.players.length + game.teamB.players.length === 2)
      throw new APIError("Game is full!", 400);
    await session.joinGame(gameId, user);
  },
};

export default GameService;
