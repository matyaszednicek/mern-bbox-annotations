import { Router } from 'express';
import auth from './auth.route';
import users from './users.route';
import images from './images.route';
import tasks from './tasks.route';
import annotations from './annotations.route';

const router = Router();

export default (): Router => {
  auth(router);
  users(router);
  images(router);
  tasks(router);
  annotations(router);

  return router;
};
