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
}

const getEnvConfig = (): EnvConfig => {
  return {
    PORT: parseInt(process.env["PORT"] || "3000", 10),
    NODE_ENV: process.env["NODE_ENV"] || "development",
    DATABASE_URL: process.env["DATABASE_URL"] || "",
  };
};

export const env = getEnvConfig();
