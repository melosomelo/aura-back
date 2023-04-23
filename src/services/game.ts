import { Game } from "../types";
import GameDAO from "../models/game";
import APIError from "../errors/APIError";
import UserService from "./user";
import GameInviteDAO from "../models/gameInvite";

const GameService = {
  async createGame(ownerId: string): Promise<Game> {
    return GameDAO.create(ownerId);
  },
  async invitePlayer(
    inviterId: string,
    inviteeNickname: string,
    gameId: string
  ) {
    const invitee = await UserService.getUserByNickname(inviteeNickname);

    if (invitee === null) throw new APIError("User not found!", 404);

    const game = await this.getById(gameId);
    if (game === null) throw new APIError("Game doesn't exist!", 404);

    if (game.owner.id !== inviterId)
      throw new APIError("Cannot invite to a game you don't own!", 400);

    if (inviterId === invitee.id)
      throw new APIError("Cannot invite yourself to a game!", 400);

    return GameInviteDAO.create(gameId, invitee.id);
  },
  async getById(id: string): Promise<Game | null> {
    return GameDAO.getById(id);
  },
};

export default GameService;
