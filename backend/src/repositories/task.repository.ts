import { prisma } from '../config/db.js';
import type { CreateTaskInput, UpdateTaskInput } from '../validations/task.validation.js';

// Shared select - foreign key (userId) ko response me nahi bhejte
const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Task ka data access. Har query userId se scoped hai, isliye banda sirf apne hi rows chhoo sakta hai - ownership query level pe enforce ho rahi, sirf logic me nahi
export const taskRepository = {
  listByUser(userId: string) {
    return prisma.task.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: taskSelect,
    });
  },

  findByIdForUser(id: string, userId: string) {
    return prisma.task.findFirst({ where: { id, userId }, select: taskSelect });
  },

  create(userId: string, data: CreateTaskInput) {
    return prisma.task.create({ data: { ...data, userId }, select: taskSelect });
  },

  update(id: string, data: UpdateTaskInput) {
    return prisma.task.update({ where: { id }, data, select: taskSelect });
  },

  delete(id: string) {
    return prisma.task.delete({ where: { id } });
  },
};
