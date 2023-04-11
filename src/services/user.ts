import bcrypt from "bcryptjs";
import uid from "uid-safe";
import db from "../db";
import { User, FriendshipRequest } from "../types";

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

  async getActiveFriendRequestsBetween(
    firstUserId: string,
    secondUserId: string
  ): Promise<Array<FriendshipRequest>> {
    return db("friendship_request").where(function () {
      this.where({ senderId: firstUserId, receiverId: secondUserId })
        .orWhere({
          receiverId: firstUserId,
          senderId: secondUserId,
        })
        .andWhere(function () {
          this.whereIn("status", ["accepted", "pending"]);
        });
    });
  },

  async getPendingFriendshipRequests(
    userId: string
  ): Promise<{ receiver: string; sender: string; sentAt: Date }[]> {
    return db("friendship_request")
      .join(db.ref("user").as("sender"), "senderId", "=", "sender.id")
      .join(db.ref("user").as("receiver"), "receiverId", "=", "receiver.id")
      .select([
        db.ref("sender.nickname").as("sender"),
        db.ref("receiver.nickname").as("receiver"),
        db.ref("friendship_request.createdAt").as("sentAt"),
      ])
      .where(function () {
        this.where({ senderId: userId })
          .orWhere({ receiverId: userId })
          .andWhere(function () {
            this.where({ status: "pending" });
          });
      });
  },

  async createFriendRequest(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    return db("friendship_request").insert({
      senderId,
      receiverId,
      status: "pending",
    });
  },
};

export default UserService;
