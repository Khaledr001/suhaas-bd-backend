import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";
import { AppError, ValidationError } from "../utils/error.util.js";
import { sendError } from "../utils/response.util.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("❌ Error:", err);

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors = err.issues.map((e: any) => ({
      field: e.path.join("."),
      message: e.message,
    }));
    return sendError(res, "Validation failed", errors, 422);
  }

  // Handle custom ValidationError
  if (err instanceof ValidationError) {
    return sendError(res, err.message, err.errors, err.statusCode);
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    return sendError(
      res,
      err.message,
      process.env["NODE_ENV"] === "development" ? err.stack : undefined,
      err.statusCode,
    );
  }

  // Handle Prisma errors
  if (err.code === "P2002") {
    return sendError(res, "A record with this value already exists", null, 409);
  }

  if (err.code === "P2025") {
    return sendError(res, "Record not found", null, 404);
  }

  // Handle unknown errors
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  sendError(
    res,
    message,
    process.env["NODE_ENV"] === "development" ? err : undefined,
    statusCode,
  );
};
