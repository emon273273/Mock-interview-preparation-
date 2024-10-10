import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../utils/schema";

let db;

const initializeDb = async () => {
  if (!db) {
    const databaseUrl = process.env.DATABASE_URL;
    
    if (!databaseUrl) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    try {
      const sql = neon(databaseUrl);
      db = drizzle(sql, { schema });
    } catch (error) {
      console.error('Failed to initialize database:', error);
      throw error;
    }
  }
  return db;
};

export { initializeDb };