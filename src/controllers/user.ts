import { Request, Response, UserSession } from "../types";
import UserService from "../services/user";
import FriendshipRequestService from "../services/friendshipRequest";
import APIError from "../errors/APIError";
import session from "../session";

interface SignupBody {
  username: string;
  email: string;
  password: string;
  nickname: string;
}

interface LoginBody {
  username?: string;
  email?: string;
  password: string;
}

const UserController = {
  async create(req: Request<SignupBody>, res: Response) {
    const { username, email, password, nickname } = req.body;

    await UserService.testUniquenessForCredentials(username, email, nickname);

    const user = await UserService.createUser(
      username,
      email,
      nickname,
      password
    );

    return res.status(201).json({
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  },

  async login(req: Request<LoginBody>, res: Response) {
    const { username, email, password } = req.body;
    const loginResult = await UserService.login(
      (username ?? email) as string,
      password
    );
    if (loginResult === null) throw new APIError("Invalid credentials", 401);
    const { sessionId, user } = loginResult;
    await session.startUserSession(sessionId, user);
    return res.status(200).json({ sessionId });
  },

  async index(req: Request<any, { nickname: string }>, res: Response) {
    const { nickname } = req.query;
    const users = await UserService.searchByNickname(nickname);
    return res.status(200).json(users);
  },

  async sendFriendRequest(req: Request<{ nickname: string }>, res: Response) {
    const {
      body: { nickname },
      session,
    } = req;
    // Change this later.
    const sender = (session as UserSession).user;
    const receiver = await UserService.getUserByNickname(nickname);

    // Does the receiver exist?
    if (receiver === null) throw new APIError("User not found!", 404);

    // Is the receiver the same user as the sender?
    if (sender.id === receiver.id)
      throw new APIError("Cannot send friendship request to yourself!", 400);

    // Does an active friendship request already exist between the pair?
    const activeFriendshipRequests =
      await FriendshipRequestService.getActiveFriendRequestsBetween(
        sender.id,
        receiver.id
      );

    if (activeFriendshipRequests.length > 0)
      throw new APIError(
        "Cannot send new friendship request because you're already friends or there is a pending friend request",
        400
      );

    await FriendshipRequestService.createFriendshipRequest(
      sender.id,
      receiver.id
    );
    return res.status(201).end();
  },

  async getPendingFriendshipRequests(req: Request, res: Response) {
    const user = (req.session as UserSession).user;
    const requests =
      await FriendshipRequestService.getPendingFriendshipRequests(user.id);
    // Separates each request for when the current user is the sender or receiver
    const response = requests.reduce<{
      receiver: Array<{ sender: string; sentAt: Date; requestId: number }>;
      sender: Array<{ receiver: string; sentAt: Date; requestId: number }>;
    }>(
      (prev, curr) => {
        if (curr.receiver === user.nickname)
          prev.receiver.push({
            sender: curr.sender,
            sentAt: curr.sentAt,
            requestId: curr.requestId,
          });
        else
          prev.sender.push({
            receiver: curr.receiver,
            sentAt: curr.sentAt,
            requestId: curr.requestId,
          });
        return prev;
      },
      { receiver: [], sender: [] }
    );
    return res.status(200).json(response);
  },

  async respondToFriendshipRequest(
    req: Request<{ response: "yes" | "no" }>,
    res: Response
  ) {
    const { user } = req.session as UserSession;
    const { response } = req.body;
    const requestId = req.params.requestId as string;
    const friendshipRequest = await FriendshipRequestService.getById(
      parseInt(requestId, 10)
    );
    if (friendshipRequest === null || friendshipRequest.receiverId !== user.id)
      throw new APIError("Friendship request not found!", 404);

    if (friendshipRequest.status !== "pending")
      throw new APIError("Cannot respond to a request that's not pending", 400);
    await FriendshipRequestService.updateRequestStatus(
      requestId,
      response === "no" ? "refused" : "accepted"
    );
    return res.status(200).end();
  },

  async getFriends(req: Request, res: Response) {
    const { user } = req.session as UserSession;
    const friends = await UserService.getFriends(user.id);
    return res.status(200).json(friends);
  },
};

export default UserController;
