import type { NextFunction, Request, Response } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { extractBearerToken, verifyAccessToken } from '../utils/token.js';
import { tokenService } from '../services/token.service.js';

// Token verify hone ke baad request pe jo identity attach hoti hai
export interface AuthUser {
  id: string;
  email: string;
  jti: string;
}

// Express ke Request type ko extend karte hain taaki req.user aage typed mile
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// Protected routes ka darwaan - Authorization: Bearer <token> chahiye, signature/expiry verify karo, revoked token (Redis denylist) reject karo, phir identity req.user pe daal do
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
