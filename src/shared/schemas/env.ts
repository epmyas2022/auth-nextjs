import * as z from "zod";

export const envSchema = z.object({
  DB_FILE_NAME: z.string().min(1, "DB_FILE_NAME must be set"),
  SECRET_KEY: z.string().min(10, "SECRET_KEY must be set"),
  EXPIRED_SESSION: z.string().min(1, "EXPIRED_SESSION must be set"),
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  
  OAUTH_REDIRECT_URL_BASE: z.url(),

  OAUTH_GITHUB_CLIENT_ID: z.string().min(1, "OAUTH_GITHUB_CLIENT_ID must be set"),
  OAUTH_GITHUB_CLIENT_SECRET: z.string().min(1, "OAUTH_GITHUB_CLIENT_SECRET must be set"),

  OAUTH_GOOGLE_CLIENT_ID: z.string().min(1, "OAUTH_GOOGLE_CLIENT_ID must be set"),
  OAUTH_GOOGLE_CLIENT_SECRET: z.string().min(1, "OAUTH_GOOGLE_CLIENT_SECRET must be set"),
});
