import mongoose from 'mongoose';
import { env } from './env.js';

export const connectDB = async () => {
  await mongoose.connect(env.mongo, { dbName: 'memoire' });
  console.log('✓ Mongo connected');
};

