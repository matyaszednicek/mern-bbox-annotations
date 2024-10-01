import { Request, Response, NextFunction } from 'express';
import { getUserBySessionToken } from '../models/users.model';
import { UserFacingError } from '../utils/errors.util';

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const sessionToken =
      req.cookies[process.env.SESSION_COOKIE_NAME || 'MBBA-AUTH'];

    if (!sessionToken) {
      return res.sendStatus(401);
    }

    const existingUser = await getUserBySessionToken(sessionToken);
    if (!existingUser) {
      return res.sendStatus(401);
    }

    req.identity = existingUser;

    return next();
  } catch (error) {
    console.error(error);
    return res.sendStatus(400);
  }
};

export const isOwner = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params; // TODO: renmame to userId
    const currentUserId = req.identity?._id;

    if (!currentUserId) {
      throw new UserFacingError('You are not authorized to do that.', 403);
    }

    if (currentUserId.toString() !== id) {
      throw new UserFacingError('You are not authorized to do that.', 403);
    }

    return next();
  } catch (error) {
    next(error);
  }
};
