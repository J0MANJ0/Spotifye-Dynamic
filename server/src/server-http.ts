import app from './app';
import { ENV } from './lib/env';
import { connectDB } from './config/db';
import logger from './lib/logger';

async function startHttpServer() {
  try {
    await connectDB();

    const { PORT } = ENV;
    const server = app.listen(PORT, () => {
      logger.info(`HTTP Server running on http://localhost:${PORT}`);
      logger.warn('WebSocket functionality is disabled (Vercel deployment)');
    });

    return server;
  } catch (err) {
    logger.error('Failed to start HTTP server:', err);
    process.exit(1);
  }
}

// Export for Vercel
export default startHttpServer;
