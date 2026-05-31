import { Redis } from 'ioredis';
import { env } from './env.js';

/**
 * Shared Redis connection (ioredis). Used for: user-profile caching, the
 * auth-route rate-limit store, and the JWT revocation denylist.
 *
 * Resilience: a bounded retry strategy keeps reconnecting in the background,
 * and all cache helpers fail open (see lib/cache.ts) so a Redis outage degrades
 * to direct DB reads rather than taking the API down.
 */
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

redis.on('connect', () => console.log('✅ Redis connected'));
redis.on('error', (err) => console.warn('⚠️  Redis error:', err.message));

export async function disconnectRedis(): Promise<void> {
  await redis.quit();
}
