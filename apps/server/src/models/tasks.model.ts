import mongoose, { Document } from 'mongoose';
import { AnnotationModel } from './annotations.model';

type TaskProps = {
  name: string;
  labels: string[];
  images: mongoose.Types.ObjectId[];
  user: mongoose.Types.ObjectId;
};
export type Task = Document<mongoose.Types.ObjectId> & TaskProps;

const TaskSchema = new mongoose.Schema<Task>({
  name: { type: String, required: true },
  labels: { type: [String], required: true },
  images: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: true },
  ],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

TaskSchema.pre('findOneAndDelete', async function (next) {
  const task = await this.model.findOne(this.getQuery());

  if (task) {
    await AnnotationModel.deleteMany({ task: task._id });
  }

  next();
});

TaskSchema.pre(
  'deleteMany',
  { document: false, query: true },
  async function (next) {
    const tasks = await this.model.find(this.getFilter());

    for (const task of tasks) {
      await AnnotationModel.deleteMany({ task: task._id });
    }

    next();
  }
);

export const TaskModel = mongoose.model<Task>('Task', TaskSchema);

export const getUserTasks = (user: string) => TaskModel.find({ user });
export const getImageTasks = (image: string) =>
  TaskModel.find({ images: image });
export const getTaskById = (id: string) => TaskModel.findById(id);
export const createTask = (values: TaskProps) =>
  new TaskModel(values).save().then((task) => task.toObject());
export const deleteTaskById = (id: string) => TaskModel.findByIdAndDelete(id);
export const updateTaskById = (id: string, values: Partial<TaskProps>) =>
  TaskModel.findByIdAndUpdate(id, values, { new: true });
