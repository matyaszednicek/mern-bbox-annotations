import { Router } from 'express';

import { isAuthenticated } from '../middlewares/index';
import {
  createNewTask,
  getTask,
  deleteTask,
  getTaskAnnotations,
  addImagesToTask,
  getTasks,
} from '../controllers/tasks.controller';
import { validateBody } from '../middlewares/validate';
import {
  addImagesToTaskSchema,
  createTaskSchema,
} from '../schemas/tasks.schema';
import { createAnnotationSchema } from '../schemas/annotations.schema';
import { createNewAnnotation } from '../controllers/annotations.controller';

export default (router: Router) => {
  router.get('/tasks', isAuthenticated, getTasks);
  router.get('/tasks/:taskId', isAuthenticated, getTask);
  router.get(
    '/tasks/:taskId/images/:imageId/annotations',
    isAuthenticated,
    getTaskAnnotations
  );

  router.post(
    '/tasks',
    isAuthenticated,
    validateBody(createTaskSchema),
    createNewTask
  );
  router.post(
    '/tasks/:taskId/images',
    isAuthenticated,
    validateBody(addImagesToTaskSchema),
    addImagesToTask
  );
  router.post(
    '/tasks/:taskId/images/:imageId/annotations',
    isAuthenticated,
    validateBody(createAnnotationSchema),
    createNewAnnotation
  );

  router.delete('/tasks/:taskId', isAuthenticated, deleteTask);
};
