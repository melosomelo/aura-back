import { Router } from "express";
import { body, oneOf } from "express-validator";
import UserController from "../controllers/user";
import validationMiddleware from "../middlewares/validate";

const router = Router();

router.post(
  "/user/signup",
  body("username", "Must be a non-empty string with no spaces")
    .isString()
    .notEmpty()
    .not()
    .contains(" ")
    .trim(),
  body("email", "Must be a valid email").isEmail().normalizeEmail().trim(),
  body("password", "Must be a non-empty string").isString().notEmpty(),
  body("nickname", "Must be a string of at least 3 characters!")
    .isString()
    .isLength({ min: 3 }),
  validationMiddleware,
  UserController.signup
);

router.post(
  "/user/login",
  body("password", "Must be a non-empty string").isString().notEmpty(),
  body()
    .custom((value) => {
      return value.username || value.email;
    })
    .withMessage("Must provide either username or email!"),
  oneOf([
    body("username", "Must be a non-empty string")
      .exists()
      .isString()
      .notEmpty()
      .trim(),
    body("email", "Must be a valid email").isEmail().normalizeEmail(),
  ]),
  validationMiddleware,
  UserController.login
);

export default router;
