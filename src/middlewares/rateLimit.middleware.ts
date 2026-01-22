import rateLimit from "express-rate-limit";
import { TooManyRequestsError } from "../utils/error.util.js";

/**
 * Rate limiter for authentication endpoints
 * More restrictive: 10 requests per 15 minutes
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(
      new TooManyRequestsError(
        "Too many authentication attempts, please try again later",
      ),
    );
  },
});

/**
 * General API rate limiter
 * Less restrictive: 100 requests per 15 minutes
 */
export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next) => {
    next(new TooManyRequestsError("Too many requests, please try again later"));
  },
});
