import { redis } from '../config/redis.js';

/**
 * Thin caching layer over Redis. Every operation is wrapped so a Redis failure
 * never propagates — reads return a miss (null) and writes are best-effort.
 * Callers treat the cache as an optimization, never a source of truth.
 */
export const cache = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const raw = await redis.get(key);
      return raw ? (JSON.parse(raw) as T) : null;
    } catch {
      return null;
    }
  },

  async set(key: string, value: unknown, ttlSeconds: number): Promise<void> {
    try {
      await redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch {
      /* best-effort */
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch {
      /* best-effort */
    }
  },
};

/** Centralized cache key builders so key formats stay consistent and typo-free. */
export const cacheKeys = {
  userProfile: (userId: string) => `user:profile:${userId}`,
  tokenDenylist: (jti: string) => `auth:denylist:${jti}`,
};
