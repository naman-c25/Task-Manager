import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  jti: string; // unique token id — enables revocation via the denylist
  exp?: number; // expiry (epoch seconds), set by jsonwebtoken
}

/** Sign a short-lived access token with a unique id so it can be revoked. */
export function signAccessToken(payload: Pick<JwtPayload, 'sub' | 'email'>): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    jwtid: randomUUID(),
  } as jwt.SignOptions);
}

/** Verify and decode an access token, throwing if invalid or expired. */
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

/** Extract a Bearer token from an Authorization header, if present. */
export function extractBearerToken(header?: string): string | null {
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}
