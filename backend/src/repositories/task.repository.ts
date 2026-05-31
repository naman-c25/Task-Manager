import { prisma } from '../config/db.js';
import type { CreateTaskInput, UpdateTaskInput } from '../validations/task.validation.js';

// Shared select — excludes the foreign key from API responses.
const taskSelect = {
  id: true,
  title: true,
  description: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} as const;

/**
 * Data-access layer for tasks. All reads/writes are scoped by `userId` so a user
 * can only ever touch their own rows — ownership is enforced at the query level,
 * not just in business logic.
 */
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
