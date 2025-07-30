import * as z from "zod";

export const envSchema = z.object({
  DB_FILE_NAME: z.string().min(1, "DB_FILE_NAME must be set"),
  SECRET_KEY: z.string().min(10, "SECRET_KEY must be set"),
  EXPIRED_SESSION: z.string().min(1, "EXPIRED_SESSION must be set"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});