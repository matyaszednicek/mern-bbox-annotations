import {
  Task,
  getTaskById,
  createTask,
  deleteTaskById,
  getUserTasks,
} from '../models/tasks.model';
import { UserFacingError } from '../utils/errors.util';
import mongoose from 'mongoose';

export const getTasksForUser = async (userId: string) => {
  const tasks = await getUserTasks(userId);
  if (!tasks) {
    throw new UserFacingError('Tasks not found', 404);
  }
  return tasks;
};

export const getTaskByIdAndValidateOwnership = async (
  taskId: string,
  userId: string
) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new UserFacingError('Task not found', 404);
  }
  if (task.user.toString() !== userId) {
    throw new UserFacingError(
      'You are not authorized to view or modify this task',
      403
    );
  }
  return task;
};

export const createNewTaskForUser = async (
  userId: string,
  name: string,
  labels: string[]
) => {
  const newTask = await createTask({
    name,
    labels,
    images: [],
    user: new mongoose.Types.ObjectId(userId),
  });
  return newTask;
};

export const addImagesToExistingTask = async (task: Task, images: string[]) => {
  const imageIds = images.map(
    (imageId) => new mongoose.Types.ObjectId(imageId)
  );
  task.images = imageIds;
  await task.save();
  return task;
};

export const deleteTaskByIdService = async (taskId: string) => {
  const deletedTask = await deleteTaskById(taskId);
  if (!deletedTask) {
    throw new UserFacingError('Task not found', 404);
  }
  return deletedTask;
};
