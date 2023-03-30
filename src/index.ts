import express from "express";
import * as dotenv from "dotenv";
import db from "./db";

dotenv.config();

const app = express();

app.use(express.json());

db.raw("SELECT 1")
  .then(() =>
    app.listen(process.env.PORT, () => {
      console.log("Database connected successfully.");
      console.log(`Server started in port ${process.env.PORT}`);
    })
  )
  .catch((e) => console.log(`Could not connect to database: ${e}`));
