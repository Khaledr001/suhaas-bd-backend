import { prisma } from "../config/db.config.js";
import type { Prisma } from "@prisma/client";

/**
 * Log an admin action
 */
export const logAction = async (
  userId: number,
  action: string,
  details?: Record<string, any>,
): Promise<void> => {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        details: details as Prisma.JsonObject,
      },
    });
  } catch (error) {
    // Log error but don't throw - audit logging should not break the main flow
    console.error("Failed to create audit log:", error);
  }
};

/**
 * Get audit logs with pagination
 */
export const getAuditLogs = async (
  page: number = 1,
  limit: number = 10,
  userId?: number,
) => {
  const skip = (page - 1) * limit;

  const where = userId ? { userId } : {};

  const [items, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.auditLog.count({ where }),
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
