import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import apiRoutes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { ApiError } from './utils/apiError';

const app: Application = express();

// Security and utility middlewares
app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.isDevelopment) {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Mount API routes
app.use(env.API_PREFIX, apiRoutes);

// 404 handler
app.use((req: Request, _res: Response, next) => {
  next(ApiError.notFound(`Route '${req.originalUrl}' not found`));
});

// Global error handler
app.use(errorHandler);

export default app;
