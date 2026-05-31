import type { NextFunction, Request, Response, RequestHandler } from 'express';

// Async controller ko wrap karta hai, taaki reject hui promise Express ke error middleware tak pohonch jaye aur process crash na ho
// Matlab har handler me try/catch likhne ka jhanjhat khatam
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
