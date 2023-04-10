import bcrypt from "bcryptjs";
import uid from "uid-safe";
import db from "../db";
import { User } from "../types";

const UserService = {
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
    password: string
  ): Promise<User> {
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    return (
      await db("user")
        .insert({ username, email, password: hashedPassword })
        .returning("*")
    )[0];
  },

  async login(identifier: string, password: string): Promise<string | null> {
    const result = (
      await db("user")
        .where({ username: identifier })
        .orWhere({ email: identifier })
    )[0];
    if (!result) return null;

    const validPassword = bcrypt.compareSync(password, result.password);
    if (!validPassword) return null;

    return uid(24);
  },
};

export default UserService;
