import APIError from "../../errors/APIError";
import { GameStrategy } from "../../types";

const TwoVTwo: GameStrategy = {
  async onJoin(user, game) {
    if (game.teamA.players.length + game.teamB.players.length === 4)
      throw new APIError("Game is full!", 422);
    if (game.teamA.players.length < 2) return "A";
    return "B";
  },
  async onGoal(game, team) {
    if (team === "A") game.teamA.score += 1;
    else game.teamB.score += 1;
    return game.teamA.score === 10 || game.teamB.score === 10;
  },
};

export default TwoVTwo;
