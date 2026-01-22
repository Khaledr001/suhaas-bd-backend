import { z } from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be at most 100 characters"),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters")
    .optional(),
});

export const updateProjectSchema = z.object({
  name: z
    .string()
    .min(1, "Project name is required")
    .max(100, "Project name must be at most 100 characters")
    .optional(),
  description: z
    .string()
    .max(255, "Description must be at most 255 characters")
    .optional()
    .nullable(),
  status: z.enum(["ACTIVE", "ARCHIVED", "DELETED"]).optional(),
});

export const projectIdParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, "Invalid project ID"),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type ProjectIdParamInput = z.infer<typeof projectIdParamSchema>;
