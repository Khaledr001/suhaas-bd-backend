import type { Response, NextFunction } from "express";
import type { Role } from "@prisma/client";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import { verifyAccessToken } from "../utils/jwt.util.js";
import { UnauthorizedError, ForbiddenError } from "../utils/error.util.js";
import { prisma } from "../config/db.config.js";

/**
 * Middleware to authenticate requests using JWT
 */
export const authenticate = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new UnauthorizedError("No token provided");
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new UnauthorizedError("No token provided");
    }

    const payload = verifyAccessToken(token);

    if (!payload) {
      throw new UnauthorizedError("Invalid or expired token");
    }

    // Fetch user from database to check current status
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, email: true, role: true, status: true },
    });

    if (!user) {
      throw new UnauthorizedError("User not found");
    }

    if (user.status === "INACTIVE") {
      throw new ForbiddenError("Account is deactivated");
    }

    // Attach user to request
    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to authorize requests based on roles
 */
export const authorize = (...allowedRoles: Role[]) => {
  return (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction,
  ): void => {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Not authenticated");
      }

      if (!allowedRoles.includes(req.user.role)) {
        throw new ForbiddenError("Insufficient permissions");
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
