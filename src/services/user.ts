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
    return (
      await db("user").insert({ username, email, password }).returning("*")
    )[0];
  },

  async login(identifier: string, password: string): Promise<string | null> {},
};

export default UserService;
