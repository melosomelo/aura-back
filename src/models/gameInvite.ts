import db from "../db";
import { GameInvite } from "../types";

const GameInviteDAO = {
  async create(gameId: string, recipientId: string): Promise<GameInvite> {
    return (
      await db("game_invite").insert({ gameId, recipientId }).returning("*")
    )[0];
  },

  async get(gameId: string, recipientId: string): Promise<GameInvite | null> {
    const result = (await db("game_invite").where({ gameId, recipientId }))[0];
    return result === undefined ? null : result;
  },
};

export default GameInviteDAO;
