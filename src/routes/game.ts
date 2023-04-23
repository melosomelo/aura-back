import { Router } from "express";
import { body } from "express-validator";
import validationMiddleware from "../middlewares/validate";
import authMiddleware from "../middlewares/auth";
import GameController from "../controllers/game";

const router = Router();

router.post("/", authMiddleware, GameController.create);

router.post(
  "/join",
  authMiddleware,
  body("gameId", "Must be a non-empty string").trim().isUUID(),
  validationMiddleware,
  GameController.joinGame
);

export default router;
