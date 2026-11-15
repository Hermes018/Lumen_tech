/** @purpose Institutional UI design lint guard: protected i18n files, suppression ban, and primitive-only marketing page check */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const STRICT_PAGES = !process.argv.includes('--no-strict-pages');

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

// 4. Institutional Surface Geometry & Truthfulness Guard (Trust Bar, Auth, Diagnostic, Simulator, Checkout, Tools, Learner)
const SURFACE_GEOMETRY_FILES = [
  'apps/web/app/[locale]/(marketing)/_components/BangladeshPaymentTrustBar.tsx',
  'apps/web/app/[locale]/(auth)/_components/AuthForm.tsx',
  'apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx',
  'apps/web/app/[locale]/(exam)/exam/ielts-preview/page.tsx',
  'apps/web/app/[locale]/(marketing)/gre/live-gre-widget.tsx',
  'apps/web/app/[locale]/(checkout)/checkout/page.tsx',
  'apps/web/app/[locale]/(checkout)/checkout/CheckoutClient.tsx',
  'apps/web/app/[locale]/(marketing)/for-institutions/page.tsx',
  'apps/web/app/[locale]/(marketing)/tools/gre-score-calculator/page.tsx',
  'apps/web/app/[locale]/(marketing)/tools/ielts-band-calculator/page.tsx',
  'apps/web/app/[locale]/(learner)/layout.tsx',
  'apps/web/app/[locale]/(learner)/app/page.tsx',
  'apps/web/app/[locale]/(learner)/app/vocab/page.tsx',
  'apps/web/app/[locale]/(learner)/app/vocab/play/page.tsx',
  'apps/web/app/[locale]/(learner)/app/flashcards/page.tsx',
  'apps/web/app/[locale]/(learner)/app/practice/page.tsx',
  'apps/web/app/[locale]/(learner)/app/mistakes/page.tsx',
  'apps/web/app/[locale]/(learner)/app/progress/page.tsx',
  'apps/web/app/[locale]/(learner)/app/plan/page.tsx',
  'apps/web/app/[locale]/(learner)/app/settings/page.tsx',
  'apps/web/app/[locale]/(learner)/app/admin/page.tsx',
];
const FORBIDDEN_ROUNDED_PATTERNS = [
  { name: 'rounded-full', regex: /\brounded-full\b/ },
  { name: 'rounded-2xl', regex: /\brounded-2xl\b/ },
  { name: 'rounded-3xl', regex: /\brounded-3xl\b/ },
];

for (const rel of SURFACE_GEOMETRY_FILES) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    errors.push(`[surface-guard] Missing target file: ${rel}`);
    continue;
  }
  const content = fs.readFileSync(full, 'utf8');
  for (const pat of FORBIDDEN_ROUNDED_PATTERNS) {
    if (pat.regex.test(content)) {
      errors.push(`[surface-guard] Forbidden "${pat.name}" in ${rel}`);
    }
  }
}

const authFormRel = 'apps/web/app/[locale]/(auth)/_components/AuthForm.tsx';
const authFormPath = path.join(ROOT, authFormRel);
if (fs.existsSync(authFormPath)) {
  const authContent = fs.readFileSync(authFormPath, 'utf8');
  const FORBIDDEN_AUTH_STRINGS = ['Farhan T.', '+11.4'];
  for (const needle of FORBIDDEN_AUTH_STRINGS) {
    if (authContent.includes(needle)) {
      errors.push(`[truth-guard] Forbidden unverified string "${needle}" in ${authFormRel}`);
    }
  }
}

// 5. Internal Route & Link Integrity Guard ([link-guard])
const localeAppDir = path.join(ROOT, 'apps/web/app/[locale]');
const routePageFiles = walkFiles(localeAppDir, ['page.tsx']);
const validStaticRoutes = new Set();
const validDynamicMatchers = [];

for (const pageFile of routePageFiles) {
  const relDir = path.relative(localeAppDir, path.dirname(pageFile)).replace(/\\/g, '/');
  const segments = relDir
    .split('/')
    .filter((seg) => seg && seg !== '.' && !/^\(.*\)$/.test(seg));
  const routePattern = '/' + segments.join('/');
  if (segments.some((seg) => /^\[.*\]$/.test(seg))) {
    const regexStr =
      '^/' +
      segments
        .map((seg) => {
          if (/^\[\.\.\..*\]$/.test(seg)) return '.+';
          if (/^\[.*\]$/.test(seg)) return '[^/]+';
          return seg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        })
        .join('/') +
      '$';
    validDynamicMatchers.push(new RegExp(regexStr));
  } else {
    validStaticRoutes.add(routePattern === '/' ? '/' : routePattern.replace(/\/+$/, ''));
  }
}

function routeExists(candidate) {
  if (validStaticRoutes.has(candidate)) return true;
  return validDynamicMatchers.some((re) => re.test(candidate));
}

const LINK_GUARD_FILES = [
  'apps/web/src/content/nav.ts',
  'apps/web/src/content/marketing.ts',
  'apps/web/src/components/ui/HeaderFooter.tsx',
  'apps/web/src/components/ui/primitives.tsx',
];
const HREF_LITERAL_REGEX = /(?:\b(?:href|ctaHref|linkHref|secondaryLinkHref)\s*[:=]\s*)(['"])(\/[^'"]*)\1/g;
const verifiedRoutes = new Set();
let checkedHrefOccurrences = 0;

for (const rel of LINK_GUARD_FILES) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    errors.push(`[link-guard] Missing target file: ${rel}`);
    continue;
  }
  const content = fs.readFileSync(full, 'utf8');
  for (const match of content.matchAll(HREF_LITERAL_REGEX)) {
    const rawHref = match[2];
    if (!rawHref) continue;
    checkedHrefOccurrences += 1;
    const stripped = rawHref.split('#')[0].split('?')[0].replace(/\/+$/, '') || '/';
    if (!routeExists(stripped)) {
      errors.push(`[link-guard] Broken internal href "${rawHref}" (resolved route "${stripped}") in ${rel}`);
    } else {
      verifiedRoutes.add(stripped);
    }
  }
}

// 6. Local Self-Hosted Media Asset Guard
const MEDIA_FILE = path.join(ROOT, 'apps/web/src/content/media.ts');
const mediaContent = fs.readFileSync(MEDIA_FILE, 'utf8');
let checkedAssets = 0;
if (/https?:\/\//i.test(mediaContent)) {
  errors.push('[asset-guard] External http(s) URL found in apps/web/src/content/media.ts; all media slots must be local /images/<slot>.webp');
}
for (const match of mediaContent.matchAll(/src:\s*'([^']+)'/g)) {
  const srcPath = match[1];
  checkedAssets += 1;
  if (!/^\/images\/[a-z0-9-]+\.webp$/.test(srcPath)) {
    errors.push(`[asset-guard] Invalid media src "${srcPath}" in apps/web/src/content/media.ts (expected /images/<slot>.webp)`);
    continue;
  }
  const diskPath = path.join(ROOT, 'apps/web/public', srcPath);
  if (!fs.existsSync(diskPath)) {
    errors.push(`[asset-guard] Missing local WebP asset on disk: apps/web/public${srcPath}`);
  }
}

// 7. Claude Editorial Workspace Guard ([workspace-guard] — expanded across P27 -> P30)
const WORKSPACE_GUARD_FILES = [
  'apps/web/src/components/ui/WorkspacePrimitives.tsx',
  'apps/web/app/[locale]/(learner)/layout.tsx',
];
const WORKSPACE_FORBIDDEN_PATTERNS = [
  { name: 'rounded-full', regex: /\brounded-full\b/ },
  { name: 'rounded-2xl', regex: /\brounded-2xl\b/ },
  { name: 'rounded-3xl', regex: /\brounded-3xl\b/ },
  { name: 'rounded-xl', regex: /\brounded-xl\b/ },
  { name: 'bg-blue-', regex: /\bbg-blue-/ },
  { name: 'text-blue-', regex: /\btext-blue-/ },
  { name: 'border-blue-', regex: /\bborder-blue-/ },
  { name: 'bg-emerald-', regex: /\bbg-emerald-/ },
  { name: 'text-emerald-', regex: /\btext-emerald-/ },
  { name: 'bg-yellow-', regex: /\bbg-yellow-/ },
  { name: 'border-yellow-', regex: /\bborder-yellow-/ },
  { name: 'Analytical Strategist', regex: /Analytical Strategist/ },
  { name: 'Apprentice Scholar', regex: /Apprentice Scholar/ },
  { name: 'Rank Progression Roadmap', regex: /Rank Progression Roadmap/ },
  { name: 'total XP earned', regex: /total XP earned/i },
];

for (const rel of WORKSPACE_GUARD_FILES) {
  const full = path.join(ROOT, rel);
  if (!fs.existsSync(full)) {
    errors.push(`[workspace-guard] Missing target file: ${rel}`);
    continue;
  }
  const content = fs.readFileSync(full, 'utf8');
  for (const pat of WORKSPACE_FORBIDDEN_PATTERNS) {
    if (pat.regex.test(content)) {
      errors.push(`[workspace-guard] Forbidden "${pat.name}" in ${rel}`);
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
  `design:lint PASSED (i18n guard: ${PROTECTED_I18N_FILES.length} files clean; suppression scan: ${srcFiles.length} files clean; primitive-only pages checked: ${checkedPages}${STRICT_PAGES ? ' [strict-pages]' : ''}; surface-guard: ${SURFACE_GEOMETRY_FILES.length} files clean; link-guard: ${checkedHrefOccurrences} hrefs -> ${verifiedRoutes.size} routes verified; asset-guard: ${checkedAssets} local WebP assets verified; workspace-guard: ${WORKSPACE_GUARD_FILES.length} files clean)`,
);
