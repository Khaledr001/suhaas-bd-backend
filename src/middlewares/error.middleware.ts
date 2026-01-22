import type { Request, Response, NextFunction } from "express";
import { sendError } from "../utils/response.util.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error("❌ Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  sendError(
    res,
    message,
    process.env["NODE_ENV"] === "development" ? err : undefined,
    statusCode,
  );
};
