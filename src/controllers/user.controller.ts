import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";
import { sendSuccess } from "../utils/response.util.js";
import { logAction } from "../services/audit.service.js";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import { NotFoundError } from "../utils/error.util.js";

/**
 * Get all users (Admin only, paginated)
 */
export const getAllUsers = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit } = req.query as any;

    const result = await userService.getAllUsers(page, limit);
    sendSuccess(res, "Users retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID
 */
export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.params as any;
    const user = await userService.getUserById(userId);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    sendSuccess(res, "User retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user role (Admin only)
 */
export const updateUserRole = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.params as any;
    const { role } = req.body;

    const user = await userService.updateUserRole(userId, role);

    if (req.user) {
      await logAction(req.user.userId, "UPDATE_USER_ROLE", {
        targetUserId: userId,
        newRole: role,
      });
    }

    sendSuccess(res, "User role updated successfully", user);
  } catch (error) {
    next(error);
  }
};

/**
 * Update user status (Admin only)
 */
export const updateUserStatus = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.params as any;
    const { status } = req.body;

    const user = await userService.updateUserStatus(userId, status);

    if (req.user) {
      await logAction(req.user.userId, "UPDATE_USER_STATUS", {
        targetUserId: userId,
        newStatus: status,
      });
    }

    sendSuccess(res, "User status updated successfully", user);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete user (Admin only)
 */
export const deleteUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: userId } = req.params as any;
    await userService.deleteUser(userId);

    if (req.user) {
      await logAction(req.user.userId, "DELETE_USER", { targetUserId: userId });
    }

    sendSuccess(res, "User deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
