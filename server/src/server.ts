import { createServer } from 'http';
import app from './app';
import { ENV } from './lib/env';
import { connectDB } from './config/db';
import { SOC_INIT } from './socket';

const server = createServer(app);

if (ENV.ENABLE_SOCKETS === 'true') {
  SOC_INIT.INIT_SOCKET(server);
}

connectDB()
  .then(() => {
    const { PORT } = ENV;
    server.listen(PORT, () => {
      console.log(`Socket running on ws://localhost:${PORT}/socket.io`);
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.log('Failed to start server/connect db:', err);
    process.exit(1);
  });
