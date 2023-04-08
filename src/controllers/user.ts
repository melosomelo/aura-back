import { Request, Response } from "../types";
import UserService from "../services/user";
import APIError from "../errors/APIError";

interface SignupBody {
  username: string;
  email: string;
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
    return res.status(200).json({
      email: user.email,
      username: user.username,
      nickname: user.nickname,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    });
  },
};

export default UserController;
