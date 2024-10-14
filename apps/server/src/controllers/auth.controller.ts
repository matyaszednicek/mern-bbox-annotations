import { RequestHandler } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { UserFacingError } from '../utils/errors.util';
import { RegisterInput } from '../schemas/auth.schema';

export const register: RequestHandler<unknown, unknown, RegisterInput> = async (
  req,
  res,
  next
) => {
  try {
    const { email, password, username } = req.body;

    if (!email || !password || !username) {
      throw new UserFacingError('Missing required fields');
    }

    const user = await registerUser(email, password, username);

    res.status(201).json(user);
  } catch (error) {
    next(error);
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new UserFacingError('Missing required fields');
    }

    const user = await loginUser(email, password);

    res
      .cookie(
        process.env.SESSION_COOKIE_NAME || 'MBBA-AUTH',
        user.authentication.sessionToken,
        { domain: process.env.FRONTEND_URL || 'localhost', path: '/' }
      )
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};
