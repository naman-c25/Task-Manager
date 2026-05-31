import { prisma } from '../config/db.js';

/** Public-safe user shape (never includes the password hash). */
export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

// Reused select so we never accidentally leak the password column.
const publicUserSelect = { id: true, name: true, email: true } as const;

/**
 * Data-access layer for users. Isolating Prisma here keeps the service layer
 * persistence-agnostic and gives us one place to tune queries/selects.
 */
export const userRepository = {
  /** Lightweight existence check — selects a single indexed column only. */
  async existsByEmail(email: string): Promise<boolean> {
    const found = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return found !== null;
  },

  /** Fetch the full row (incl. password) for credential verification. */
  findByEmailWithPassword(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findPublicById(id: string): Promise<PublicUser | null> {
    return prisma.user.findUnique({ where: { id }, select: publicUserSelect });
  },

  async create(data: { name: string; email: string; password: string }): Promise<PublicUser> {
    return prisma.user.create({ data, select: publicUserSelect });
  },
};
