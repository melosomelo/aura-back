import { Game, User } from "../types";
import GameDAO from "../models/game";
import APIError from "../errors/APIError";

const GameService = {
  async createGame(ownerId: string): Promise<Game> {
    return GameDAO.create(ownerId);
  },
  async getById(gameId: string) {
    return GameDAO.getById(gameId);
  },
  async joinGame(user: User, gameId: string): Promise<void> {
    const game = await GameDAO.getById(gameId);
    if (game === null) throw new APIError("Game not found!", 404);
    if (game.status !== "setup")
      throw new APIError(
        game.status === "active"
          ? "Cannot join an active game!"
          : "Cannot join a game that has already ended!",
        400
      );
  },
};

export default GameService;
