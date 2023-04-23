import { Router } from "express";

import userRouter from "./user";
import gameRouter from "./game";

const router = Router();

router.use(userRouter);
router.use("/game", gameRouter);

export default router;
