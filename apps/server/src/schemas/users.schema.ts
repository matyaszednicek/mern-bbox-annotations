import { z } from 'zod';

export const updateUserSchema = z.object({ username: z.string().min(3) });
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
