import { taskRepository } from '../repositories/task.repository.js';
import { ApiError } from '../utils/ApiError.js';
import { cache, cacheKeys } from '../lib/cache.js';
import { env } from '../config/env.js';
import type { CreateTaskInput, UpdateTaskInput } from '../validations/task.validation.js';

type Task = Awaited<ReturnType<typeof taskRepository.findByIdForUser>>;

/**
 * Task business logic. Owns ownership checks and the per-user list cache: reads
 * are served read-through from Redis, and every mutation invalidates that key so
 * the next read is always fresh.
 */
export const taskService = {
  async list(userId: string) {
    const key = cacheKeys.taskList(userId);

    const cached = await cache.get<NonNullable<Task>[]>(key);
    if (cached) return cached;

    const tasks = await taskRepository.listByUser(userId);
    await cache.set(key, tasks, env.USER_CACHE_TTL);
    return tasks;
  },

  async create(userId: string, input: CreateTaskInput) {
    const task = await taskRepository.create(userId, input);
    await cache.del(cacheKeys.taskList(userId));
    return task;
  },

  async update(userId: string, id: string, input: UpdateTaskInput) {
    // Ownership check — scoped lookup returns null for tasks the user doesn't own.
    const existing = await taskRepository.findByIdForUser(id, userId);
    if (!existing) throw ApiError.notFound('Task not found');

    const task = await taskRepository.update(id, input);
    await cache.del(cacheKeys.taskList(userId));
    return task;
  },

  async remove(userId: string, id: string) {
    const existing = await taskRepository.findByIdForUser(id, userId);
    if (!existing) throw ApiError.notFound('Task not found');

    await taskRepository.delete(id);
    await cache.del(cacheKeys.taskList(userId));
  },
};
