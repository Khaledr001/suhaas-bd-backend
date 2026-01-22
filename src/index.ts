import express from "express";
import cors from "cors";
import { env } from "./config/env.config.js";
import { connectDB, prisma } from "./config/db.config.js";
import routes from "./routes/index.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { requestLogger } from "./middlewares/logger.middleware.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

// Database Connection
connectDB();

// Routes
app.get("/", (req, res) => {
  res.send("Welcome to Suhaas BD Backend API");
});

app.use("/api", routes);

// Error Handling
app.use(errorHandler);

// Start Server
const server = app.listen(env.PORT, () => {
  console.log(`🚀 Server is running on port ${env.PORT}`);
  console.log(`📝 Environment: ${env.NODE_ENV}`);
});

// Graceful Shutdown
process.on("SIGTERM", async () => {
  console.log("SIGTERM signal received: closing HTTP server");
  await prisma.$disconnect();
  server.close(() => {
    console.log("HTTP server closed");
  });
});
