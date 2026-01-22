import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import { env } from "../config/env.config.js";
import type { JwtPayload } from "../types/auth.types.js";

/**
 * Generate an access token
 */
export const generateAccessToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as any,
  });
};

/**
 * Generate a refresh token
 */
export const generateRefreshToken = (payload: JwtPayload): string => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN as any,
  });
};

/**
 * Verify an access token
 */
export const verifyAccessToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, env.JWT_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Verify a refresh token
 */
export const verifyRefreshToken = (token: string): JwtPayload | null => {
  try {
    return jwt.verify(token, env.JWT_REFRESH_SECRET) as JwtPayload;
  } catch {
    return null;
  }
};

/**
 * Generate a unique invite token
 */
export const generateInviteToken = (): string => {
  return uuidv4();
};

/**
 * Calculate invite expiration date
 */
export const getInviteExpirationDate = (): Date => {
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + env.INVITE_EXPIRES_HOURS);
  return expiresAt;
};
