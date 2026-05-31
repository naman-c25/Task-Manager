import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis.js';

/**
 * Rate limiter backed by Redis so limits are shared across every API instance
 * (essential once Render scales horizontally — in-memory counters would let a
 * client get `max` attempts *per instance*). Keys self-expire via the window.
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
  store: new RedisStore({
    prefix: 'rl:auth:',
    // ioredis adapter — forward raw commands from the limiter to Redis.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendCommand: (...args: string[]): Promise<any> =>
      redis.call(...(args as [string, ...string[]])),
  }),
});
