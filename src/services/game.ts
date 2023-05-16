import { Game, User, GameTeam, Transform } from "../types";
import GameDAO from "../models/game";
import APIError from "../errors/APIError";
import session from "../session";
import WS from "../ws";

const GameService = {
  async createGame(ownerId: string): Promise<Game> {
    return GameDAO.create(ownerId);
  },
  async getById(gameId: string) {
    return GameDAO.getById(gameId);
  },
  async joinGame(
    user: User,
    gameId: string
  ): Promise<{ teamA: GameTeam; teamB: GameTeam }> {
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
    return { teamA: game.teamA, teamB: game.teamB };
  },
  async startGame(user: User, gameId: string): Promise<{ game: Game }> {
    const game = await session.getGame(gameId);
    if (game === null) throw new APIError("Game not found!", 404);
    if (game.status !== "setup")
      throw new APIError(
        game.status === "active"
          ? "Cannot start an started game!"
          : "Cannot start a game that has already ended!",
        400
      );
    if (game.owner.id !== user.id)
      throw new APIError("Cannot start a game you don't own!", 400);
    await session.startGame(gameId, user);
    await Promise.all(
      game.teamA.players
        .concat(game.teamB.players)
        .map((player) =>
          WS.send(player.nickname, "GAME_STARTED", { gameId: game.id })
        )
    );
    return { game };
  },
  async move(gameId: string, user: User, transform: Transform): Promise<Transform> {
    const game = await session.getGame(gameId);
    if (game === null) throw new APIError("Game not found!", 404);
    if (game.status !== "active"){
      throw new APIError(
        game.status === "setup"
          ? "Cannot move on a game that hasn't started!"
          : "Cannot move on a game that has already ended!",
        400
      );
    }
    const playersA = game.teamA.players;
    const playersB = game.teamB.players;
    let playerMoving: Boolean;
    playerMoving = false;
    playersA.forEach((player) => {
      if(player.id == user.id){
        playerMoving = playerMoving || true;
      }
    });
    playersB.forEach((player) => {
      if(player.id == user.id){
        playerMoving = playerMoving || true;
      }
    });
    //caso o jogador não esteja no jogo
    if(!playerMoving){
      throw new APIError("jogador não está no jogo! ", 400);
    }
    return transform
  },
  async run(gameId: string, user: User): Promise<String> {
    const game = await session.getGame(gameId);
    if (game === null) throw new APIError("Game not found!", 404);
    if (game.status !== "active"){
      throw new APIError(
        game.status === "setup"
          ? "Cannot move on a game that hasn't started!"
          : "Cannot move on a game that has already ended!",
        400
      );
    }
    const playersA = game.teamA.players;
    const playersB = game.teamB.players;
    let playerMoving: Boolean;
    playerMoving = false;
    playersA.forEach((player) => {
      if(player.id == user.id){
        playerMoving = playerMoving || true;
      }
    });
    playersB.forEach((player) => {
      if(player.id == user.id){
        playerMoving = playerMoving || true;
      }
    });
    //caso o jogador não esteja no jogo
    if(!playerMoving){
      throw new APIError("jogador não está no jogo! ", 400);
    }
    return "run";
  },
};

export default GameService;
