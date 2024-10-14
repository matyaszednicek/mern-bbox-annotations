import { Request, Response, NextFunction } from 'express';
import { UserFacingError } from '../utils/errors.util';
import { ZodError } from 'zod';

export const errorHandler = (
  error: Error | UserFacingError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (error instanceof ZodError) {
    const formattedErrors = error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return res.status(400).json({ errors: formattedErrors });
  }
  if (error instanceof UserFacingError) {
    const statusCode = error.statusCode || 400;
    return res.status(statusCode).json({ message: error.message });
  }
  console.error('Error:', error);
  res.sendStatus(500);
};
