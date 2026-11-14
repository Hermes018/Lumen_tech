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

describe('Internal spec-code leak sweep (BUG-09)', () => {
  it('contains zero occurrences of "D12 C14", "docs/00", "compare_at", or "(D4)" in apps/web/app UI files', () => {
    const repoRoot = path.resolve(__dirname, '../../../..');
    const appDir = path.join(repoRoot, 'apps', 'web', 'app');
    const files = walkSourceFiles(appDir, ['.ts', '.tsx']);

    const forbiddenPatterns = [
      { pattern: /D12\s*C14/i, name: 'D12 C14' },
      { pattern: /docs\/00/i, name: 'docs/00' },
      { pattern: /compare_at/i, name: 'compare_at' },
      { pattern: /\(D4\)/i, name: '(D4)' },
    ];

    const violations: string[] = [];
    for (const file of files) {
      const rel = path.relative(repoRoot, file).replace(/\\/g, '/');
      if (rel.includes('__tests__') || rel.endsWith('.test.ts') || rel.endsWith('.test.tsx')) {
        continue;
      }
      const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
      lines.forEach((line, idx) => {
        for (const { pattern, name } of forbiddenPatterns) {
          if (pattern.test(line)) {
            violations.push(`${rel}:${idx + 1} leaked [${name}]: ${line.trim()}`);
          }
        }
      });
    }

    expect(violations).toEqual([]);
  });
});

describe('Competitor name sweep (P2.6.2)', () => {
  it('contains zero "Magoosh" or "GregMat" mentions in apps/web UI and message files', () => {
    const repoRoot = path.resolve(__dirname, '../../../..');
    const webDir = path.join(repoRoot, 'apps', 'web');
    const files = [
      ...walkSourceFiles(path.join(webDir, 'app'), ['.ts', '.tsx']),
      ...walkSourceFiles(path.join(webDir, 'src'), ['.ts', '.tsx']),
      ...walkSourceFiles(path.join(webDir, 'components'), ['.ts', '.tsx']),
      path.join(webDir, 'messages', 'en.json'),
      path.join(webDir, 'messages', 'bn.json'),
      ...walkSourceFiles(path.join(repoRoot, 'packages', 'ui', 'src'), ['.ts', '.tsx']),
    ];
    const hits: string[] = [];
    for (const file of files) {
      const rel = path.relative(repoRoot, file).replace(/\\/g, '/');
      if (rel.includes('__tests__') || /\.test\.tsx?$/.test(rel)) continue;
      fs.readFileSync(file, 'utf8')
        .split(/\r?\n/)
        .forEach((line, idx) => {
          if (/magoosh|gregmat/i.test(line.replace(/GRE_MAGOOSH_/g, ""))) hits.push(`${rel}:${idx + 1}`);
        });
    }
    expect(hits).toEqual([]);
  });
});
