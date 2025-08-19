import rateLimit from 'express-rate-limit';
import { ApiError } from '../utils/ApiError';
import config from '../config';
import redisClient from '../config/redis';

// Basic rate limiter
export const basicRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    throw ApiError.tooManyRequests('Too many requests, please try again later');
  },
});

// Strict rate limiter for auth endpoints
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  skipSuccessfulRequests: true,
  handler: (req, res) => {
    throw ApiError.tooManyRequests('Too many failed attempts, please try again later');
  },
});

// API rate limiter with Redis store for distributed systems
export const apiRateLimiter = rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.max,
  standardHeaders: true,
  legacyHeaders: false,
  store: {
    incr: async (key: string) => {
      const current = await redisClient.incr(key);
      await redisClient.expire(key, Math.round(config.rateLimit.windowMs / 1000));
      return current;
    },
    decrement: async (key: string) => {
      const current = await redisClient.decr(key);
      return Math.max(0, current);
    },
    resetKey: async (key: string) => {
      await redisClient.del(key);
    },
  },
  handler: (req, res) => {
    throw ApiError.tooManyRequests('API rate limit exceeded');
  },
});