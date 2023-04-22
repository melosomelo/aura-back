import bcrypt from "bcryptjs";
import uid from "uid-safe";
import db from "../db";
import APIError from "../errors/APIError";
import UserDAO from "../models/user";
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
    return UserDAO.findUserByUsername(username);
  },

  async getUserByEmail(email: string): Promise<User | null> {
    return UserDAO.findUserByEmail(email);
  },

  async getUserByNickname(nickname: string): Promise<User | null> {
    return UserDAO.findUserByNickname(nickname);
  },

  async createUser(
    username: string,
    email: string,
    nickname: string,
    password: string
  ): Promise<User> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return UserDAO.insertUser(username, email, nickname, hashedPassword);
  },

  async login(
    identifier: string,
    password: string
  ): Promise<{ sessionId: string; user: User } | null> {
    let result =
      (await UserDAO.findUserByNickname(identifier)) ??
      (await UserDAO.findUserByEmail(identifier));
    if (!result) return null;

    const validPassword = bcrypt.compareSync(password, result.password);
    if (!validPassword) return null;

    const sessionId = await uid(24);
    return { sessionId, user: result };
  },

  async searchByNickname(nickname: string): Promise<Array<User>> {
    return UserDAO.searchByNickname(nickname);
  },

  async getFriends(userId: string) {
    return UserDAO.getUserFriends(userId);
  },
};

export default UserService;
