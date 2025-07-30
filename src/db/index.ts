import 'dotenv/config';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { Environment } from '@/shared/enviroment';
import * as schema from "./schema"

const client = createClient({ url: Environment.DB_FILE_NAME });
const db = drizzle({ client, schema });

export default db;