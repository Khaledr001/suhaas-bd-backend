import { prisma } from "../config/db.config.js";
import type { Prisma, User } from "@prisma/client";

export const createUser = async (
  data: Prisma.UserCreateInput,
): Promise<User> => {
  return await prisma.user.create({
    data,
  });
};

export const getAllUsers = async (): Promise<User[]> => {
  return await prisma.user.findMany();
};

export const getUserById = async (id: string): Promise<User | null> => {
  return await prisma.user.findUnique({
    where: { id },
  });
};

export const updateUser = async (
  id: string,
  data: Prisma.UserUpdateInput,
): Promise<User> => {
  return await prisma.user.update({
    where: { id },
    data,
  });
};

export const deleteUser = async (id: string): Promise<User> => {
  return await prisma.user.delete({
    where: { id },
  });
};
