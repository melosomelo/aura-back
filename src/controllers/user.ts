import { Request, Response } from "../types";

interface SignupBody {
  username: string;
  email: string;
  password: string;
}

const UserController = {
  signup(req: Request<SignupBody>, res: Response) {
    const { username, email, password } = req.body;
    return res.status(200).end();
  },
};

export default UserController;
