import GameService from "../services/game";
import { Request, Response } from "../types";

const GameController = {
  async create(req: Request, res: Response) {
    const { user } = req.session!;
    const game = await GameService.createGame(user.id);
    return res.status(201).json(game);
  },
};

export default GameController;
