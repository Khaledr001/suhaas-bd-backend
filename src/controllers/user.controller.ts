import type { Request, Response, NextFunction } from "express";
import * as userService from "../services/user.service.js";
import { sendSuccess, sendError } from "../utils/response.util.js";

export const createUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await userService.createUser(req.body);
    sendSuccess(res, "User created successfully", user, 201);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const users = await userService.getAllUsers();
    sendSuccess(res, "Users retrieved successfully", users);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params["id"];
    if (typeof userId !== "string") {
      return sendError(res, "Invalid user ID", null, 400);
    }
    const user = await userService.getUserById(userId);
    if (!user) {
      return sendError(res, "User not found", null, 404);
    }
    sendSuccess(res, "User retrieved successfully", user);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params["id"];
    if (typeof userId !== "string") {
      return sendError(res, "Invalid user ID", null, 400);
    }
    const user = await userService.updateUser(userId, req.body);
    sendSuccess(res, "User updated successfully", user);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.params["id"];
    if (typeof userId !== "string") {
      return sendError(res, "Invalid user ID", null, 400);
    }
    await userService.deleteUser(userId);
    sendSuccess(res, "User deleted successfully", null);
  } catch (error) {
    next(error);
  }
};
