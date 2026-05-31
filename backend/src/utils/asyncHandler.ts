import type { NextFunction, Request, Response, RequestHandler } from 'express';

/**
 * Wraps an async controller so rejected promises are forwarded to Express's
 * error middleware instead of crashing the process. Removes boilerplate
 * try/catch from every handler.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
