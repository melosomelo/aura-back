import db from "../db";
import { FriendshipRequest, FriendshipRequestStatus, User } from "../types";

const FriendshipRequestService = {
  async getById(id: number): Promise<FriendshipRequest | null> {
    const result = (await db("friendship_request").where({ id }))[0];
    return result === undefined ? null : result;
  },

  async createFriendshipRequest(
    senderId: string,
    receiverId: string
  ): Promise<void> {
    await db("friendship_request").insert({
      senderId,
      receiverId,
      status: "pending",
    });
  },

  async sendFriendshipRequest(from: User, to: User) {},

  /**
    Gets all the pending friendship requests involving the following user.
    The user can be both the sender and receiver.
  */
  async getPendingFriendshipRequests(userId: string): Promise<
    Array<{
      receiver: string;
      sender: string;
      sentAt: Date;
      requestId: number;
    }>
  > {
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

  async updateRequestStatus(
    requestId: string,
    newStatus: FriendshipRequestStatus
  ): Promise<void> {
    await db("friendship_request")
      .update({ status: newStatus })
      .where({ id: requestId });
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
};

export default FriendshipRequestService;
