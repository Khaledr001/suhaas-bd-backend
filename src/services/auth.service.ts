import { prisma } from "../config/db.config.js";
import { hashPassword, comparePassword } from "../utils/password.util.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt.util.js";
import { UnauthorizedError, ForbiddenError } from "../utils/error.util.js";
import * as inviteService from "./invite.service.js";
import type { LoginResponse, JwtPayload } from "../types/auth.types.js";

/**
 * Login a user
 */
export const login = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const user = await (prisma as any).user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new UnauthorizedError("Invalid email or password");
  }

  if (user.status === "INACTIVE") {
    throw new ForbiddenError("Account is deactivated");
  }

  const isPasswordValid = await comparePassword(password, user.password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid email or password");
  }

  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Register a new user via invite token
 */
export const registerViaInvite = async (
  token: string,
  name: string,
  password: string,
): Promise<LoginResponse> => {
  // Validate the invite
  const invite = await inviteService.validateInvite(token);

  // Hash the password
  const hashedPassword = await hashPassword(password);

  // Create the user
  const user = await (prisma as any).user.create({
    data: {
      name,
      email: invite.email,
      password: hashedPassword,
      role: invite.role,
      invitedAt: invite.createdAt,
    },
  });

  // Mark invite as used
  await inviteService.markInviteAsUsed(token);

  // Generate tokens
  const payload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

/**
 * Refresh access token using refresh token
 */
export const refreshTokens = async (refreshToken: string) => {
  const payload = verifyRefreshToken(refreshToken);

  if (!payload) {
    throw new UnauthorizedError("Invalid or expired refresh token");
  }

  // Verify user still exists and is active
  const user = await (prisma as any).user.findUnique({
    where: { id: payload.userId },
  });

  if (!user) {
    throw new UnauthorizedError("User not found");
  }

  if (user.status === "INACTIVE") {
    throw new ForbiddenError("Account is deactivated");
  }

  const newPayload: JwtPayload = {
    userId: user.id,
    email: user.email,
    role: user.role,
  };

  const accessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  return {
    accessToken,
    refreshToken: newRefreshToken,
  };
};
