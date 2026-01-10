import app from '../app';
import { ENV } from '../lib/env';
import { connectDB } from '../config/db';

// Initialize database connection
let dbConnected = false;

async function ensureDbConnection() {
  if (!dbConnected) {
    try {
      await connectDB();
      dbConnected = true;
      console.log('Database connected for Vercel serverless function');
    } catch (error) {
      console.log('Database connection failed:', error);
      throw error;
    }
  }
}

// Vercel serverless function handler
export default async function handler(req: any, res: any) {
  // Ensure DB connection for each request (Vercel reuses instances)
  await ensureDbConnection();

  // Handle the request with Express app
  return app(req, res);
}

// For local testing
if (require.main === module) {
  const { PORT } = ENV;
  app.listen(PORT, () => {
    console.log(`Vercel API handler running on http://localhost:${PORT}`);
  });
}
