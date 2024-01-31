import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from '@/db/schema';

import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

declare module globalThis {
  let postgresSqlClient: ReturnType<typeof postgres> | undefined;
}

// Connect only once to the database
// https://github.com/vercel/next.js/discussions/26427#discussioncomment-898067
function createPostgresConnection() {
  if (!globalThis.postgresSqlClient) {
    const connectionString = process.env.DB_URL!;
    globalThis.postgresSqlClient = postgres(connectionString);
  }
  return globalThis.postgresSqlClient;
}

const client = createPostgresConnection();

const combinedSchema = { ...schema };

export const db = drizzle(client, { schema: combinedSchema, logger: true });
