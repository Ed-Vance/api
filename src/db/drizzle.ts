// src/db/drizzle.ts
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Ensure you set this in your .env file
});

export const db = drizzle(pool, { schema });
