import { z } from 'zod';

// Client side ke auth schemas - jaan boojh ke backend wale policy se bilkul same rakhe hain taaki user ko turant feedback mile aur server source of truth bana rahe
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Add at least one lowercase letter')
  .regex(/[A-Z]/, 'Add at least one uppercase letter')
  .regex(/[0-9]/, 'Add at least one number');

export const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
  password,
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

// Task create/edit form. Backend ke task validation se match karta hai
export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(160, 'Title is too long'),
  description: z.string().trim().max(2000, 'Description is too long').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
