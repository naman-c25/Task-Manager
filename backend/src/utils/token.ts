import { randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export interface JwtPayload {
  sub: string; // user id
  email: string;
  jti: string; // har token ka unique id - isi se logout pe revoke karte hain
  exp?: number; // expiry (epoch seconds), jsonwebtoken khud set karta hai
}

// Short-lived access token sign karte hain, unique jti ke saath taaki baad me revoke ho sake
export function signAccessToken(payload: Pick<JwtPayload, 'sub' | 'email'>): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
    jwtid: randomUUID(),
  } as jwt.SignOptions);
}

// Token verify aur decode karta hai, invalid ya expired hone par throw kar dega
export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
}

// Authorization header se Bearer token nikalta hai, agar hai toh
export function extractBearerToken(header?: string): string | null {
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length).trim() || null;
}
