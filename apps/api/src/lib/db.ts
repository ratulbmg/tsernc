// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { prisma as dbPrisma, PrismaClient, Prisma } from "@repo/db/client";
import logger from "../config/logger.config";

/**
 * globalForPrisma
 * - Typed wrapper over `globalThis` to hold a development-only cached Prisma client.
 * - Keeps a single Prisma client instance during hot-reloads to avoid exhausting DB connections.
 */
type GlobalPrisma = typeof globalThis & { prisma?: PrismaClient };
const globalForPrisma = globalThis as GlobalPrisma;

/**
 * setupPrismaLogging
 * - Attaches typed Prisma event listeners for runtime query/log visibility.
 * - Requires the Prisma client to be created with `log: [{ emit: "event", level: "query" }, ...]`
 *   so `$on(...)` event names are available to TypeScript.
 *
 * Events:
 * - "query" : Prisma.QueryEvent  — details about the SQL and duration.
 * - "error" : Prisma.LogEvent    — runtime errors from Prisma.
 * - "info"  : Prisma.LogEvent    — informational messages.
 * - "warn"  : Prisma.LogEvent    — warnings.
 */
function setupPrismaLogging(client: PrismaClient): void {
  // Narrow client to include the specific `$on` overloads we need.
  const eventClient = client as PrismaClient & {
    $on(event: "query", callback: (e: Prisma.QueryEvent) => void): void;
    $on(event: "error", callback: (e: Prisma.LogEvent) => void): void;
    $on(event: "info", callback: (e: Prisma.LogEvent) => void): void;
    $on(event: "warn", callback: (e: Prisma.LogEvent) => void): void;
  };

  // Log SQL queries with params and duration (helpful for debugging & perf)
  eventClient.$on("query", (e: Prisma.QueryEvent) => {
    logger.debug("Database query:", {
      query: e.query,
      params: e.params,
      duration: `${e.duration}ms`,
    });
  });

  // Log Prisma runtime errors
  eventClient.$on("error", (e: Prisma.LogEvent) => {
    logger.error("Database error:", {
      error: e.message,
      target: e.target,
    });
  });

  // General info messages from Prisma
  eventClient.$on("info", (e: Prisma.LogEvent) => {
    logger.info("Database info:", {
      message: e.message,
    });
  });

  // Warnings from Prisma
  eventClient.$on("warn", (e: Prisma.LogEvent) => {
    logger.warn("Database warning:", {
      message: e.message,
    });
  });
}

/**
 * prisma
 * - Use the DB package's exported Prisma instance (`dbPrisma`) by default.
 * - In development, cache the instance on `globalThis` to preserve a single client
 *   across module reloads (prevents "too many connections" during dev).
 *
 * Note: Ensure the Prisma client in the DB package is created with `log: [...]`
 * if you expect `setupPrismaLogging` to receive events.
 */
const prisma: PrismaClient = globalForPrisma.prisma ?? dbPrisma;

// Attach event logging (no-op if client lacks event logging config)
setupPrismaLogging(prisma);

// Cache Prisma client in development to avoid multiple instances on HMR / nodemon restarts
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
