import { Request, Response } from "../types";
import UserService from "../services/user";
import APIError from "../errors/APIError";
import session from "../session";

interface SignupBody {
  username: string;
  email: string;
  password: string;
}

interface LoginBody {
  username?: string;
  email?: string;
  password: string;
}

const UserController = {
  async signup(req: Request<SignupBody>, res: Response) {
    const { username, email, password } = req.body;
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
    const user = await UserService.createUser(username, email, password);
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
};

export default UserController;
