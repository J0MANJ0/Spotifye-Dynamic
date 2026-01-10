import { ENV } from '../lib/env';
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(ENV.CONN_STR);

    console.log(
      `CONNECTED WITH DATABASE spotifye_dynamic: HOST ${conn.connection.host}`
    );
  } catch (error: any) {
    console.log(`Error connecting DATABASE: ${error?.message || error}`);
    process.exit(1);
  }
};
