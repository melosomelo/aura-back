import { Request, Response } from "../types";
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
    const { sessionId, user } = await UserService.login(
      (username ?? email) as string,
      password
    );
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
    const sender = session!.user;

    await FriendshipRequestService.createFriendshipRequest(
      sender.nickname,
      nickname
    );
    return res.status(201).end();
  },

  async getPendingFriendshipRequests(req: Request, res: Response) {
    const { user } = req.session!;
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
    const { user } = req.session!;

    const { response } = req.body;

    const requestId = req.params.requestId as string;

    await FriendshipRequestService.respondToRequest(
      user,
      parseInt(requestId, 10),
      response === "no" ? "refused" : "accepted"
    );

    return res.status(200).end();
  },

  async getFriends(req: Request, res: Response) {
    const { user } = req.session!;
    const friends = await UserService.getFriends(user.id);
    return res.status(200).json(friends);
  },
};

export default UserController;
