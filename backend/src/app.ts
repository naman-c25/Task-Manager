import express, { type Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import apiRoutes from './routes/index.js';
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js';

// Express app banate aur configure karte hain. Server bootstrap se alag rakha hai taaki test me direct import ho sake
export function createApp(): Application {
  const app = express();

  // Pehle proxy hop (Render, Vercel) ko trust karo taaki secure cookie aur rate limit ko asli client IP mile
  app.set('trust proxy', 1);

  // Security aur parsing middleware
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

  // Halka sa health check - uptime monitor aur Render ke liye
  app.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok', uptime: process.uptime() });
  });

  // Versioned API
  app.use('/api/v1', apiRoutes);

  // 404 + central error handling (sabse last me register hona chahiye)
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
