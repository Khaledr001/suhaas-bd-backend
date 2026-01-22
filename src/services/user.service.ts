import { prisma } from "../config/db.config.js";
import type { Prisma, User, Role, UserStatus } from "@prisma/client";
import type { PaginatedResponse } from "../types/api.types.js";
import { NotFoundError } from "../utils/error.util.js";

// Type for user without password
export type SafeUser = Omit<User, "password">;

/**
 * Create a new user (internal use only - users should be created via invite)
 */
export const createUser = async (
  data: Prisma.UserCreateInput,
): Promise<SafeUser> => {
  const user = await prisma.user.create({
    data,
  });
  const { password: _, ...safeUser } = user;
  return safeUser;
};

/**
 * Get all users with pagination (admin only)
 */
export const getAllUsers = async (
  page: number = 1,
  limit: number = 10,
): Promise<PaginatedResponse<SafeUser>> => {
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count(),
  ]);

  const items = users.map((user) => {
    const { password: _, ...safeUser } = user;
    return safeUser;
  });

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
 * Get a user by ID
 */
export const getUserById = async (id: number): Promise<SafeUser | null> => {
  const user = await prisma.user.findUnique({
    where: { id },
  });

  if (!user) {
    return null;
  }

  const { password: _, ...safeUser } = user;
  return safeUser;
};

/**
 * Get a user by email
 */
export const getUserByEmail = async (email: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

/**
 * Update a user
 */
export const updateUser = async (
  id: number,
  data: Prisma.UserUpdateInput,
): Promise<SafeUser> => {
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  const { password: _, ...safeUser } = user;
  return safeUser;
};

/**
 * Update user role (admin only)
 */
export const updateUserRole = async (
  id: number,
  role: Role,
): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { role },
  });

  const { password: _, ...safeUser } = updated;
  return safeUser;
};

/**
 * Update user status (admin only)
 */
export const updateUserStatus = async (
  id: number,
  status: UserStatus,
): Promise<SafeUser> => {
  const user = await prisma.user.findUnique({ where: { id } });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  const updated = await prisma.user.update({
    where: { id },
    data: { status },
  });

  const { password: _, ...safeUser } = updated;
  return safeUser;
};

/**
 * Delete a user
 */
export const deleteUser = async (id: number): Promise<SafeUser> => {
  const user = await prisma.user.delete({
    where: { id },
  });
  const { password: _, ...safeUser } = user;
  return safeUser;
};
