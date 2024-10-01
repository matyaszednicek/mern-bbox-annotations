import mongoose, { Document } from 'mongoose';

export type AnnotationProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  task: mongoose.Types.ObjectId;
  image: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
};
export type Annotation = Document<mongoose.Types.ObjectId> & AnnotationProps;

const AnnotationSchema = new mongoose.Schema<Annotation>({
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  width: { type: Number, required: true },
  height: { type: Number, required: true },
  label: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

export const AnnotationModel = mongoose.model<Annotation>(
  'Annotation',
  AnnotationSchema
);

export const getAnnotationsByTask = (task: string) =>
  AnnotationModel.find({ task });
export const getAnnotationsByImageAndTask = (image: string, task: string) =>
  AnnotationModel.find({ image, task });
export const getAnnotationById = (id: string) => AnnotationModel.findById(id);
export const createAnnotation = (values: AnnotationProps) =>
  new AnnotationModel(values)
    .save()
    .then((annotation) => annotation.toObject());
export const deleteAnnotationById = (id: string) =>
  AnnotationModel.findByIdAndDelete(id);
export const updateAnnotationById = (
  id: string,
  values: Partial<AnnotationProps>
) => AnnotationModel.findByIdAndUpdate(id, values, { new: true });
