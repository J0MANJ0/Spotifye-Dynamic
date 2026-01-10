import app from './app';
import { ENV } from './lib/env';
import { connectDB } from './config/db';

async function startHttpServer() {
  try {
    await connectDB();

    const { PORT } = ENV;
    const server = app.listen(PORT, () => {
      console.log(`HTTP Server running on http://localhost:${PORT}`);
      console.log('WebSocket functionality is disabled (Vercel deployment)');
    });

    return server;
  } catch (err) {
    console.log('Failed to start HTTP server:', err);
    process.exit(1);
  }
}

// Export for Vercel
export default startHttpServer;
