import http from "http";
import express from "express";
import "express-async-errors";
import cors from "cors";
import * as dotenv from "dotenv";
import db from "./db";
import { WebSocketServer } from "ws";
import redis from "./redis";
import routes from "./routes";
import { Request, Response, NextFunction } from "./types";
import APIError from "./errors/APIError";

dotenv.config();

const app = express();
const server = http.createServer(app);
const ws = new WebSocketServer({ server });

ws.on("connection", (ws) => {
  console.log("A user has connected!");
});

app.use(express.json());

app.use(cors());

app.use(routes);

app.use((err: Error, req: Request<any>, res: Response, next: NextFunction) => {
  let message = "An unexpected error has occurred";
  let statusCode = 500;
  if (err instanceof APIError) {
    message = err.message;
    statusCode = err.statusCode;
  }
  console.log(err);
  return res.status(statusCode).json({ message, statusCode });
});

db.raw("SELECT 1")
  .then(() => redis.connect())
  .then(() =>
    server.listen(process.env.PORT, () => {
      console.log(`Server started in port ${process.env.PORT}`);
    })
  )
  .catch((e) => console.log(`Could not start server: ${e}`));
