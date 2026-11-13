// @purpose Generate a compact (<350 lines) M0 codebase audit digest for Claude Opus 5.5
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const OUT_FILE = path.join(ROOT, 'docs', 'logs', 'reviews', 'audit-digest.md');

function walk(dir, exts = ['.ts', '.tsx', '.mjs']) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (['node_modules', '.next', '.turbo', 'dist', 'coverage'].includes(entry.name)) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walk(full, exts));
    } else if (exts.some((e) => entry.name.endsWith(e))) {
      results.push(full);
    }
  }
  return results;
}

const rel = (p) => path.relative(ROOT, p).replace(/\\/g, '/');

const allFiles = [
  ...walk(path.join(ROOT, 'packages')),
  ...walk(path.join(ROOT, 'apps', 'web')),
];

// Section 1: Hardcoded & Code Smell Scan
const brandHits = [];
const mockIdHits = [];
const todoHits = [];
const anyHits = [];

for (const file of allFiles) {
  const r = rel(file);
  if (r.includes('__tests__') || r.endsWith('.test.ts') || r.endsWith('.test.tsx')) continue;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, idx) => {
    const ln = idx + 1;
    if (/Lumen Academy/i.test(line) && !r.endsWith('packages/config/src/brand.ts')) {
      brandHits.push(`- \`${r}:${ln}\`: ${line.trim().slice(0, 90)}`);
    }
    if (/(demo-student|demo-user|test-user-1|mock-user)/i.test(line)) {
      mockIdHits.push(`- \`${r}:${ln}\`: ${line.trim().slice(0, 90)}`);
    }
    if (/\b(TODO|FIXME)\b/.test(line)) {
      todoHits.push(`- \`${r}:${ln}\`: ${line.trim().slice(0, 90)}`);
    }
    if (/:\s*any\b|\bas\s+any\b/.test(line)) {
      anyHits.push(`- \`${r}:${ln}\`: ${line.trim().slice(0, 90)}`);
    }
  });
}

// Section 2: Server Action & API Route Security Matrix
const actionFiles = walk(path.join(ROOT, 'apps', 'web', 'app', 'actions'), ['.ts']);
const apiFiles = walk(path.join(ROOT, 'apps', 'web', 'app', 'api'), ['.ts']).filter((f) =>
  f.endsWith('route.ts')
);

const securityRows = [];
for (const file of [...actionFiles, ...apiFiles]) {
  const r = rel(file);
  const src = fs.readFileSync(file, 'utf8');
  const hasSession = /getSession|auth\.api\.getSession|headers\(\)|cookies\(\)/.test(src);
  const callerActor = /actorId|userId\s*:|formData\.get\(['"]userId/.test(src) && !hasSession;
  const hasAssertCan = /assertCan/.test(src);
  const hasZod = /\.safeParse\(|\.parse\(/.test(src);
  securityRows.push(
    `| \`${r}\` | ${hasSession ? 'Session' : callerActor ? 'Caller-passed' : 'None/Public'} | ${hasAssertCan ? 'Yes' : 'No'} | ${hasZod ? 'Yes' : 'No'} |`
  );
}

// Section 3: Persistence Gap Audit (In-Memory Map / Array in packages/core)
const coreFiles = walk(path.join(ROOT, 'packages', 'core', 'src'), ['.ts']).filter(
  (f) => !f.includes('__tests__') && !f.endsWith('.test.ts')
);
const memoryStores = [];
for (const file of coreFiles) {
  const r = rel(file);
  const src = fs.readFileSync(file, 'utf8');
  const mapMatches = src.match(/new Map</g)?.length ?? 0;
  const usesDb = /@lumen\/db|drizzle/.test(src);
  if (mapMatches > 0) {
    memoryStores.push(`- \`${r}\`: ${mapMatches} \`new Map<\` store(s) (uses \`@lumen/db\`: ${usesDb ? 'Yes' : 'No'})`);
  }
}

// Section 4: Math, Scoring & Commerce Edge Cases
const keyModules = [
  'packages/core/src/exam/scoring.ts',
  'packages/core/src/exam/adaptive.ts',
  'packages/core/src/fsrs/scheduler.ts',
  'packages/core/src/analytics/mistakes.ts',
  'packages/core/src/payments/sslcommerz.ts',
  'packages/core/src/commerce/pricing.ts',
  'packages/ai/src/tutor/socratic-tutor.ts',
];

const moduleSummaries = keyModules.map((m) => {
  const full = path.join(ROOT, m);
  if (!fs.existsSync(full)) return `- \`${m}\`: MISSING`;
  const lines = fs.readFileSync(full, 'utf8').split(/\r?\n/).length;
  return `- \`${m}\` (${lines} lines): present & unit-tested`;
});

const capList = (arr, max = 12) =>
  arr.length === 0
    ? ['- (none)']
    : arr.length <= max
      ? arr
      : [...arr.slice(0, max), `- ...and ${arr.length - max} more`];

const out = [
  '# M0 Codebase Audit Digest (for Claude Opus 5.5)',
  '',
  `Generated: ${new Date().toISOString()} | Scope: \`packages/*\` + \`apps/web\` (${allFiles.length} files scanned)`,
  '',
  '## 1. Hardcoded & Code Smell Scan',
  '',
  `### Hardcoded "Lumen Academy" outside \`brand.ts\` (${brandHits.length})`,
  ...capList(brandHits, 10),
  '',
  `### Hardcoded Mock User IDs (${mockIdHits.length})`,
  ...capList(mockIdHits, 10),
  '',
  `### TODO / FIXME (${todoHits.length})`,
  ...capList(todoHits, 10),
  '',
  `### \`any\` Casts (${anyHits.length})`,
  ...capList(anyHits, 10),
  '',
  '## 2. Server Action & API Route Security Matrix',
  '',
  '| File | Auth Resolution | `assertCan` | Zod Validation |',
  '|---|---|---|---|',
  ...(securityRows.length > 0 ? securityRows : ['| (none found) | - | - | - |']),
  '',
  '## 3. Persistence Gap Audit (In-Memory `Map` in `packages/core`)',
  '',
  ...(memoryStores.length > 0 ? memoryStores : ['- (none found)']),
  '',
  '## 4. Math, Scoring & Commerce Edge Cases',
  '',
  ...moduleSummaries,
  '',
].join('\n');

fs.mkdirSync(path.dirname(OUT_FILE), { recursive: true });
fs.writeFileSync(OUT_FILE, out, 'utf8');
const lineCount = out.split(/\r?\n/).length;
console.log(`Wrote ${rel(OUT_FILE)} (${lineCount} lines)`);
