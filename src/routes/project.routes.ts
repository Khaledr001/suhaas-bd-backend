import { Router } from "express";
import * as projectController from "../controllers/project.controller.js";
import { authenticate, authorize } from "../middlewares/auth.middleware.js";
import {
  validateBody,
  validateQuery,
  validateParams,
} from "../middlewares/validate.middleware.js";
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdParamSchema,
} from "../schemas/project.schema.js";
import { paginationSchema } from "../schemas/user.schema.js";

const router = Router();

/**
 * All routes in this file require authentication
 */
router.use(authenticate);

/**
 * @route POST /api/projects
 * @desc Create a new project
 * @access Authenticated
 */
router.post(
  "/",
  validateBody(createProjectSchema),
  projectController.createProject,
);

/**
 * @route GET /api/projects
 * @desc Get all projects
 * @access Authenticated
 */
router.get(
  "/",
  validateQuery(paginationSchema),
  projectController.getAllProjects,
);

/**
 * @route GET /api/projects/:id
 * @desc Get project by ID
 * @access Authenticated
 */
router.get(
  "/:id",
  validateParams(projectIdParamSchema),
  projectController.getProjectById,
);

/**
 * @route PATCH /api/projects/:id
 * @desc Update project (Admin only)
 * @access Admin only
 */
router.patch(
  "/:id",
  authorize("ADMIN"),
  validateParams(projectIdParamSchema),
  validateBody(updateProjectSchema),
  projectController.updateProject,
);

/**
 * @route DELETE /api/projects/:id
 * @desc Soft delete project (Admin only)
 * @access Admin only
 */
router.delete(
  "/:id",
  authorize("ADMIN"),
  validateParams(projectIdParamSchema),
  projectController.deleteProject,
);

export default router;
