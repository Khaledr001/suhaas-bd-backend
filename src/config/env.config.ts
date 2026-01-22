import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

interface EnvConfig {
  PORT: number;
  NODE_ENV: string;
  DATABASE_URL: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  JWT_EXPIRES_IN: string;
  JWT_REFRESH_EXPIRES_IN: string;
  INVITE_EXPIRES_HOURS: number;
}

const getEnvConfig = (): EnvConfig => {
  return {
    PORT: parseInt(process.env["PORT"] || "3000", 10),
    NODE_ENV: process.env["NODE_ENV"] || "development",
    DATABASE_URL: process.env["DATABASE_URL"] || "",
    JWT_SECRET:
      process.env["JWT_SECRET"] ||
      "your-super-secret-jwt-key-change-in-production",
    JWT_REFRESH_SECRET:
      process.env["JWT_REFRESH_SECRET"] ||
      "your-super-secret-refresh-key-change-in-production",
    JWT_EXPIRES_IN: process.env["JWT_EXPIRES_IN"] || "15m",
    JWT_REFRESH_EXPIRES_IN: process.env["JWT_REFRESH_EXPIRES_IN"] || "7d",
    INVITE_EXPIRES_HOURS: parseInt(
      process.env["INVITE_EXPIRES_HOURS"] || "48",
      10,
    ),
  };
};

export const env = getEnvConfig();
