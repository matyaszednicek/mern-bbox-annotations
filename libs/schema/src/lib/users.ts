import { z } from 'zod';

export const updateUserBodySchema = z.object({ username: z.string().min(3) });
export type UpdateUserBody = z.infer<typeof updateUserBodySchema>;
