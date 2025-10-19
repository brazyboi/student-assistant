import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import dotenv from 'dotenv';
import { getUserIdFromToken } from '../helpers';
import crypto from 'crypto';

dotenv.config();

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
const redis = new Redis(redisUrl);

const RATE_LIMIT_CAPACITY = parseInt(process.env.RATE_LIMIT_CAPACITY || '60', 10);
const RATE_LIMIT_WINDOW_MS = parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10);


function hashToken(token: string) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function getKey(req: Request) {
  const auth = req.headers.authorization || '';
  if (auth) {
    try {
      // Try to resolve user id from token
      const userId = await getUserIdFromToken(auth);
      if (userId) return `rl:user:${userId}`;
    } catch (e) {
      // Fallback to hashed token if token is invalid or user not found
      const token = auth.replace(/^Bearer\s+/i, '');
      return `rl:token:${hashToken(token)}`;
    }
  }
  const ip = req.ip || req.socket.remoteAddress || 'unknown';
  return `rl:ip:${ip}`;
}

export default async function redisRateLimiter(req: Request, res: Response, next: NextFunction) {
  try {
    const key = await getKey(req);
    // Increment the counter for this key
    const windowSec = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);

    const count = await redis.incr(key);
    if (count === 1) {
      // first request in window, set expiration
      await redis.expire(key, windowSec);
    }

    if (count > RATE_LIMIT_CAPACITY) {
      const ttl = await redis.ttl(key);
      res.setHeader('Retry-After', String(ttl > 0 ? ttl : windowSec));
      res.status(429).json({ error: 'Too Many Requests' });
      return;
    }

    next();
  } catch (err) {
    console.error('Redis rate limiter error:', err);
    // If Redis fails, allow the request (fail open) but log the error
    next();
  }
}
