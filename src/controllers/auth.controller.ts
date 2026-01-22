import type { Request, Response, NextFunction } from "express";
import * as authService from "../services/auth.service.js";
import * as inviteService from "../services/invite.service.js";
import { sendSuccess } from "../utils/response.util.js";
import { logAction } from "../services/audit.service.js";
import type { AuthenticatedRequest } from "../types/auth.types.js";

/**
 * Login controller
 */
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    sendSuccess(res, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

/**
 * Invite user controller (Admin only)
 */
export const invite = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { email, role } = req.body;
    const invite = await inviteService.createInvite(email, role);

    // Log the action
    if (req.user) {
      await logAction(req.user.userId, "INVITE_USER", {
        invitedEmail: email,
        invitedRole: role,
      });
    }

    sendSuccess(res, "User invited successfully", invite, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Register via invite controller
 */
export const registerViaInvite = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { token, name, password } = req.body;
    const result = await authService.registerViaInvite(token, name, password);
    sendSuccess(res, "Registration successful", result, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Refresh token controller
 */
export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { refreshToken } = req.body;
    const result = await authService.refreshTokens(refreshToken);
    sendSuccess(res, "Token refreshed successfully", result);
  } catch (error) {
    next(error);
  }
};
