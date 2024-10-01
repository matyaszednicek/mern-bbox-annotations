import { z } from 'zod';

export const createAnnotationBodySchema = z.object({
  x: z.number().min(0, 'X coordinate must be at least 0'), // TODO: normalize to 0,1
  y: z.number().min(0, 'Y coordinate must be at least 0'),
  width: z.number().positive('Width must be a positive number'),
  height: z.number().positive('Height must be a positive number'),
  label: z.string(),
  task: z.string(),
  image: z.string(),
  user: z.string(),
});

export type CreateAnnotationBody = z.infer<typeof createAnnotationBodySchema>;

export const upsertAnnotationsBodySchema = z.array(
  z.object({
    x: z.number().min(0, 'X coordinate must be at least 0'), // TODO: normalize to 0,1
    y: z.number().min(0, 'Y coordinate must be at least 0'),
    width: z.number().positive('Width must be a positive number'),
    height: z.number().positive('Height must be a positive number'),
    label: z.string(),
    task: z.string(),
    image: z.string(),
    user: z.string(),
    _id: z.string().nullish(),
  })
);

export type UpsertAnnotationsBody = z.infer<typeof upsertAnnotationsBodySchema>;

export const updateAnnotationBodySchema = z.object({
  x: z.number().min(0).optional(),
  y: z.number().min(0).optional(),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  label: z.string().optional(),
});

export type UpdateAnnotationBody = z.infer<typeof updateAnnotationBodySchema>;

export const annotationSchema = z.object({
  _id: z.string(),
  x: z.number().min(0, 'X coordinate must be at least 0'), // TODO: normalize to 0,1
  y: z.number().min(0, 'Y coordinate must be at least 0'),
  width: z.number().positive('Width must be a positive number'),
  height: z.number().positive('Height must be a positive number'),
  label: z.string(),
  task: z.string(),
  image: z.string(),
  user: z.string(),
});

export type Annotation = z.infer<typeof annotationSchema>;
