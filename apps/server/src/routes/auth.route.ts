import { validateBody } from './../middlewares/validate';
import { Router } from 'express';
import { login, logout, me, register } from '../controllers/auth.controller';
import { registerBodySchema } from '@mbba/schema';
import { isAuthenticated } from '../middlewares';

export default (router: Router) => {
  router.post('/auth/register', validateBody(registerBodySchema), register);
  router.post('/auth/login', login);
  router.post('/auth/logout', logout);

  router.get('/auth/me', isAuthenticated, me);
};
