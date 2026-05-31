import { redis } from '../config/redis.js';

// Redis ke upar ek patli si caching layer. Har call try/catch me wrapped hai
// Agar Redis fail ho jaye toh read pe null (miss) aur write best-effort - cache ko sirf optimization maante hain, source of truth kabhi nahi
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
      // best-effort, fail hone par chhod do
    }
  },

  async del(key: string): Promise<void> {
    try {
      await redis.del(key);
    } catch {
      // best-effort
    }
  },
};

// Saare cache keys ek hi jagah banate hain taaki format consistent rahe aur typo na ho
export const cacheKeys = {
  userProfile: (userId: string) => `user:profile:${userId}`,
  tokenDenylist: (jti: string) => `auth:denylist:${jti}`,
  taskList: (userId: string) => `tasks:list:${userId}`,
};
