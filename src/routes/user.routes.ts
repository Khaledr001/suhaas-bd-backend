import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middlewares/validate.middleware.js";
import {
  updateRoleSchema,
  updateStatusSchema,
  paginationSchema,
  userIdParamSchema,
} from "../schemas/user.schema.js";

const router = Router();

/**
 * All routes in this file require authentication
 */
router.use(authenticate);

/**
 * @route GET /api/users
 * @desc Get all users (Admin only)
 */
router.get(
  "/",
  authorize("ADMIN"),
  validateQuery(paginationSchema),
  userController.getAllUsers,
);

/**
 * @route GET /api/users/:id
 * @desc Get user by ID
 */
router.get(
  "/:id",
  validateParams(userIdParamSchema),
  userController.getUserById,
);

/**
 * @route PATCH /api/users/:id/role
 * @desc Update user role (Admin only)
 */
router.patch(
  "/:id/role",
  authorize("ADMIN"),
  validateParams(userIdParamSchema),
  validateBody(updateRoleSchema),
  userController.updateUserRole,
);

/**
 * @route PATCH /api/users/:id/status
 * @desc Update user status (Admin only)
 */
router.patch(
  "/:id/status",
  authorize("ADMIN"),
  validateParams(userIdParamSchema),
  validateBody(updateStatusSchema),
  userController.updateUserStatus,
);

/**
 * @route DELETE /api/users/:id
 * @desc Delete user (Admin only)
 */
router.delete(
  "/:id",
  authorize("ADMIN"),
  validateParams(userIdParamSchema),
  userController.deleteUser,
);

export default router;
