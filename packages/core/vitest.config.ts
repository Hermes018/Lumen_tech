/** @purpose Vitest configuration for domain logic with 8GB RAM caps */
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    pool: 'forks',
    maxWorkers: 2,
    fileParallelism: false,
  },
});
