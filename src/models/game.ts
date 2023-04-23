import db from "../db";
import { Game } from "../types";
import UserDAO from "./user";

const GameDAO = {
  async create(ownerId: string): Promise<Game> {
    const game = (await db("game").insert({ ownerId }).returning("*"))[0];
    await db("user_plays").insert({
      gameId: game.id,
      userId: ownerId,
      team: "A",
    });
    const owner = (await UserDAO.findById(ownerId))!;
    return {
      id: game.id,
      owner: {
        id: owner.id,
        nickname: owner.nickname,
      },
      status: game.status,
      teamA: {
        score: 0,
        players: [{ id: owner.id, nickname: owner.nickname }],
      },
      teamB: {
        score: 0,
        players: [],
      },
    };
  },
  async getById(id: string): Promise<Game | null> {
    const result = (await db("game").where({ id }))[0];
    if (result === undefined) return null;
    return result === undefined ? null : result;
  },
};

export default GameDAO;
