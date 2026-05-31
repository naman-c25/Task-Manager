import bcrypt from 'bcryptjs';
import { env } from '../config/env.js';
import { userRepository, type PublicUser } from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { signAccessToken } from '../utils/token.js';
import { cache, cacheKeys } from '../lib/cache.js';
import type { LoginInput, RegisterInput } from '../validations/auth.validation.js';

interface AuthResult {
  user: PublicUser;
  token: string;
}

function buildAuthResult(user: PublicUser): AuthResult {
  return {
    token: signAccessToken({ sub: user.id, email: user.email }),
    user,
  };
}

/**
 * Authentication business logic. Owns all rules (hashing, uniqueness, credential
 * checks) and the read-through cache for profiles. Framework-free and testable.
 */
export const authService = {
  async register(input: RegisterInput): Promise<AuthResult> {
    if (await userRepository.existsByEmail(input.email)) {
      throw ApiError.conflict('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(input.password, env.BCRYPT_SALT_ROUNDS);
    const user = await userRepository.create({
      name: input.name,
      email: input.email,
      password: passwordHash,
    });

    return buildAuthResult(user);
  },

  async login(input: LoginInput): Promise<AuthResult> {
    const user = await userRepository.findByEmailWithPassword(input.email);
    // Compare even on a missing user is unnecessary; the generic message below
    // already prevents user enumeration.
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);
    if (!passwordMatches) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    return buildAuthResult({ id: user.id, name: user.name, email: user.email });
  },

  /**
   * Read-through cache: serve the profile from Redis when warm, otherwise hit
   * Postgres and backfill. Cuts DB load for the frequently-polled /me endpoint.
   */
  async getProfile(userId: string): Promise<PublicUser> {
    const key = cacheKeys.userProfile(userId);

    const cached = await cache.get<PublicUser>(key);
    if (cached) return cached;

    const user = await userRepository.findPublicById(userId);
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    await cache.set(key, user, env.USER_CACHE_TTL);
    return user;
  },
};
