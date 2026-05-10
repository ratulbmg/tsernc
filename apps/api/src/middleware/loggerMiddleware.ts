import { Request, Response, NextFunction } from "express";
import logger from "../config/logger.config";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Capture the start time so response duration can be measured later
  const start = Date.now();

  // Log request details as soon as the request enters the middleware
  logger.info(`Incoming ${req.method} request to ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    body: req.method !== "GET" ? req.body : undefined,
    query: req.query,
    params: req.params,
  });

  // Run this callback after the response has been fully sent
  res.on("finish", () => {
    // Calculate total time spent processing the request
    const duration = Date.now() - start;

    // Log response details after completion
    logger.info(`Outgoing ${req.method} response from ${req.originalUrl}`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get("Content-Length"),
    });
  });

  // Pass control to the next middleware/route handler
  next();
};

export const errorLogger = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.error("Error occurred:", {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get("User-Agent"),
    body: req.body,
    query: req.query,
    params: req.params,
  });

  next(err);
};
