import { RequestHandler } from 'express';
import {
  getUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  User,
} from '../models/users.model';
import { UserFacingError } from '../utils/errors.util';
import { UpdateUserBody } from '@mbba/schema';

export const getAllUsers: RequestHandler<unknown, User[]> = async (
  req,
  res,
  next
) => {
  try {
    const users = await getUsers();

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

export const getUser: RequestHandler<{ id: string }, User> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      throw new UserFacingError('User not found', 404);
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser: RequestHandler<{ id: string }, User> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;
    if (!id) {
      throw new UserFacingError('User ID is required');
    }

    const deletedUser = await deleteUserById(id);

    if (!deletedUser) {
      throw new UserFacingError('User not found', 404);
    }

    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser: RequestHandler<
  { id: string },
  User,
  UpdateUserBody
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { username } = req.body;

    const updatedUser = await updateUserById(id, { username });

    if (!updatedUser) {
      throw new UserFacingError('User not found', 404);
    }

    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};
