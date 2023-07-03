import db from "../db";
import { Game, GameType } from "../types";
import UserDAO from "./user";

const GameDAO = {
  async create(ownerId: string, type: GameType): Promise<Game> {
    const game = (await db("game").insert({ ownerId, type }).returning("*"))[0];
    await db("user_plays").insert({
      gameId: game.id,
      userId: ownerId,
      team: "A",
    });
    const owner = (await UserDAO.findById(ownerId))!;
    return {
      type,
      id: game.id,
      owner: {
        id: owner.id,
        nickname: owner.nickname,
      },
      status: game.status,
      teamA: {
        score: 0,
        players: [{ id: owner.id, nickname: owner.nickname, x: 0, y: 0, z: 0 }],
      },
      teamB: {
        score: 0,
        players: [],
      },
      ball: {
        x: 0,
        y: 0,
        z: 0,
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
      ball: {
        x: 0,
        y: 0,
        z: 0,
      },
      id: result.id,
      owner: {
        id: result.ownerId,
        nickname: result.nickname,
      },
      type: result.type,
      status: result.status,
      teamA: {
        players: players
          .filter((p) => p.team === "A")
          .map((p) => ({ id: p.id, nickname: p.nickname, x: 0, y: 0, z: 0 })),
        score: result.teamAScore,
      },
      teamB: {
        players: players
          .filter((p) => p.team === "B")
          .map((p) => ({ id: p.id, nickname: p.nickname, x: 0, y: 0, z: 0 })),
        score: result.teamBScoer,
      },
    };
  },
};

export default GameDAO;
