import Redis from "ioredis";

let redisClient: Redis | null = null;
let isConnected = false;

export function getRedisClient(): Redis | null {
  if (redisClient) return redisClient;

  const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

  try {
    redisClient = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 2000,
      retryStrategy(times) {
        if (times > 3) return null; // do not retry endlessly if Redis is offline
        return Math.min(times * 100, 1000);
      },
      lazyConnect: true,
    });

    redisClient.on("connect", () => {
      isConnected = true;
    });

    redisClient.on("error", (err) => {
      isConnected = false;
      // Suppress spammy offline logs during development without redis
      if (process.env.NODE_ENV !== "production") {
        // silent fallback
      } else {
        console.warn("Redis connection warning:", err.message);
      }
    });

    redisClient.connect().catch(() => {
      isConnected = false;
    });

    return redisClient;
  } catch {
    isConnected = false;
    return null;
  }
}

export async function getCachedData<T>(key: string): Promise<T | null> {
  const client = getRedisClient();
  if (!client || !isConnected) return null;

  try {
    const raw = await client.get(key);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

export async function setCachedData(key: string, data: any, ttlSeconds = 60): Promise<void> {
  const client = getRedisClient();
  if (!client || !isConnected) return;

  try {
    await client.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch {
    // Ignore cache set failure
  }
}

export async function invalidateLeaderboardCache(): Promise<void> {
  const client = getRedisClient();
  if (!client || !isConnected) return;

  try {
    const keys = await client.keys("leaderboard:*");
    if (keys.length > 0) {
      await client.del(...keys);
    }
  } catch {
    // Ignore cache invalidation failure
  }
}
