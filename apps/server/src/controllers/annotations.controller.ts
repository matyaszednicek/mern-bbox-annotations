import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import {
  getAnnotationsForTaskAndImage,
  createAnnotationForTaskAndImage,
  deleteAnnotationByIdService,
} from '../services/annotations.service';
import { UserFacingError } from '../utils/errors.util';

export const getAnnotations: RequestHandler<{
  taskId: string;
  imageId: string;
}> = async (req, res, next) => {
  try {
    const { taskId, imageId } = req.params;

    if (!req.identity) {
      throw new UserFacingError(
        'You must be logged in to view annotations',
        401
      );
    }

    if (!isValidObjectId(taskId) || !isValidObjectId(imageId)) {
      throw new UserFacingError('Invalid task or image ID', 400);
    }

    const annotations = await getAnnotationsForTaskAndImage(
      taskId,
      imageId,
      req.identity.id
    );
    res.status(200).json(annotations);
  } catch (error) {
    next(error);
  }
};

export const createNewAnnotation: RequestHandler<{
  taskId: string;
  imageId: string;
}> = async (req, res, next) => {
  try {
    const { taskId, imageId } = req.params;
    const { x, y, width, height, label } = req.body;

    if (!req.identity) {
      throw new UserFacingError(
        'You must be logged in to create annotations',
        401
      );
    }

    if (!isValidObjectId(taskId) || !isValidObjectId(imageId)) {
      throw new UserFacingError('Invalid task or image ID', 400);
    }

    const annotation = await createAnnotationForTaskAndImage(
      taskId,
      imageId,
      { x, y, width, height, label },
      req.identity.id
    );

    res.status(201).json(annotation);
  } catch (error) {
    next(error);
  }
};

export const deleteAnnotation: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!req.identity) {
      throw new UserFacingError(
        'You must be logged in to delete annotations',
        401
      );
    }

    if (!isValidObjectId(id)) {
      throw new UserFacingError('Invalid annotation ID', 400);
    }

    const annotation = await deleteAnnotationByIdService(id, req.identity.id);
    res.status(200).json(annotation);
  } catch (error) {
    next(error);
  }
};
