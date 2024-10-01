import { z } from 'zod';

export const createTaskBodySchema = z.object({
  name: z.string().min(3, 'Name must be at least three characters'),
  labels: z.array(z.string()).min(1, 'At least one label is required'),
});
export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;

export const addImagesToTaskBodySchema = z.object({
  images: z.array(z.string()),
});
export type AddImagesToTaskBody = z.infer<typeof addImagesToTaskBodySchema>;

export const taskSchema = z.object({
  _id: z.string(),
  name: z.string(),
  labels: z.array(z.string()),
  images: z.array(z.string()),
  user: z.string(),
});
export type Task = z.infer<typeof taskSchema>;

export const imageSchema = z.object({
  _id: z.string(),
  uri: z.string(),
  user: z.string(),
});
export type Image = z.infer<typeof imageSchema>;

export const fullTaskSchema = taskSchema.extend({
  images: z.array(imageSchema),
});
export type FullTask = z.infer<typeof fullTaskSchema>;
