import { config } from "dotenv";
import { createClient } from "redis";

config();

const client = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT as string, 10),
  },
});

export default client;
