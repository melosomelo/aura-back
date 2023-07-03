import APIError from "../../errors/APIError";
import { GameStrategy } from "../../types";

const TwoVTwo: GameStrategy = {
  async onJoin(user, game) {
    if (game.teamA.players.length + game.teamB.players.length === 4)
      throw new APIError("Game is full!", 422);
    if (game.teamA.players.length < 2) return "A";
    return "B";
  },
};

export default TwoVTwo;
