import { cache, cacheKeys } from '../lib/cache.js';
import type { JwtPayload } from '../utils/token.js';

// JWT ko revoke karne ke liye Redis denylist. Logout pe token ka jti store karte hain, TTL utni jitni token ki bachi hui life hai
// Matlab entry khud hi expire ho jaayegi jab token expire hota, na koi cleanup job chahiye na unbounded growth
export const tokenService = {
  async revoke(payload: JwtPayload): Promise<void> {
    if (!payload.exp) return;
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    if (ttl <= 0) return; // already expire ho chuka, kuch revoke karne ko bacha hi nahi
    await cache.set(cacheKeys.tokenDenylist(payload.jti), '1', ttl);
  },

  // Fail-open: agar Redis tak nahi pohonch paaye toh token ko not-revoked maan lete hain
  async isRevoked(jti: string): Promise<boolean> {
    const entry = await cache.get<string>(cacheKeys.tokenDenylist(jti));
    return entry !== null;
  },
};
