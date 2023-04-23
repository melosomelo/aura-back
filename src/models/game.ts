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
    const result = (
      await db("game")
        .select([
          "game.id",
          "status",
          "teamAScore",
          "teamBScore",
          "ownerId",
          db.ref("user.nickname").as("ownerNickname"),
        ])
        .join("user", "user.id", "=", "ownerId")
        .where({ "game.id": id })
    )[0];
    if (result === undefined) return null;
    const players = await db("user_plays")
      .select([db.ref("userId").as("id"), "nickname", "team"])
      .where({ gameId: id })
      .join("user", "user.id", "=", "userId");
    return {
      id: result.id,
      owner: {
        id: result.ownerId,
        nickname: result.nickname,
      },
      status: result.status,
      teamA: {
        players: players
          .filter((p) => p.team === "A")
          .map((p) => ({ id: p.id, nickname: p.nickname })),
        score: result.teamAScore,
      },
      teamB: {
        players: players
          .filter((p) => p.team === "B")
          .map((p) => ({ id: p.id, nickname: p.nickname })),
        score: result.teamBScoer,
      },
    };
  },
};

export default GameDAO;
