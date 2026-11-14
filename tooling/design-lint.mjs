/** @purpose Institutional UI design lint guard: protected i18n files, suppression ban, and primitive-only marketing page check */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const STRICT_PAGES = process.argv.includes('--strict-pages');

const PROTECTED_I18N_FILES = [
  'apps/web/app/[locale]/_components/LocaleSwitcher.tsx',
  'apps/web/app/[locale]/_components/LocaleLink.tsx',
  'apps/web/app/[locale]/_components/TranslatedText.tsx',
  'apps/web/app/api/translate/route.ts',
];

const STRICT_MARKETING_PAGES = [
  'apps/web/app/[locale]/(marketing)/page.tsx',
  'apps/web/app/[locale]/(marketing)/gre/page.tsx',
  'apps/web/app/[locale]/(marketing)/ielts/page.tsx',
  'apps/web/app/[locale]/(marketing)/courses/page.tsx',
  'apps/web/app/[locale]/(marketing)/pricing/page.tsx',
  'apps/web/app/[locale]/(marketing)/help/page.tsx',
];

const errors = [];

function walkFiles(dir, exts) {
  if (!fs.existsSync(dir)) return [];
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...walkFiles(full, exts));
    } else if (exts.some((ext) => entry.name.endsWith(ext))) {
      results.push(full);
    }
  }
  return results;
}

// 1. Protected i18n Diff Guard
try {
  const statusOut = execSync('git status --porcelain', { cwd: ROOT, encoding: 'utf8' });
  const diffOut = execSync('git diff --name-only HEAD', { cwd: ROOT, encoding: 'utf8' });
  const changed = new Set([
    ...statusOut
      .split('\n')
      .map((line) => line.slice(3).trim())
      .filter(Boolean),
    ...diffOut
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
  ]);

  for (const protectedPath of PROTECTED_I18N_FILES) {
    if (changed.has(protectedPath)) {
      errors.push(`[i18n-guard] Protected file modified: ${protectedPath}`);
    }
  }
} catch (err) {
  errors.push(`[i18n-guard] Failed to run git diff check: ${err.message}`);
}

// 2. Suppression Ban in apps/web/src
const srcDir = path.join(ROOT, 'apps/web/src');
const srcFiles = walkFiles(srcDir, ['.ts', '.tsx', '.js', '.jsx']);
const SUPPRESSION_PATTERNS = [
  { name: '@ts-ignore', regex: /@ts-ignore/ },
  { name: '@ts-nocheck', regex: /@ts-nocheck/ },
  { name: 'eslint-disable', regex: /eslint-disable/ },
  { name: ': any', regex: /:\s*any\b/ },
];

for (const file of srcFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const rel = path.relative(ROOT, file);
  for (const pat of SUPPRESSION_PATTERNS) {
    if (pat.regex.test(content)) {
      errors.push(`[suppression-ban] Forbidden "${pat.name}" found in ${rel}`);
    }
  }
}

// 3. Primitive-Only Page Guard
const marketingDir = path.join(ROOT, 'apps/web/app/[locale]/(marketing)');
const pageFiles = walkFiles(marketingDir, ['page.tsx']);
const FORBIDDEN_PAGE_PATTERNS = [
  { name: 'className=', regex: /className=/ },
  { name: 'style=', regex: /style=/ },
  { name: '<table', regex: /<table\b/ },
  { name: 'hex color literal', regex: /#[0-9a-fA-F]{3,8}\b/ },
  { name: 'rounded-xl', regex: /\brounded-xl\b/ },
  { name: 'rounded-2xl', regex: /\brounded-2xl\b/ },
  { name: 'rounded-3xl', regex: /\brounded-3xl\b/ },
  { name: 'shadow-', regex: /\bshadow-/ },
];

let checkedPages = 0;
for (const file of pageFiles) {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/');
  const content = fs.readFileSync(file, 'utf8');
  const usesPrimitives = content.includes('@/src/components/ui/primitives');
  const isStrictTarget = STRICT_PAGES && STRICT_MARKETING_PAGES.includes(rel);

  if (!usesPrimitives && !isStrictTarget) continue;

  checkedPages += 1;
  if (isStrictTarget && !usesPrimitives) {
    errors.push(`[primitive-guard] Strict marketing page must import @/src/components/ui/primitives: ${rel}`);
  }
  for (const pat of FORBIDDEN_PAGE_PATTERNS) {
    if (pat.regex.test(content)) {
      errors.push(`[primitive-guard] Forbidden "${pat.name}" in ${rel}`);
    }
  }
}

if (errors.length > 0) {
  console.error(`design:lint FAILED (${errors.length} error(s)):`);
  for (const e of errors) {
    console.error(`  - ${e}`);
  }
  process.exit(1);
}

console.log(
  `design:lint PASSED (i18n guard: ${PROTECTED_I18N_FILES.length} files clean; suppression scan: ${srcFiles.length} files clean; primitive-only pages checked: ${checkedPages}${STRICT_PAGES ? ' [strict-pages]' : ''})`,
);
