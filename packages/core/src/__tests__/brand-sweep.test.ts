/** @purpose Regression guard asserting zero hardcoded "Lumen Academy" strings exist outside packages/config/src/brand.ts */
import fs from 'node:fs';
import path from 'node:path';
import { describe, it, expect } from 'vitest';

function walkSourceFiles(dir: string, exts = ['.ts', '.tsx', '.mjs']): string[] {
  const results: string[] = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.turbo', 'dist', 'coverage'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkSourceFiles(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

describe('Brand sweep guard (D0 / brand.ts)', () => {
  it('contains zero hardcoded "Lumen Academy" occurrences outside packages/config/src/brand.ts', () => {
    const repoRoot = path.resolve(__dirname, '../../../..');
    const files = [
      ...walkSourceFiles(path.join(repoRoot, 'packages')),
      ...walkSourceFiles(path.join(repoRoot, 'apps', 'web')),
    ];

    const hits: string[] = [];
    for (const file of files) {
      const rel = path.relative(repoRoot, file).replace(/\\/g, '/');
      if (rel.includes('__tests__') || rel.endsWith('.test.ts') || rel.endsWith('.test.tsx')) {
        continue;
      }
      if (rel.endsWith('packages/config/src/brand.ts')) {
        continue;
      }
      const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, idx) => {
        if (/Lumen Academy/i.test(line)) {
          hits.push(`${rel}:${idx + 1}: ${line.trim()}`);
        }
      });
    }

    expect(hits).toEqual([]);
  });
});
