import { Router } from "express";
import { body, oneOf, query } from "express-validator";
import UserController from "../controllers/user";
import validationMiddleware from "../middlewares/validate";
import authMiddleware from "../middlewares/auth";

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
  UserController.create
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

router.get(
  "/users/search",
  authMiddleware,
  query("nickname", "Must be a non-empty string!").isString().notEmpty().trim(),
  validationMiddleware,
  UserController.index
);

router.post(
  "/user/friendshipRequest",
  authMiddleware,
  body("nickname", "Must be a non-empty string!").isString().notEmpty().trim(),
  validationMiddleware,
  UserController.sendFriendRequest
);

router.post(
  "/user/friendshipRequest/:requestId/respond",
  authMiddleware,
  body("response", "Must be either 'yes' or 'no'").exists().isIn(["yes", "no"]),
  validationMiddleware,
  UserController.respondToFriendshipRequest
);

router.get(
  "/user/pendingFriendshipRequests",
  authMiddleware,
  UserController.getPendingFriendshipRequests
);

router.get("/user/friends", authMiddleware, UserController.getFriends);

export default router;
