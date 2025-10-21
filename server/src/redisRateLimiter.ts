import type { NextFunction, Request, Response } from 'express';
import pkg from 'express';
import Redis from 'ioredis';
import { RateLimiterRedis } from 'rate-limiter-flexible';

const redisClient = new Redis({
  host: "localhost",
  port: 6379,
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
  points: 5,
  duration: 5,
  blockDuration: 0,
  execEvenly: true,
  keyPrefix: 'middleware',
})

export const rateLimiterMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await rateLimiterRedis.consume(req.ip!);
    next();
  } catch {
    res.status(429).send("Too many requests.")
  }
}