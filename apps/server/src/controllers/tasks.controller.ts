import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import {
  getTasksForUser,
  getTaskByIdAndValidateOwnership,
  createNewTaskForUser,
  addImagesToExistingTask,
  deleteTaskByIdService,
} from '../services/tasks.service';
import { UserFacingError } from '../utils/errors.util';
import { AddImagesToTaskBody, CreateTaskBody } from '@mbba/schema';
import { getAnnotationsByImageAndTask } from '../models/annotations.model';

export const getTasks: RequestHandler = async (req, res, next) => {
  try {
    if (!req.identity) {
      throw new UserFacingError('You must be logged in to view tasks', 401);
    }

    const tasks = await getTasksForUser(req.identity.id);
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getFullTask: RequestHandler<{ taskId: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { taskId } = req.params;
    if (!isValidObjectId(taskId)) {
      throw new UserFacingError('Invalid task ID', 400);
    }

    const task = await getTaskByIdAndValidateOwnership(
      taskId,
      req.identity?.id
    );

    const taskWithImages = await task.populate('images');

    res.status(200).json(taskWithImages);
  } catch (error) {
    next(error);
  }
};

export const getTaskAnnotations: RequestHandler<{
  taskId: string;
  imageId: string;
}> = async (req, res, next) => {
  try {
    const { taskId, imageId } = req.params;
    if (!req.identity) {
      throw new UserFacingError('You must be logged in to view tasks', 401);
    }
    if (!isValidObjectId(taskId) || !isValidObjectId(imageId)) {
      throw new UserFacingError('Invalid task or image ID', 400);
    }

    await getTaskByIdAndValidateOwnership(taskId, req.identity.id);

    const annotations = await getAnnotationsByImageAndTask(imageId, taskId);
    res.status(200).json(annotations);
  } catch (error) {
    next(error);
  }
};

export const createNewTask: RequestHandler<
  unknown,
  unknown,
  CreateTaskBody
> = async (req, res, next) => {
  try {
    if (!req.identity) {
      throw new UserFacingError('You must be logged in to create a task', 401);
    }

    const { name, labels } = req.body;
    const newTask = await createNewTaskForUser(req.identity.id, name, labels);
    res.status(201).json(newTask);
  } catch (error) {
    next(error);
  }
};

export const addImagesToTask: RequestHandler<
  { taskId: string },
  unknown,
  AddImagesToTaskBody
> = async (req, res, next) => {
  try {
    if (!req.identity) {
      throw new UserFacingError('You must be logged in to modify tasks', 401);
    }

    const { taskId } = req.params;
    const { images } = req.body;

    if (!isValidObjectId(taskId)) {
      throw new UserFacingError('Invalid task ID', 400);
    }

    const task = await getTaskByIdAndValidateOwnership(taskId, req.identity.id);
    const updatedTask = await addImagesToExistingTask(task, images);
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

export const deleteTask: RequestHandler<{ taskId: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { taskId } = req.params;
    if (!isValidObjectId(taskId)) {
      throw new UserFacingError('Invalid task ID', 400);
    }

    const deletedTask = await deleteTaskByIdService(taskId);
    res.status(200).json(deletedTask);
  } catch (error) {
    next(error);
  }
};
