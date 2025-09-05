import { createClient } from "redis";

let redis: ReturnType<typeof createClient>;

declare global {
  // eslint-disable-next-line no-var
  var __redis__: ReturnType<typeof createClient>;
}

if (process.env.NODE_ENV === "production") {
  redis = createClient({
    url: process.env.REDIS_URL,
  });
} else {
  if (!global.__redis__) {
    global.__redis__ = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });
  }
  redis = global.__redis__;
}

redis.on("error", (err) => console.log("Redis Client Error", err));

if (!redis.isOpen) {
  redis.connect();
}

export { redis };
