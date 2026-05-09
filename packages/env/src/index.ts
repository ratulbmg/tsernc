import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { z } from "zod";

// Load root .env
const envPath = path.resolve(__dirname, "../../../.env");
if (!fs.existsSync(envPath)) {
  throw new Error(`⚠️ .env not found at ${envPath}`);
}
dotenv.config({ path: envPath });

// Validate & coerce
const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  API_JWT_SECRET: z.string().min(1),
  API_PORT: z.preprocess((v) => Number(v), z.number().int().positive()),
  API_NODE_ENV: z.enum(["development", "production"]).default("development"),
  API_DOC_VISIBLE: z.preprocess((v) => {
    if (typeof v === "string") {
      return ["true", "1", "yes"].includes(v.toLowerCase());
    }
    return Boolean(v);
  }, z.boolean()),
});

export const env = envSchema.parse(process.env);
export type Env = typeof env;