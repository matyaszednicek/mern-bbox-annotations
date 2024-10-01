import { Router } from 'express';

import { validateBody } from './../middlewares/validate';
import { isOwner, isAuthenticated } from './../middlewares/index';
import {
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from '../controllers/users.controller';
import { updateUserBodySchema } from '@mbba/schema';

export default (router: Router) => {
  router.get('/users', getAllUsers);
  router.get('/users/:id', getUser);

  router.delete('/users/:id', isAuthenticated, isOwner, deleteUser);

  router.patch(
    '/users/:id',
    isAuthenticated,
    isOwner,
    validateBody(updateUserBodySchema),
    updateUser
  );
};
