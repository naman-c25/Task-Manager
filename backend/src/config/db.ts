import { PrismaClient } from '@prisma/client';
import { env } from './env.js';

// Prisma client ka single instance rakhte hain, har baar naya connection pool na bane isliye globalThis pe cache kar diya
// (dev me hot-reload pe baar baar naye connection ban jaate the warna)
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: env.isProduction ? ['error'] : ['warn', 'error'],
  });

if (!env.isProduction) {
  globalForPrisma.prisma = prisma;
}

// Boot pe ek baar connect kar ke check kar lete hain ki DATABASE_URL sahi hai
export async function connectDatabase(): Promise<void> {
  await prisma.$connect();
  console.log('PostgreSQL connected (Prisma)');
}

export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
}
