import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { Environment } from '@/shared/enviroment';
export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema.ts',
  dialect: 'sqlite',
  dbCredentials: {
    url: Environment.DB_FILE_NAME,
  },
});