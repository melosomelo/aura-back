import db from "../db";
import { FriendshipRequest, FriendshipRequestStatus } from "../types";

const FriendshipRequestDAO = {
  async getById(id: number): Promise<FriendshipRequest | null> {
    const result = (await db("friendship_request").where({ id }))[0];
    return result === undefined ? null : result;
  },

  async create(senderId: string, receiverId: string): Promise<void> {
    return db("friendship_request").insert({
      senderId,
      receiverId,
      status: "pending",
    });
  },

  async getPendingFriendshipRequests(userId: string) {
    return db("friendship_request")
      .join(db.ref("user").as("sender"), "senderId", "=", "sender.id")
      .join(db.ref("user").as("receiver"), "receiverId", "=", "receiver.id")
      .select([
        db.ref("friendship_request.id").as("requestId"),
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

  async update(id: number, status: FriendshipRequestStatus) {
    await db("friendship_request").update({ status }).where({ id });
  },
};

export default FriendshipRequestDAO;
