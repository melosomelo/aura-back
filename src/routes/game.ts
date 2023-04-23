import { Router } from "express";
import { body } from "express-validator";
import validationMiddleware from "../middlewares/validate";
import authMiddleware from "../middlewares/auth";
import GameController from "../controllers/game";

const router = Router();

router.post("/", authMiddleware, GameController.create);

router.post(
  "/invite",
  authMiddleware,
  body("nickname", "Must be a non-empty string").isString().trim().notEmpty(),
  body("gameId", "Must be a non-empty string").isString().trim().notEmpty(),
  validationMiddleware,
  GameController.inviteToGame
);

export default router;
