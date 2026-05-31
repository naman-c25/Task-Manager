import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { extractBearerToken, verifyAccessToken } from '../utils/token.js';
import { tokenService } from '../services/token.service.js';

/** Identity attached to the request once a valid token is verified. */
export interface AuthUser {
  id: string;
  email: string;
  jti: string;
}

// Augment Express's Request type so `req.user` is fully typed downstream.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

/**
 * Gatekeeper for protected routes. Expects `Authorization: Bearer <token>`,
 * verifies the signature/expiry, rejects revoked tokens (Redis denylist), then
 * attaches the decoded identity to `req.user`.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    return next(ApiError.unauthorized('Authentication token is missing'));
  }

  try {
    const payload = verifyAccessToken(token);

    if (await tokenService.isRevoked(payload.jti)) {
      return next(ApiError.unauthorized('Session has been revoked. Please sign in again.'));
    }

    req.user = { id: payload.sub, email: payload.email, jti: payload.jti };
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired token'));
  }
}
