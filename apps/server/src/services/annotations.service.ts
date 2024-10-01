import {
  createAnnotation,
  getAnnotationsByImageAndTask,
  deleteAnnotationById,
  getAnnotationById,
  AnnotationModel,
} from '../models/annotations.model';
import { getTaskById } from '../models/tasks.model';
import { getImageById } from '../models/images.model';
import { UserFacingError } from '../utils/errors.util';
import mongoose from 'mongoose';
import { getTaskByIdAndValidateOwnership } from './tasks.service';
import { UpsertAnnotationsBody } from '@mbba/schema';

export const getAnnotationsForTaskAndImage = async (
  taskId: string,
  imageId: string,
  userId: string
) => {
  await getTaskByIdAndValidateOwnership(taskId, userId);

  const annotations = await getAnnotationsByImageAndTask(taskId, imageId);
  return annotations;
};

export const createAnnotationForTaskAndImage = async (
  taskId: string,
  imageId: string,
  annotationData: {
    x: number;
    y: number;
    width: number;
    height: number;
    label: string;
  },
  userId: string
) => {
  const task = await getTaskById(taskId);
  if (!task) {
    throw new UserFacingError('Task not found', 404);
  }

  if (task.labels.indexOf(annotationData.label) === -1) {
    throw new UserFacingError('Invalid label', 400);
  }

  if (task.user.toString() !== userId) {
    throw new UserFacingError(
      'You are not authorized to add annotations to this task',
      403
    );
  }

  const image = await getImageById(imageId);
  if (!image) {
    throw new UserFacingError('Image not found', 404);
  }

  const annotation = await createAnnotation({
    ...annotationData,
    task: task._id,
    image: image._id,
    user: new mongoose.Types.ObjectId(userId),
  });

  return annotation;
};

export const upsertAnnotationsForTaskAndImage = async (
  taskId: string,
  imageId: string,
  annotations: UpsertAnnotationsBody
) => {
  const operations = annotations.map((item) => {
    if (!item._id) {
      return {
        insertOne: {
          document: { ...item, task: taskId, image: imageId },
        },
      };
    }
    return {
      updateOne: {
        filter: { _id: item._id },
        update: { $set: item },
        upsert: true,
      },
    };
  });

  return AnnotationModel.bulkWrite(operations);
};

export const deleteAnnotationByIdService = async (
  annotationId: string,
  userId: string
) => {
  const annotation = await getAnnotationById(annotationId);

  if (!annotation) {
    throw new UserFacingError('Annotation not found', 404);
  }
  if (annotation.user.toString() !== userId) {
    throw new UserFacingError(
      'You are not authorized to delete this annotation',
      403
    );
  }
  const deletedAnnotation = await deleteAnnotationById(annotationId);
  if (!deletedAnnotation) {
    throw new UserFacingError('Annotation not found', 404);
  }

  return deletedAnnotation;
};
