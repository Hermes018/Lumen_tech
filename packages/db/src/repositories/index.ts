/**
 * @purpose Dual-Mode Repository Entrypoint (P1-33)
 * Enforces production fail-fast when DATABASE_URL is missing,
 * provides deterministic memory repositories in test mode,
 * and wires Neon Drizzle repositories when DATABASE_URL is present.
 */

import { getDb, type DbClient } from '../client';
import type { Repositories } from './types';
import { createMemoryRepositories } from './memory';
import { createDrizzleRepositories } from './drizzle';

export * from './types';
export * from './memory';
export * from './drizzle';

export interface RepositoryOptions {
  db?: DbClient;
  forceMemory?: boolean;
}

let _activeRepositories: Repositories | null = null;

/**
 * Creates repositories according to environment and available configuration:
 * 1. If forceMemory is true OR (NODE_ENV === 'test' and no DATABASE_URL) -> in-memory repositories.
 * 2. If NODE_ENV === 'production' and !DATABASE_URL -> throws fatal configuration error.
 * 3. If DATABASE_URL is available -> Drizzle Neon repositories.
 * 4. Default fallback in dev/test -> in-memory repositories.
 */
export function createRepositories(options: RepositoryOptions = {}): Repositories {
  if (options.forceMemory) {
    return createMemoryRepositories();
  }

  const databaseUrl = process.env.DATABASE_URL;
  const isProduction = process.env.NODE_ENV === 'production';
  const isTest = process.env.NODE_ENV === 'test';

  if (isProduction && !databaseUrl) {
    throw new Error(
      'FATAL: DATABASE_URL is missing in production environment. Refusing to boot with in-memory stores.'
    );
  }

  if (databaseUrl) {
    const dbClient = options.db || getDb(databaseUrl);
    return createDrizzleRepositories(dbClient);
  }

  if (isTest || !isProduction) {
    return createMemoryRepositories();
  }

  throw new Error('FATAL: Unable to initialize repositories.');
}

/**
 * Returns the current singleton repository instance, creating one if not yet initialized.
 */
export function getRepositories(): Repositories {
  if (!_activeRepositories) {
    _activeRepositories = createRepositories();
  }
  return _activeRepositories;
}

/**
 * Sets or overrides the current repository instance (used for test isolation or dependency injection).
 */
export function setRepositories(repos: Repositories | null): void {
  _activeRepositories = repos;
}

/**
 * Resets the repositories back to null so the next getRepositories() creates fresh state.
 */
export function resetRepositories(): void {
  _activeRepositories = null;
}
