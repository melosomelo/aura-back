import { Game } from "../types";
import GameDAO from "../models/game";
import APIError from "../errors/APIError";

const GameService = {
  async createGame(ownerId: string): Promise<Game> {
    return GameDAO.create(ownerId);
  },
  async invitePlayer(inviterId: string, inviteeId: string, gameId: string) {
    const game = await this.getById(gameId);
    if (game === null) throw new APIError("Game doesn't exist!", 404);

    if (game.owner.id !== inviterId)
      throw new APIError("Cannot invite to a game you don't own!", 400);

    if (inviterId === inviteeId)
      throw new APIError("Cannot invite yourself to a game!", 400);
  },
  async getById(id: string): Promise<Game | null> {
    return GameDAO.getById(id);
  },
};

export default GameService;
