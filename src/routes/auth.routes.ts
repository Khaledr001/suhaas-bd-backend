import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import {
  loginSchema,
  inviteSchema,
  registerViaInviteSchema,
  refreshTokenSchema,
} from "../schemas/auth.schema.js";
import { authRateLimiter } from "../middlewares/rateLimit.middleware.js";

const router = Router();

/**
 * @route POST /api/auth/login
 * @desc Login user
 * @access Public
 */
router.post(
  "/login",
  authRateLimiter,
  validateBody(loginSchema),
  authController.login,
);

/**
 * @route POST /api/auth/invite
 * @desc Invite a new user
 * @access Admin only
 */
router.post(
  "/invite",
  authenticate,
  authorize("ADMIN"),
  validateBody(inviteSchema),
  authController.invite,
);

/**
 * @route POST /api/auth/register-via-invite
 * @desc Complete registration via invite token
 * @access Public
 */
router.post(
  "/register-via-invite",
  validateBody(registerViaInviteSchema),
  authController.registerViaInvite,
);

/**
 * @route POST /api/auth/refresh
 * @desc Refresh access token
 * @access Public
 */
router.post(
  "/refresh",
  validateBody(refreshTokenSchema),
  authController.refresh,
);

export default router;
