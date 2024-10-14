import { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { getImageByIdAndValidateOwnership } from '../services/images.service';
import { UserFacingError } from '../utils/errors.util';
import { getImageTasks as getTasksByImage } from '../models/tasks.model';
import { createImage, getImages } from '../models/images.model';

export const getUserImages: RequestHandler = async (req, res, next) => {
  try {
    if (!req.identity) {
      throw new UserFacingError('You must be logged in to view images', 401);
    }

    const images = await getImages(req.identity.id);
    res.status(200).json(images);
  } catch (error) {
    next(error);
  }
};

export const getImage: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!req.identity) {
      throw new UserFacingError('You must be logged in to view images', 401);
    }
    if (!isValidObjectId(id)) {
      throw new UserFacingError('Invalid image ID', 400);
    }

    const image = await getImageByIdAndValidateOwnership(id, req.identity.id);
    res.status(200).json(image);
  } catch (error) {
    next(error);
  }
};

export const getImageTasks: RequestHandler<{ id: string }> = async (
  req,
  res,
  next
) => {
  try {
    const { id } = req.params;

    if (!req.identity) {
      throw new UserFacingError('You must be logged in to view tasks', 401);
    }
    if (!isValidObjectId(id)) {
      throw new UserFacingError('Invalid image ID', 400);
    }

    const image = await getImageByIdAndValidateOwnership(id, req.identity.id);
    const tasks = await getTasksByImage(image._id.toString());
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const uploadImage: RequestHandler = async (req, res, next) => {
  try {
    if (!req.identity) {
      throw new UserFacingError(
        'You must be logged in to upload an image',
        401
      );
    }

    if (!req.file) {
      throw new UserFacingError('No file uploaded', 400);
    }

    const imageUrl = `${req.protocol}://${req.get('host')}/assets/uploads/${
      req.identity._id
    }/${req.file.filename}`;

    const image = await createImage({ uri: imageUrl, user: req.identity._id });

    res.status(201).json({ image });
  } catch (error) {
    next(error);
  }
};
