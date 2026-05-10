import { env } from "@repo/env";
import app from "./app";
import logger from "./config/logger.config";

app.listen(env.API_PORT, () => {
  logger.info(
    `Server started successfully => http://localhost:${env.API_PORT}/`,
    {
      port: env.API_PORT,
      environment: env.API_NODE_ENV,
      url: `http://localhost:${env.API_PORT}`,
    },
  );
});

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", {
    error: error.message,
    stack: error.stack,
  });
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection:", { reason, promise });
  process.exit(1);
});
