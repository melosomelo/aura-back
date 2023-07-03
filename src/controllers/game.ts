import GameService from "../services/game";
import session from "../session";
import { Request, Response, GameType } from "../types";

const GameController = {
  async create(req: Request<{ type: GameType }>, res: Response) {
    const { type } = req.body;
    const { user } = req.session!;
    const game = await GameService.createGame(user.id, type);
    await session.createGame(req.headers["aura-auth"] as string, game);
    return res.status(201).json(game);
  },
  async joinGame(req: Request<{ gameId: string }>, res: Response) {
    const { gameId } = req.body;
    const { user } = req.session!;
    const joinedTeam = await GameService.joinGame(user, gameId);
    await session.joinGame(gameId, joinedTeam, user);
    return res.status(204).end();
  },
  async startGame(req: Request<{ gameId: string }>, res: Response) {
    const { gameId } = req.body;
    const { user } = req.session!;
    const game = GameService.startGame(user, gameId);
    return res.status(200).send(game);
  },
  async move(
    req: Request<{
      gameId: string;
      transform: { x: string; y: string; z: string };
    }>,
    res: Response
  ) {
    const { gameId } = req.body;
    const { transform } = req.body;
    const { user } = req.session!;
    const game = GameService.move(gameId, user, transform);
    return res.status(200).send(game);
  },
  async run(req: Request<{ gameId: string }>, res: Response) {
    const { gameId } = req.body;
    const { user } = req.session!;
    const game = GameService.run(gameId, user);
    return res.status(200).send(game);
  },
  async goal(req: Request<{ gameId: string }>, res: Response) {
    const { gameId } = req.body;
    const { user } = req.session!;
    const game = GameService.goal(gameId, user);
    return res.status(200).send(game);
  },
};

export default GameController;
