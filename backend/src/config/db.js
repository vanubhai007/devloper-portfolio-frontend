import mongoose from 'mongoose';
import { logger } from '../utils/logger.js';

const MAX_RETRIES = 5;
const RETRY_DELAY_MS = 5000;

mongoose.set('strictQuery', true);

mongoose.connection.on('disconnected', () => logger.warn('MongoDB disconnected'));
mongoose.connection.on('reconnected', () => logger.info('MongoDB reconnected'));
mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err.message));

/** Connects to MongoDB, retrying a few times before giving up. */
export async function connectDB(uri) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
      logger.info(`MongoDB connected (${mongoose.connection.host}/${mongoose.connection.name})`);
      return;
    } catch (err) {
      logger.error(`MongoDB connection failed (attempt ${attempt}/${MAX_RETRIES}): ${err.message}`);
      if (attempt === MAX_RETRIES) throw err;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

export const isDbConnected = () => mongoose.connection.readyState === 1;

export const disconnectDB = () => mongoose.connection.close();
