import { z } from 'zod';

export const createTaskSchema = z.object({
  labels: z.array(z.string()).min(1, 'At least one label is required'),
});
export type CreateTaskInput = z.infer<typeof createTaskSchema>;

export const addImagesToTaskSchema = z.object({ images: z.array(z.string()) });
export type AddImagesToTaskInput = z.infer<typeof addImagesToTaskSchema>;
