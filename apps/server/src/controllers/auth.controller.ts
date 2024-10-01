import { RequestHandler } from 'express';
import { registerUser, loginUser } from '../services/auth.service';
import { UserFacingError } from '../utils/errors.util';
import { RegisterBody } from '@mbba/schema';

export const register: RequestHandler<unknown, unknown, RegisterBody> = async (
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
        {
          domain: process.env.FRONTEND_URL || 'localhost',
          path: '/',
          httpOnly: true,
        }
      )
      .status(200)
      .json(user);
  } catch (error) {
    next(error);
  }
};

export const logout: RequestHandler = async (req, res, next) => {
  try {
    res
      .clearCookie(process.env.SESSION_COOKIE_NAME || 'MBBA-AUTH', {
        domain: process.env.BACKEND_DOMAIN || 'localhost',
        path: '/',
      })
      .sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const me: RequestHandler = async (req, res, next) => {
  try {
    if (!req.identity) {
      throw new UserFacingError('You must be logged in.', 401);
    }

    const { username, email, _id } = req.identity;
    res.status(200).json({ username, email, id: _id });
  } catch (error) {
    next(error);
  }
};
