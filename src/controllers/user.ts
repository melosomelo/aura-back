import { Request, Response, User, UserSession } from "../types";
import UserService from "../services/user";
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
  async signup(req: Request<SignupBody>, res: Response) {
    const { username, email, password, nickname } = req.body;
    // check to see if email or username have already been used.
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

  async searchForUsers(req: Request<any, { nickname: string }>, res: Response) {
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
    const sender = (session as UserSession).user as User;
    const receiver = await UserService.getUserByNickname(nickname);

    // Does the receiver exist?
    if (receiver === null) throw new APIError("User not found!", 404);

    // Is the receiver the same user as the sender?
    if (sender.id === receiver.id)
      throw new APIError("Cannot send friendship request to yourself!", 400);

    // Does an active friendship request already exist between the pair?
    const activeFriendshipRequests =
      await UserService.getActiveFriendRequestsBetween(sender.id, receiver.id);

    if (activeFriendshipRequests.length > 0)
      throw new APIError(
        "Cannot send new friendship request because you're already friends or there is a pending friend request",
        400
      );

    await UserService.createFriendRequest(sender.id, receiver.id);
    return res.status(201).end();
  },
};

export default UserController;
