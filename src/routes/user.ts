import { Router } from "express";
import { body } from "express-validator";
import UserController from "../controllers/user";
import validationMiddleware from "../middlewares/validate";

const router = Router();

router.post(
  "/signup",
  body("username")
    .isString()
    .notEmpty()
    .withMessage("Must be a non-empty string!"),
  body("email")
    .isEmail()
    .withMessage("Must be a valid email!")
    .normalizeEmail(),
  body("password")
    .isString()
    .notEmpty()
    .withMessage("Must be a non-empty string!"),
  validationMiddleware,
  UserController.signup
);

router.put(
  "/nickname",
  body("nickname")
    .isString()
    .notEmpty()
    .withMessage("Must be a non-empty string!"),
  UserController.changeNickname
);

export default router;
