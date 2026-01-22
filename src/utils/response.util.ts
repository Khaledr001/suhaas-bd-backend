import type { Request, Response, NextFunction } from "express";
import type { ApiResponse } from "../types/api.types.js";

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  data?: T,
  error?: any,
) => {
  const response: ApiResponse<T> = {
    success,
    message,
    data,
    error,
  };
  return res.status(statusCode).json(response);
};

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode: number = 200,
) => {
  return sendResponse(res, statusCode, true, message, data);
};

export const sendError = (
  res: Response,
  message: string,
  error?: any,
  statusCode: number = 500,
) => {
  return sendResponse(res, statusCode, false, message, undefined, error);
};
