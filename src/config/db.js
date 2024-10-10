import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../utils/schema"

     const sql =  await neon(process.env.DATABASE_URL);
     export const db = drizzle(sql,{schema});

