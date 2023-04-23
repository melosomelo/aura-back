import db from "../db";
import { Game } from "../types";
import UserDAO from "./user";

const GameDAO = {
  async create(ownerId: string): Promise<Game> {
    const game = (await db("game").insert({ ownerId }).returning("*"))[0];
    const user = (await UserDAO.findById(ownerId))!;
    return {
      id: game.id,
      owner: {
        id: user.id,
        nickname: user.nickname,
      },
      status: game.status,
    };
  },
};

export default GameDAO;
