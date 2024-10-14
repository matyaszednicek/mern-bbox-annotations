import fs from 'fs';
import multer from 'multer';
import path from 'path';
import { Request } from 'express';
import { UserFacingError } from '../utils/errors.util';
import { getImageById } from '../models/images.model';

const uploadsFolder = path.resolve(__dirname, 'assets/uploads');

const storage = multer.diskStorage({
  destination: async (req: Request, file, cb) => {
    if (!req.identity) {
      return cb(
        new UserFacingError('You must be logged in to upload images', 401),
        ''
      );
    }
    const userFolder = path.join(uploadsFolder, req.identity._id.toString());
    await createFolderIfNotExists(userFolder);
    cb(null, userFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const createFolderIfNotExists = async (folderPath: string) => {
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }
};

export const upload = multer({ storage });

export const getImageByIdAndValidateOwnership = async (
  imageId: string,
  userId: string
) => {
  const image = await getImageById(imageId);
  if (!image) {
    throw new UserFacingError('Image not found', 404);
  }
  if (image.user.toString() !== userId) {
    throw new UserFacingError('You are not authorized to view this image', 403);
  }
  return image;
};
