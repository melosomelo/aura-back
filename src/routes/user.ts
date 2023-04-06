import { Router } from "express";
import { body } from "express-validator";
import UserController from "../controllers/user";
import validationMiddleware from "../middlewares/validate";

const router = Router();

router.post(
  "/signup",
  body("username").isString().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  body("password").isString().notEmpty(),
  validationMiddleware,
  UserController.signup
);

export default router;
