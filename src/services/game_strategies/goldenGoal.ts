import APIError from "../../errors/APIError";
import { GameStrategy } from "../../types";

const GoldenGoal: GameStrategy = {
  async onJoin(user, game) {
    if (game.teamA.players.length + game.teamB.players.length === 2)
      throw new APIError("Game is full!", 422);
    return "B";
  },
  async onGoal(game, team) {
    if (team === "A") game.teamA.score += 1;
    else game.teamB.score += 1;
    return true;
  },
};

export default GoldenGoal;
