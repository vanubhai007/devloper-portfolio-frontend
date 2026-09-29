import { env } from './config/env.js';
import { connectDB, disconnectDB } from './config/db.js';
import { app } from './app.js';
import { verifyMailer } from './utils/mailer.js';
import { logger } from './utils/logger.js';

async function start() {
  try {
    await connectDB(env.mongoUri);
  } catch {
    logger.error('Could not connect to MongoDB. Check MONGO_URI and Atlas network access. Exiting.');
    process.exit(1);
  }

  const server = app.listen(env.port, () => {
    logger.info(`API listening on port ${env.port} (${env.nodeEnv})`);
  });
  verifyMailer();

  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down gracefully`);
    server.close(async () => {
      await disconnectDB();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10000).unref();
  };
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection:', reason);
});
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception:', err);
  process.exit(1);
});

start();
