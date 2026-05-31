import { Redis } from 'ioredis';
import { env } from './env.js';

// Ek hi Redis connection sab jagah use hota hai - caching, rate limiting aur JWT denylist ke liye
// Agar Redis down ho jaye toh cache helpers fail-open hain (lib/cache.ts), matlab app crash nahi hoga, DB se padh lega
const globalForRedis = globalThis as unknown as { redis?: Redis };

export const redis =
  globalForRedis.redis ??
  new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 2,
    retryStrategy: (times) => Math.min(times * 200, 2000),
    lazyConnect: false,
  });

if (!env.isProduction) {
  globalForRedis.redis = redis;
}

redis.on('connect', () => console.log('Redis connected'));
redis.on('error', (err) => console.warn('Redis error:', err.message));

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}
