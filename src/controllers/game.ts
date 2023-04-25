import GameService from "../services/game";
import session from "../session";
import { Request, Response } from "../types";

const GameController = {
  async create(req: Request, res: Response) {
    const { user } = req.session!;
    const game = await GameService.createGame(user.id);
    await session.createGame(req.headers["aura-auth"] as string, game);
    return res.status(201).json(game);
  },
  async joinGame(req: Request<{ gameId: string }>, res: Response) {
    const { gameId } = req.body;
    const { user } = req.session!;
    await GameService.joinGame(user, gameId);
    return res.status(200).end();
  },
  async startGame(req: Request<{ gameId: string }>, res: Response) {
    const { gameId } = req.body;
    const { user } = req.session!;
    await GameService.startGame(user, gameId);
    return res.status(200).end();
  },
};

export default GameController;