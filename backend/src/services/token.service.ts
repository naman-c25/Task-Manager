import { cache, cacheKeys } from '../lib/cache.js';
import type { JwtPayload } from '../utils/token.js';

/**
 * JWT revocation via a Redis denylist. On logout we store the token's `jti`
 * with a TTL equal to its remaining lifetime, so the entry self-expires exactly
 * when the token would have anyway — no unbounded growth, no cleanup job.
 */
export const tokenService = {
  async revoke(payload: JwtPayload): Promise<void> {
    if (!payload.exp) return;
    const ttl = payload.exp - Math.floor(Date.now() / 1000);
    if (ttl <= 0) return; // already expired — nothing to revoke
    await cache.set(cacheKeys.tokenDenylist(payload.jti), '1', ttl);
  },

  /** Fail-open: if Redis is unreachable, treat the token as not revoked. */
  async isRevoked(jti: string): Promise<boolean> {
    const entry = await cache.get<string>(cacheKeys.tokenDenylist(jti));
    return entry !== null;
  },
};
