import { createServer } from 'http';
import app from './app';
import { ENV } from './lib/env';
import { connectDB } from './config/db';
import logger from './lib/logger';
import { SOC_INIT } from './socket';

const server = createServer(app);

SOC_INIT.INIT_SOCKET(server);

connectDB()
  .then(() => {
    server.listen(ENV.PORT, () =>
      logger.info(`Server running on port ${ENV.PORT}`)
    );
  })
  .catch((err) => {
    logger.error('Failed to start server:', err);
    process.exit(1);
  });
