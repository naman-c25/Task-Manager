import type { NextFunction, Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

// Jo route match nahi hua uske liye 404 - error handler se pehle chalta hai
export function notFoundHandler(req: Request, _res: Response, next: NextFunction) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

// Central error handler. Known errors (ApiError, Prisma, JWT) ko standard failure shape me badalta hai aur production me internal details chhupa deta hai
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction) {
  let statusCode = 500;
  let message = 'Internal server error';
  let details: unknown;

  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    message = err.message;
    details = err.details;
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    // P2002 = unique constraint toot gaya (jaise duplicate email)
    if (err.code === 'P2002') {
      statusCode = 409;
      message = 'A record with that value already exists';
    } else {
      statusCode = 400;
      message = 'Database request error';
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  if (statusCode >= 500) {
    console.error('Unhandled error:', err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(details ? { errors: details } : {}),
    ...(env.isProduction ? {} : { stack: err instanceof Error ? err.stack : undefined }),
  });
}
