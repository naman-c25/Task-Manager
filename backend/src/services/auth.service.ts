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

// Auth ka saara business logic - hashing, uniqueness check, credential check aur profile ka cache. Express se koi lena dena nahi, isliye test karna aasan
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
    // Same generic message dono jagah, taaki koi guess na kar paaye ki email exist karta hai ya nahi
    if (!user) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const passwordMatches = await bcrypt.compare(input.password, user.password);
    if (!passwordMatches) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    return buildAuthResult({ id: user.id, name: user.name, email: user.email });
  },

  // Read-through cache: pehle Redis se try karo, na mile toh Postgres se laao aur cache me daal do - /me baar baar call hota hai isliye DB load kam ho jaata hai
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
