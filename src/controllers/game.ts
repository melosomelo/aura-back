import GameService from "../services/game";
import { Request, Response } from "../types";

const GameController = {
  async create(req: Request, res: Response) {
    const { user } = req.session!;
    const game = await GameService.createGame(user.id);
    return res.status(201).json(game);
  },
  async inviteToGame(
    req: Request<{ nickname: string; gameId: string }>,
    res: Response
  ) {
    const { user } = req.session!;
    const { nickname, gameId } = req.body;
  },
};

export default GameController;
