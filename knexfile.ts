import type { Knex } from "knex";
import { config as configDotenv } from "dotenv";

configDotenv();

const defaultConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: "localhost", // temporary
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: "knex_migrations",
    directory: "./database/migrations",
  },
};

const config: { [key: string]: Knex.Config } = {
  development: defaultConfig,
  production: defaultConfig,
};

module.exports = config;
