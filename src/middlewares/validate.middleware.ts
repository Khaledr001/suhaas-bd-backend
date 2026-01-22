import { z, type ZodSchema } from "zod";
import type { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/error.util.js";

/**
 * Validate request body against a Zod schema
 */
export const validateBody = <T extends ZodSchema>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await schema.safeParseAsync(req.body);

      if (!result.success) {
        const errors = result.error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new ValidationError("Validation failed", errors);
      }

      req.body = result.data;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate request query parameters against a Zod schema
 */
export const validateQuery = <T extends ZodSchema>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await schema.safeParseAsync(req.query);

      if (!result.success) {
        const errors = result.error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new ValidationError("Validation failed", errors);
      }

      req.query = result.data as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Validate request URL parameters against a Zod schema
 */
export const validateParams = <T extends ZodSchema>(schema: T) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const result = await schema.safeParseAsync(req.params);

      if (!result.success) {
        const errors = result.error.issues.map((err: any) => ({
          field: err.path.join("."),
          message: err.message,
        }));
        throw new ValidationError("Validation failed", errors);
      }

      req.params = result.data as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};
