import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema';

export type DbClient = ReturnType<typeof drizzle<typeof schema>>;

let _db: DbClient | null = null;

/**
 * Returns a configured Drizzle ORM client using Neon serverless HTTP driver.
 * Uses lazy initialization so unit tests and offline builds succeed without DATABASE_URL.
 */
export function getDb(url?: string): DbClient {
  const connectionString = url || process.env.DATABASE_URL;
  if (!connectionString) {
    const sql = neon('postgresql://mock:mock@localhost:5432/lumen_dev');
    return drizzle(sql, { schema });
  }
  if (!_db) {
    const sql = neon(connectionString);
    _db = drizzle(sql, { schema });
  }
  return _db;
}

export const db: DbClient = new Proxy({} as DbClient, {
  get(_target, prop) {
    const instance = getDb();
    return Reflect.get(instance, prop);
  },
});
