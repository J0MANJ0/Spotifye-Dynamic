import { ENV } from 'lib/env';
import logger from 'lib/logger';
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.CONN_STR);

    logger.info(
      `CONNECTED WITH DATABASE spotifye_dynamic: HOST ${conn.connection.host}`
    );
  } catch (error: any) {
    logger.error(`Error connecting DATABASE: ${error?.message || error}`);
    process.exit(1);
  }
};
