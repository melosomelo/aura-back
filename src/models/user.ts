import db from "../db";
import { User } from "../types";

const UserDAO = {
  async findById(id: string): Promise<User | null> {
    const result = (await db("user").where({ id }))[0];
    return result === undefined ? null : result;
  },
  async findUserByUsername(username: string): Promise<User | null> {
    const result = (await db("user").where({ username }))[0];
    return result === undefined ? null : result;
  },
  async findUserByEmail(email: string): Promise<User | null> {
    const result = (await db("user").where({ email }))[0];
    return result === undefined ? null : result;
  },
  async findUserByNickname(nickname: string): Promise<User | null> {
    const result = (await db("user").where({ nickname }))[0];
    return result === undefined ? null : result;
  },
  async insertUser(
    username: string,
    email: string,
    nickname: string,
    password: string
  ): Promise<User> {
    return (
      await db("user")
        .insert({ username, email, nickname, password })
        .returning("*")
    )[0];
  },
  async searchByNickname(nickname: string): Promise<Array<User>> {
    return db("user")
      .select(["nickname", "updatedAt", "createdAt"])
      .whereILike("nickname", `%${nickname}%`);
  },

  async getUserFriends(userId: string) {
    return db("friendship_request")
      .join("user", function () {
        this.on("user.id", "=", "senderId").orOn("user.id", "=", "receiverId");
      })
      .select(["user.createdAt", "user.updatedAt", "user.nickname"])
      .where({ status: "accepted" })
      .andWhere("user.id", "!=", userId);
  },
};

export default UserDAO;
