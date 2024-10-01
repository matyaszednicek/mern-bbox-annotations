import { Router } from 'express';

import { isAuthenticated } from '../middlewares/index';
import {
  createNewTask,
  getFullTask,
  deleteTask,
  getTaskAnnotations,
  addImagesToTask,
  getTasks,
} from '../controllers/tasks.controller';
import { validateBody } from '../middlewares/validate';
import {
  addImagesToTaskBodySchema,
  createTaskBodySchema,
  upsertAnnotationsBodySchema,
} from '@mbba/schema';
import { createAnnotationBodySchema } from '@mbba/schema';
import {
  createNewAnnotation,
  upsertAnnotations,
} from '../controllers/annotations.controller';

export default (router: Router) => {
  router.get('/tasks', isAuthenticated, getTasks);
  router.get('/tasks/:taskId', isAuthenticated, getFullTask);
  router.get(
    '/tasks/:taskId/images/:imageId/annotations',
    isAuthenticated,
    getTaskAnnotations
  );

  router.post(
    '/tasks',
    isAuthenticated,
    validateBody(createTaskBodySchema),
    createNewTask
  );
  router.post(
    '/tasks/:taskId/images',
    isAuthenticated,
    validateBody(addImagesToTaskBodySchema),
    addImagesToTask
  );
  router.post(
    '/tasks/:taskId/images/:imageId/annotations',
    isAuthenticated,
    validateBody(createAnnotationBodySchema),
    createNewAnnotation
  );
  router.post(
    '/tasks/:taskId/images/:imageId/annotations/upsert',
    isAuthenticated,
    validateBody(upsertAnnotationsBodySchema),
    upsertAnnotations
  );

  router.delete('/tasks/:taskId', isAuthenticated, deleteTask);
};
