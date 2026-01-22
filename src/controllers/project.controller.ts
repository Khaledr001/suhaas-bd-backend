import type { Response, NextFunction } from "express";
import * as projectService from "../services/project.service.js";
import { sendSuccess } from "../utils/response.util.js";
import { logAction } from "../services/audit.service.js";
import type { AuthenticatedRequest } from "../types/auth.types.js";
import { NotFoundError } from "../utils/error.util.js";

/**
 * Create project controller
 */
export const createProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.userId;
    const project = await projectService.createProject(req.body, userId);
    sendSuccess(res, "Project created successfully", project, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * Get all projects (paginated)
 */
export const getAllProjects = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { page, limit, includeDeleted } = req.query as any;

    // Admins can see deleted projects if they want
    const isIncludeDeleted =
      req.user?.role === "ADMIN" &&
      (includeDeleted === "true" || includeDeleted === true);

    const result = isIncludeDeleted
      ? await projectService.getAllProjectsIncludeDeleted(page, limit)
      : await projectService.getAllProjects(page, limit);

    sendSuccess(res, "Projects retrieved successfully", result);
  } catch (error) {
    next(error);
  }
};

/**
 * Get project by ID
 */
export const getProjectById = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: projectId } = req.params as any;
    const project = await projectService.getProjectById(projectId);

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    sendSuccess(res, "Project retrieved successfully", project);
  } catch (error) {
    next(error);
  }
};

/**
 * Update project (Admin only)
 */
export const updateProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: projectId } = req.params as any;
    const project = await projectService.updateProject(projectId, req.body);

    if (req.user) {
      await logAction(req.user.userId, "UPDATE_PROJECT", { projectId });
    }

    sendSuccess(res, "Project updated successfully", project);
  } catch (error) {
    next(error);
  }
};

/**
 * Soft delete project (Admin only)
 */
export const deleteProject = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id: projectId } = req.params as any;
    await projectService.softDeleteProject(projectId);

    if (req.user) {
      await logAction(req.user.userId, "SOFT_DELETE_PROJECT", { projectId });
    }

    sendSuccess(res, "Project deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
