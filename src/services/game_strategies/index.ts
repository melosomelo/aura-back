import { GameStrategy, GameType } from "../../types";
import TwoVTwo from "./2v2";
import GoldenGoal from "./goldenGoal";

export function getGameStrategy(type: GameType): GameStrategy {
  if (type === "2v2") return TwoVTwo;
  else return GoldenGoal;
}
