import { prisma } from '../config/db.js';

// Public-safe user shape (password hash kabhi bhi include nahi hoga)
export interface PublicUser {
  id: string;
  name: string;
  email: string;
}

// Ek hi select reuse karte hain taaki galti se kabhi password column leak na ho
const publicUserSelect = { id: true, name: true, email: true } as const;

// User ka data access layer. Saara Prisma yahin rehta hai taaki service layer ko pata na ho ki DB kaunsa hai, aur query tuning ek hi jagah ho
export const userRepository = {
  // Sirf exist check karna hai toh ek hi indexed column (id) select karte hain, pura row nahi
  async existsByEmail(email: string): Promise<boolean> {
    const found = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });
    return found !== null;
  },

  // Login ke liye pura row (password ke saath) chahiye hota hai
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
