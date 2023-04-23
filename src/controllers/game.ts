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
    const invite = await GameService.invitePlayer(user.id, nickname, gameId);
    return res.status(201).json(invite);
  },
};

export default GameController;
