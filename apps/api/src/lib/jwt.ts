import jwt from "jsonwebtoken";
import { env } from "@repo/env";
import { apiError } from "../utils/apiError";
import logger from "../config/logger.config";

export interface JWTPayload {
  name: string;
  uniqueId: string;
}

export const createToken = async (
  data: JWTPayload,
  validity = "1h",
): Promise<string> => {
  const token = jwt.sign(data, env.API_JWT_SECRET, { expiresIn: validity });
  return token;
};

export const verifyToken = async (token: string): Promise<JWTPayload> => {
  try {
    // clean the token (removing the Bearer prefix)
    token = token.startsWith("Bearer ") ? token.slice(7) : token;
    const decoded = jwt.verify(token, env.API_JWT_SECRET) as JWTPayload;
    if (!decoded.uniqueId) {
      logger.warn("No authenticated user in token");
      throw new apiError("Authentication required", 401);
    }
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logger.warn("Token expired");
      throw new apiError("Token expired", 401);
    } else if (error instanceof jwt.JsonWebTokenError) {
      logger.warn("Invalid token");
      throw new apiError("Invalid token", 401);
    } else {
      logger.warn("Token verification failed");
      throw new apiError("Token verification failed", 401);
    }
  }
};
