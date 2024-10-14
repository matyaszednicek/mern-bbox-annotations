import { Router } from 'express';

import { isAuthenticated } from '../middlewares/index';
import { upload } from '../services/images.service';
import {
  getImage,
  getImageTasks,
  getUserImages,
  uploadImage,
} from '../controllers/images.controller';

export default (router: Router) => {
  router.get('/images', isAuthenticated, getUserImages);
  router.get('/images/:id', isAuthenticated, getImage);
  router.get('/images/:id/tasks', isAuthenticated, getImageTasks);

  router.post(
    '/images/upload',
    isAuthenticated,
    upload.single('image'),
    uploadImage
  );
};
