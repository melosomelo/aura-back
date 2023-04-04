import type { Knex } from "knex";

// Update with your config settings.

const defaultConfig: Knex.Config = {
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT as string, 10),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  },
  migrations: {
    tableName: "knex_migrations",
  },
};

const config: { [key: string]: Knex.Config } = {
  development: defaultConfig,
  production: defaultConfig,
};

module.exports = config;
