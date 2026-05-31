import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

/**
 * Build and configure the Express application. Kept separate from server
 * bootstrap so it can be imported directly in integration tests.
 */
export function createApp(): Application {
  const app = express();

  // Trust the first proxy hop (Render, Vercel) so secure cookies and rate
  // limiting see the real client IP.
  app.set('trust proxy', 1);

  // Security & parsing middleware.
  app.use(helmet());
  app.use(
    cors({
      origin: env.allowedOrigins,
      credentials: true,
    }),
  );
  app.use(express.json({ limit: '10kb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  if (!env.isProduction) {
    app.use(morgan('dev'));
  }

  // Lightweight health check for uptime monitors and Render.
  app.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok', uptime: process.uptime() });
  });

  // Versioned API.
  app.use('/api/v1', apiRoutes);

  // 404 + centralized error handling (must be registered last).
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
