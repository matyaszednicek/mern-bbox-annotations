import mongoose, { Document } from 'mongoose';
import { ImageModel } from './images.model';

export type UserProps = {
  username: string;
  email: string;
  authentication: {
    password: string;
    salt: string;
    sessionToken?: string;
  };
};
export type User = Document<mongoose.Types.ObjectId> & UserProps;

const UserSchema = new mongoose.Schema<User>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false },
    sessionToken: { type: String, select: false },
  },
});

UserSchema.pre('findOneAndDelete', async function (next) {
  const user = await this.model.findOne(this.getFilter());

  if (user) {
    await ImageModel.deleteMany({ user: user._id });
  }

  next();
});

export const UserModel = mongoose.model<User>('User', UserSchema);

export const getUsers = () => UserModel.find();
export const getUserById = (id: string) => UserModel.findById(id);
export const getUserByEmail = (email: string) => UserModel.findOne({ email });
export const getUserBySessionToken = (sessionToken: string) =>
  UserModel.findOne({ 'authentication.sessionToken': sessionToken });

export const createUser = (values: Record<string, unknown>) =>
  new UserModel(values).save().then((user) => user.toObject());

export const deleteUserById = (id: string) => UserModel.findByIdAndDelete(id);

export const updateUserById = (id: string, values: Record<string, unknown>) =>
  UserModel.findByIdAndUpdate(id, values, { new: true });
