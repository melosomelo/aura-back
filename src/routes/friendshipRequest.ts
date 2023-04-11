import { Router } from "express";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth";
import validationMiddleware from "../middlewares/validate";
import FriendshipRequestController from "../controllers/friendshipRequest";

const router = Router();

router.post(
  "/user/friendshipRequest",
  authMiddleware,
  body("nickname", "Must be a non-empty string").isString().notEmpty().trim(),
  validationMiddleware,
  FriendshipRequestController.create
);
