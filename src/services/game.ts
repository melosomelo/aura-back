import uid from "uid-safe";
import { Game } from "../types";
import GameDAO from "../models/game";

const GameService = {
  async createGame(ownerId: string): Promise<Game> {
    return GameDAO.create(ownerId);
  },
};

export default GameService;
