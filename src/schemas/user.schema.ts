import { z } from "zod";

export const updateRoleSchema = z.object({
  role: z.enum(["ADMIN", "MANAGER", "STAFF"]),
});

export const updateStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val >= 1, "Page must be at least 1"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10))
    .refine((val) => val >= 1 && val <= 100, "Limit must be between 1 and 100"),
});

export const userIdParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val) && val > 0, "Invalid user ID"),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
export type UpdateStatusInput = z.infer<typeof updateStatusSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type UserIdParamInput = z.infer<typeof userIdParamSchema>;
