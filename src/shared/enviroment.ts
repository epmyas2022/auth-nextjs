import * as z from "zod";
import { envSchema } from "./schemas/env";



export type Env = z.infer<typeof envSchema>;

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  throw new Error("Invalid environment variables: " + error.message);
}

export const Environment = data as Env;
