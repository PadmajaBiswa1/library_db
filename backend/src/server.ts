import app from './app';
import { env } from './config/env';
import { logger } from './utils/logger';

const server = app.listen(env.PORT, () => {
  logger.info(`🚀 Library Management Backend running in [${env.NODE_ENV}] mode on port ${env.PORT}`);
  logger.info(`📡 API endpoint: http://localhost:${env.PORT}${env.API_PREFIX}`);
  logger.info(`🩺 Health check: http://localhost:${env.PORT}/health`);
});

// Graceful shutdown handling
const handleShutdown = (signal: string) => {
  logger.info(`Received ${signal}. Shutting down HTTP server gracefully...`);
  server.close(() => {
    logger.info('HTTP server closed cleanly. Process exiting.');
    process.exit(0);
  });

  // Force shutdown after timeout if pending connections hang
  setTimeout(() => {
    logger.error('Forced shutdown due to timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

process.on('unhandledRejection', (reason: Error) => {
  logger.error('Unhandled Promise Rejection:', reason.message || reason);
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception thrown:', error.message, error.stack);
  process.exit(1);
});
