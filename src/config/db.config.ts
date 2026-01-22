import { PrismaClient } from "@prisma/client";
import { env } from "./env.config.js";

/*
 * In development, we want to prevent multiple instances of Prisma Client from being instantiated
 * during hot-reloading. We attach it to the global object.
 */

const globalForPrisma = global as unknown as { prisma: PrismaClient };

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
