import { Router } from "express";
import { body } from "express-validator";
import validationMiddleware from "../middlewares/validate";
import authMiddleware from "../middlewares/auth";
import GameController from "../controllers/game";

const router = Router();

router.post("/", authMiddleware, GameController.create);

export default router;
