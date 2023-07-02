import { Router } from "express";
import { body } from "express-validator";
import validationMiddleware from "../middlewares/validate";
import authMiddleware from "../middlewares/auth";
import GameController from "../controllers/game";

const router = Router();

router.post(
  "/",
  authMiddleware,
  body("type", "Must be either '2v2' or 'golden_goal'")
    .trim()
    .isIn(["2v2", "golden_goal"]),
  validationMiddleware,
  GameController.create
);

router.post(
  "/join",
  authMiddleware,
  body("gameId", "Must be a non-empty string").trim().isUUID(),
  validationMiddleware,
  GameController.joinGame
);

router.post(
  "/start",
  authMiddleware,
  body("gameId", "Must be a non-empty string").trim().isUUID(),
  validationMiddleware,
  GameController.startGame
);

export default router;
