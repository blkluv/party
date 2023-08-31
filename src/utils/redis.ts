import { Redis } from "@upstash/redis";
import { env } from "~/config/env";

export const getRedis = () => {
  return new Redis({
    url: env.UPSTASH_REDIS_URL,
    token: env.UPSTASH_REDIS_TOKEN,
  });
};
