import { createRequire } from "module";
import type { PrismaClient as PrismaClientType } from "@prisma/client";
const require = createRequire(import.meta.url);
const { PrismaClient } = require("@prisma/client");
import { env } from "./env.config.js"; // Note .js extension for ES modules/NodeNext compatibility usually, but let's stick to standard imports first, will fix if tsconfig complains. Actually TS config is nodenext.

/*
 * In development, we want to prevent multiple instances of Prisma Client from being instantiated
 * during hot-reloading. We attach it to the global object.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClientType };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export const connectDB = async () => {
  try {
    await prisma.$connect();
    console.log("✅ Database connected successfully");
  } catch (error) {
    console.error("❌ Database connection error:", error);
    process.exit(1);
  }
};
