import type { NextFunction, Request, Response } from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis({
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  retryStrategy(times) {
      const delay = Math.min(times * 200, 2000);
      return delay;
  },
  enableOfflineQueue: false 
});

redisClient.on('connect', () => {
  console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const rateLimiterRedis = new RateLimiterRedis({
  storeClient: redisClient,
  points: 50,
  duration: 10,
  blockDuration: 0,
  execEvenly: false,
  keyPrefix: 'middleware_v2',
});

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/upload-pdf') {
      return next();
  }

  try {
    await rateLimiterRedis.consume(req.ip!);
    next();
  } catch {
    res.status(429).send("Too many requests.");
  }
};