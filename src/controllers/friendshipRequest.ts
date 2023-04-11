import UserService from "../services/user";
import { Request, Response, UserSession } from "../types";

const FriendshipRequestController = {
  create(req: Request<{ nickname: string }>, res: Response) {
    const {
      body: { nickname },
      session,
    } = req;
    const { user: sender } = session as UserSession;
  },
};

export default FriendshipRequestController;
