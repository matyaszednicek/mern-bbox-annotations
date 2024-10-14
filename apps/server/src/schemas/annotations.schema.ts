import { z } from 'zod';

export const createAnnotationSchema = z.object({
  x: z.number().min(0, 'X coordinate must be at least 0'), // TODO: normalize to 0,1
  y: z.number().min(0, 'Y coordinate must be at least 0'),
  width: z.number().positive('Width must be a positive number'),
  height: z.number().positive('Height must be a positive number'),
  label: z.string(),
  task: z.string(),
  image: z.string(),
  user: z.string(),
});

export type CreateAnnotationInput = z.infer<typeof createAnnotationSchema>;

export const updateAnnotationSchema = z.object({
  x: z.number().min(0).optional(),
  y: z.number().min(0).optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  label: z.string().optional(),
});

export type UpdateAnnotationInput = z.infer<typeof updateAnnotationSchema>;
