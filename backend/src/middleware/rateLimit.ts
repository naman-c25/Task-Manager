import { rateLimit } from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { redis } from '../config/redis.js';

// Rate limiter Redis pe based hai taaki limit saare API instances me share ho
// (Render scale karega toh in-memory counter har instance pe alag hota, banda har instance pe max attempts paa leta). Keys window se khud expire ho jaati hain
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many attempts. Please try again later.' },
  store: new RedisStore({
    prefix: 'rl:auth:',
    // ioredis adapter - limiter ke raw commands ko Redis tak bhejta hai
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sendCommand: (...args: string[]): Promise<any> =>
      redis.call(...(args as [string, ...string[]])),
  }),
});
