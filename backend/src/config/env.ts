import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

// Saare env variables ko start me hi validate kar lete hain, taaki galat config pe app boot hi na ho
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(5000),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  REDIS_URL: z.string().default('redis://127.0.0.1:6379'),
  JWT_ACCESS_SECRET: z.string().min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('7d'),
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(8).max(15).default(12),
  // Redis me user profile kitne second cache rahega
  USER_CACHE_TTL: z.coerce.number().default(300),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Kuch required env missing hai toh saaf saaf bata ke band kar do
  console.error('Invalid environment configuration:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  ...parsed.data,
  isProduction: parsed.data.NODE_ENV === 'production',
  // CLIENT_ORIGIN comma se alag karke array bana lete hain (multiple origins allow karne ke liye)
  allowedOrigins: parsed.data.CLIENT_ORIGIN.split(',').map((origin) => origin.trim()),
};
