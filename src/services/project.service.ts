import { prisma } from "../config/db.config.js";
import type { Project, ProjectStatus } from "@prisma/client";
import type { PaginatedResponse } from "../types/api.types.js";
import { NotFoundError } from "../utils/error.util.js";

export interface CreateProjectData {
  name: string;
  description?: string;
}

export interface UpdateProjectData {
  name?: string;
  description?: string | null;
  status?: ProjectStatus;
}

/**
 * Create a new project
 */
export const createProject = async (
  data: CreateProjectData,
  createdBy: number,
): Promise<Project> => {
  return await (prisma as any).project.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      createdBy,
    },
  });
};

/**
 * Get all projects with pagination (excluding soft deleted)
 */
export const getAllProjects = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Project>> => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    (prisma as any).project.findMany({
      where: { isDeleted: false },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        createdByRelation: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    (prisma as any).project.count({ where: { isDeleted: false } }),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get a project by ID
 */
export const getProjectById = async (id: number): Promise<Project | null> => {
  const project = await (prisma as any).project.findFirst({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      createdByRelation: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  return project;
};

/**
 * Update a project (admin only)
 */
export const updateProject = async (
  id: number,
  data: UpdateProjectData,
): Promise<Project> => {
  const project = await (prisma as any).project.findFirst({
    where: { id, isDeleted: false },
  });

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return await (prisma as any).project.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      status: data.status,
    },
  });
};

/**
 * Soft delete a project (admin only)
 */
export const softDeleteProject = async (id: number): Promise<Project> => {
  const project = await (prisma as any).project.findFirst({
    where: { id, isDeleted: false },
  });

  if (!project) {
    throw new NotFoundError("Project not found");
  }

  return await (prisma as any).project.update({
    where: { id },
    data: {
      isDeleted: true,
      status: "DELETED",
    },
  });
};

/**
 * Get all projects including soft deleted (admin only)
 */
export const getAllProjectsIncludeDeleted = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<Project>> => {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    (prisma as any).project.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        createdByRelation: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    (prisma as any).project.count(),
  ]);

  return {
    items,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPrevPage: page > 1,
    },
  };
};
