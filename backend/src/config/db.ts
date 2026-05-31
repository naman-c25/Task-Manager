import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

/**
 * Prisma client singleton.
 *
 * Prisma manages its own connection pool (default size = num_cpus * 2 + 1; tune
 * via `?connection_limit=` on DATABASE_URL). Caching the instance on
 * globalThis prevents `tsx watch` hot-reloads from opening a new pool on every
 * file change, which would otherwise exhaust Postgres connections.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProduction ? ['error'] : ['warn', 'error'],
  });

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}

/** Verify connectivity at boot so the server fails fast on a bad DATABASE_URL. */
export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  console.log('PostgreSQL connected (Prisma)');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
