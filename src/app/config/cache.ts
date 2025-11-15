import Redis from "ioredis";
import { env } from "./env";

export const redisClient = new Redis({
  host: env.REDIS_HOST,
  port: env.REDIS_PORT,
  password: env.REDIS_PASSWORD,
});

redisClient.on("connect", () => console.log("✅ Redis connected"));
redisClient.on("error", (err: any) => console.error("❌ Redis error:", err));
