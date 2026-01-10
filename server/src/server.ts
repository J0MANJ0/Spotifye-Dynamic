import { createServer } from 'http';
import app from './app';
import { ENV } from './lib/env';
import { connectDB } from './config/db';
import logger from './lib/logger';
import { SOC_INIT } from './socket';

// const server = createServer(app);

// if (ENV.ENABLE_SOCKETS === 'true') {
//   SOC_INIT.INIT_SOCKET(server);
// }

connectDB()
  .then(() => {
    const { PORT } = ENV;
    app.listen(PORT, () => {
      logger.info(`Socket running on ws://localhost:${PORT}/socket.io`);
      logger.info(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    logger.error('Failed to start server/connect db:', err);
    process.exit(1);
  });
