import mongoose from 'mongoose';
import { MongoClientOptions } from 'mongodb';

const clientOptions: MongoClientOptions = {
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
};

export const connectToDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI is not defined!');
    }

    await mongoose.connect(process.env.MONGO_URI, clientOptions);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
};
