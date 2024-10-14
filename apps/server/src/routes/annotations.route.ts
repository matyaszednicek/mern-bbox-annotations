import { Router } from 'express';
import { isAuthenticated } from '../middlewares/index';
import { deleteAnnotation } from '../controllers/annotations.controller';

export default (router: Router) => {
  router.delete('/annotations/:id', isAuthenticated, deleteAnnotation);
};
