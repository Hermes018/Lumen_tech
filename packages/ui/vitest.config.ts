/** @purpose Vitest configuration for UI primitives with 8GB RAM caps */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    pool: 'forks',
    maxWorkers: 2,
    fileParallelism: false,
  },
});
