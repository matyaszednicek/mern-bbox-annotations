import { z } from 'zod';

export const registerBodySchema = z.object({
  username: z
    .string()
    .min(3)
    .max(20)
    .regex(
      /^[a-zA-Z0-9]{3,}$/,
      'Username must be at least 3 characters long and contain only letters and numbers'
    ),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(
      /(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>_-])/,
      'Password must contain a number and a special character'
    ),
});
export type RegisterBody = z.infer<typeof registerBodySchema>;

export const loginBodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});
export type LoginBody = z.infer<typeof loginBodySchema>;

export const userSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string().email(),
});
export type User = z.infer<typeof userSchema>;
