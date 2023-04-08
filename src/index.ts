import express from "express";
import "express-async-errors";
import * as dotenv from "dotenv";
import db from "./db";
import routes from "./routes";
import { Request, Response, NextFunction } from "./types";
import APIError from "./errors/APIError";

dotenv.config();

const app = express();

app.use(express.json());

app.use(routes);

app.use((err: Error, req: Request<any>, res: Response, next: NextFunction) => {
  let message = "An unexpected error has occurred";
  let statusCode = 500;
  if (err instanceof APIError) {
    message = err.message;
    statusCode = err.statusCode;
  }
  return res.status(statusCode).json({ message, statusCode });
});

db.raw("SELECT 1")
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log("Database connected successfully.");
      console.log(`Server started in port ${process.env.PORT}`);
    })
  )
  .catch((e) => console.log(`Could not connect to database: ${e}`));
