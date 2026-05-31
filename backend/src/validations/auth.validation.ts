import { z } from 'zod';

// Password ka rule - min 8 char, ek lowercase, ek uppercase aur ek number zaroori
// Frontend pe bhi same shape ka schema hai taaki client aur server validation kabhi alag na ho jaaye
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be at most 72 characters')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number');

export const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(60),
    email: z.string().trim().toLowerCase().email('Please provide a valid email'),
    password: passwordSchema,
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().toLowerCase().email('Please provide a valid email'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
