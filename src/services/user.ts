import bcrypt from "bcryptjs";
import uid from "uid-safe";
import db from "../db";
import APIError from "../errors/APIError";
import { User, FriendshipRequest } from "../types";

const UserService = {
  async testUniquenessForCredentials(
    username: string,
    email: string,
    nickname: string
  ): Promise<void> {
    const usernameTaken =
      (await UserService.getUserByUsername(username)) !== null;
    if (usernameTaken) {
      throw new APIError("Username is already taken!", 400);
    }
    const emailTaken = (await UserService.getUserByEmail(email)) !== null;
    if (emailTaken) {
      throw new APIError("Email is already taken!", 400);
    }
    const nicknameTaken =
      (await UserService.getUserByNickname(nickname)) !== null;
    if (nicknameTaken) {
      throw new APIError("Nickname is already taken!", 400);
    }
  },
  async getUserByUsername(username: string): Promise<User | null> {
    const result = (await db("user").where({ username }))[0];
    return result === undefined ? null : result;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    const result = (await db("user").where({ email }))[0];
    return result === undefined ? null : result;
  },

  async getUserByNickname(nickname: string): Promise<User | null> {
    const result = (await db("user").where({ nickname }))[0];
    return result === undefined ? null : result;
  },

  async createUser(
    username: string,
    email: string,
    nickname: string,
    password: string
  ): Promise<User> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return (
      await db("user")
        .insert({ username, email, nickname, password: hashedPassword })
        .returning("*")
    )[0];
  },

  async login(
    identifier: string,
    password: string
  ): Promise<{ sessionId: string; user: User } | null> {
    const result = (
      await db("user")
        .where({ username: identifier })
        .orWhere({ email: identifier })
    )[0];
    if (!result) return null;

    const validPassword = bcrypt.compareSync(password, result.password);
    if (!validPassword) return null;

    const sessionId = await uid(24);
    return { sessionId, user: result };
  },

  async searchByNickname(nickname: string): Promise<Array<User>> {
    return db("user")
      .select(["nickname", "updatedAt", "createdAt"])
      .whereILike("nickname", `%${nickname}%`);
  },

  async getFriends(userId: string) {
    return db("friendship_request")
      .join("user", function () {
        this.on("user.id", "=", "senderId").orOn("user.id", "=", "receiverId");
      })
      .select(["user.createdAt", "user.updatedAt", "user.nickname"])
      .where({ status: "accepted" })
      .andWhere("user.id", "!=", userId);
  },
};

export default UserService;
