import { z } from 'zod';

export const TASK_STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;

const titleSchema = z.string().trim().min(1, 'Title is required').max(160, 'Title is too long');
const descriptionSchema = z.string().trim().max(2000, 'Description is too long').optional();
const statusSchema = z.enum(TASK_STATUSES);
const idParam = z.object({ id: z.string().uuid('Invalid task id') });

export const createTaskSchema = z.object({
  body: z.object({
    title: titleSchema,
    description: descriptionSchema,
    status: statusSchema.optional(),
  }),
});

export const updateTaskSchema = z.object({
  params: idParam,
  body: z
    .object({
      title: titleSchema.optional(),
      description: descriptionSchema,
      status: statusSchema.optional(),
    })
    // Reject empty PATCH bodies so we never issue a no-op update.
    .refine((data) => Object.keys(data).length > 0, { message: 'No fields to update' }),
});

export const taskIdSchema = z.object({ params: idParam });

export type CreateTaskInput = z.infer<typeof createTaskSchema>['body'];
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>['body'];
