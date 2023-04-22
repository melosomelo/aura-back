import db from "../db";
import APIError from "../errors/APIError";
import FriendshipRequestDAO from "../models/friendshipRequest";
import { FriendshipRequest, FriendshipRequestStatus, User } from "../types";
import UserService from "./user";

const FriendshipRequestService = {
  async getById(id: number): Promise<FriendshipRequest | null> {
    return FriendshipRequestDAO.getById(id);
  },

  async createFriendshipRequest(from: string, to: string): Promise<void> {
    const [sender, receiver] = await Promise.all(
      [from, to].map((nickname) => UserService.getUserByNickname(nickname))
    );
    if (sender === null || receiver === null)
      throw new APIError("User not found!", 404);
    if (sender.id === receiver.id)
      throw new APIError("Cannot send a friend request to yourself!", 400);
    const hasActiveFriendshipRequest =
      (await this.getActiveFriendRequestsBetween(sender.id, receiver.id))
        .length > 0;
    if (hasActiveFriendshipRequest) {
      throw new APIError(
        "Cannot send new friendship request because you're already friends or there is a pending friend request",
        400
      );
    }
    await FriendshipRequestDAO.create(sender.id, receiver.id);
  },

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
    return FriendshipRequestDAO.getPendingFriendshipRequests(userId);
  },

  async respondToRequest(
    receiver: User,
    requestId: number,
    newStatus: FriendshipRequestStatus
  ) {
    const request = await this.getById(requestId);
    if (request === null || request.receiverId !== receiver.id)
      throw new APIError("Friendship request not found!", 404);
    if (request.status !== "pending")
      throw new APIError("Cannot respond to a request that's not pending", 400);
    await FriendshipRequestDAO.update(requestId, newStatus);
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
