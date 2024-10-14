import mongoose, { Document } from 'mongoose';
import { TaskModel } from './tasks.model';

type ImageProps = {
  uri: string;
  user: mongoose.Types.ObjectId;
};
export type Image = Document<mongoose.Types.ObjectId> & ImageProps;

const ImageSchema = new mongoose.Schema<Image>({
  uri: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

ImageSchema.pre('findOneAndDelete', async function (next) {
  const image = await this.model.findOne<Image>(this.getQuery());

  if (image) {
    await TaskModel.updateMany(
      { images: image._id },
      { $pull: { images: image._id } } // Remove image reference from all tasks
    );
  }

  next();
});

ImageSchema.pre(
  'deleteMany',
  { document: false, query: true },
  async function (next) {
    const images = await this.model.find(this.getFilter());

    for (const image of images) {
      await TaskModel.updateMany(
        { images: image._id },
        { $pull: { images: image._id } } // Remove image reference from all tasks
      );
    }

    next();
  }
);

export const ImageModel = mongoose.model<Image>('Image', ImageSchema);

export const getImages = (user: string) => ImageModel.find({ user });
export const getImageById = (id: string) => ImageModel.findById(id);
export const createImage = (values: ImageProps) =>
  new ImageModel(values).save().then((image) => image.toObject());
export const deleteImageById = (id: string) => ImageModel.findByIdAndDelete(id);
export const updateImageById = (id: string, values: Partial<ImageProps>) =>
  ImageModel.findByIdAndUpdate(id, values, { new: true });
