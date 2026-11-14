// @purpose Automated visual & DOM border-box audit for marketing routes and /dev/ui.
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();

const MARKETING_ROUTES = [
  { route: "/", file: "apps/web/app/[locale]/(marketing)/page.tsx" },
  { route: "/courses", file: "apps/web/app/[locale]/(marketing)/courses/page.tsx" },
  { route: "/gre", file: "apps/web/app/[locale]/(marketing)/gre/page.tsx" },
  { route: "/ielts", file: "apps/web/app/[locale]/(marketing)/ielts/page.tsx" },
  { route: "/pricing", file: "apps/web/app/[locale]/(marketing)/pricing/page.tsx" },
  { route: "/help", file: "apps/web/app/[locale]/(marketing)/help/page.tsx" },
  { route: "/dev/ui", file: "apps/web/app/[locale]/(marketing)/dev/ui/page.tsx" },
];

const WORKBENCH_SURFACES = [
  { label: "BangladeshPaymentTrustBar", file: "apps/web/app/[locale]/(marketing)/_components/BangladeshPaymentTrustBar.tsx" },
  { label: "AuthForm", file: "apps/web/app/[locale]/(auth)/_components/AuthForm.tsx" },
  { label: "/exam/diagnostic", file: "apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx" },
  { label: "/exam/ielts-preview", file: "apps/web/app/[locale]/(exam)/exam/ielts-preview/page.tsx" },
];

const LIVE_EXTRA_ROUTES = ["/sign-in", "/sign-up", "/exam/diagnostic", "/exam/ielts-preview"];

const BOXED_PRIMITIVES = ["CalloutNotice", "CtaBand", "Button"];
const MAX_BOXED_INVOCATIONS = 6;

let errors = 0;

console.log("=== Static DOM & Primitive Budget Audit ===");
for (const { route, file } of MARKETING_ROUTES) {
  const fullPath = resolve(ROOT, file);
  if (!existsSync(fullPath)) {
    console.error(`[FAIL] ${route}: missing file ${file}`);
    errors++;
    continue;
  }

  const src = readFileSync(fullPath, "utf8");

  const classNameMatches = src.match(/\bclassName\s*=/g) ?? [];
  if (classNameMatches.length > 0) {
    console.error(`[FAIL] ${route}: found ${classNameMatches.length} className= attribute(s) in ${file}`);
    errors++;
  }

  const tableMatches = src.match(/<table[\s>]/g) ?? [];
  if (tableMatches.length > 0) {
    console.error(`[FAIL] ${route}: found ${tableMatches.length} raw <table> tag(s) in ${file}`);
    errors++;
  }

  let boxedCount = 0;
  for (const name of BOXED_PRIMITIVES) {
    const matches = src.match(new RegExp(`<${name}[\\s>/]`, "g")) ?? [];
    boxedCount += matches.length;
  }

  if (boxedCount > MAX_BOXED_INVOCATIONS) {
    console.error(
      `[FAIL] ${route}: ${boxedCount} boxed primitive invocations (${BOXED_PRIMITIVES.join(", ")}) exceeds max ${MAX_BOXED_INVOCATIONS}`,
    );
    errors++;
  } else {
    console.log(
      `[PASS] ${route.padEnd(10)} className=0  <table>=0  boxed=${boxedCount}/${MAX_BOXED_INVOCATIONS}`,
    );
  }
}

console.log("\n=== Static Auth, Diagnostic & Trust Bar Geometry Audit ===");
for (const { label, file } of WORKBENCH_SURFACES) {
  const fullPath = resolve(ROOT, file);
  if (!existsSync(fullPath)) {
    console.error(`[FAIL] ${label}: missing file ${file}`);
    errors++;
    continue;
  }
  const src = readFileSync(fullPath, "utf8");
  const roundedMatches = src.match(/\brounded-(?:full|2xl|3xl)\b/g) ?? [];
  if (roundedMatches.length > 0) {
    console.error(`[FAIL] ${label}: found ${roundedMatches.length} forbidden rounded-full/2xl/3xl class(es) in ${file}`);
    errors++;
  } else {
    console.log(`[PASS] ${label.padEnd(28)} rounded-full/2xl/3xl=0`);
  }
}

async function isServerReachable(url) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500);
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

const forceLive = process.argv.includes("--live");
const baseUrl = "http://localhost:3000";
const serverUp = await isServerReachable(baseUrl);

if (serverUp || forceLive) {
  if (!serverUp && forceLive) {
    console.error(`[FAIL] --live passed but ${baseUrl} is not reachable.`);
    process.exit(1);
  }

  console.log("\n=== Live Playwright Responsive & Overflow Audit ===");
  let playwright;
  try {
    playwright = await import("playwright");
  } catch {
    console.error("[FAIL] playwright package not available for live audit.");
    process.exit(1);
  }

  const outDir = resolve(ROOT, "docs/logs/screenshots");
  mkdirSync(outDir, { recursive: true });

  const browser = await playwright.chromium.launch();
  const viewports = [390, 768, 1440];
  const locales = [
    { code: "en", prefix: "" },
    { code: "bn", prefix: "/bn" },
  ];

  try {
    for (const locale of locales) {
      for (const width of viewports) {
        const context = await browser.newContext({ viewport: { width, height: 900 } });
        const page = await context.newPage();

        const allLiveRoutes = [...MARKETING_ROUTES.map((r) => r.route), ...LIVE_EXTRA_ROUTES];
        for (const route of allLiveRoutes) {
          const url = `${baseUrl}${locale.prefix}${route === "/" ? "" : route}` || `${baseUrl}/`;
          await page.goto(url, { waitUntil: "networkidle" });

          const overflow = await page.evaluate(() => ({
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          }));

          if (overflow.scrollWidth > overflow.innerWidth) {
            console.error(
              `[FAIL] ${locale.code} ${width}px ${route}: horizontal overflow (${overflow.scrollWidth} > ${overflow.innerWidth})`,
            );
            errors++;
          } else {
            const slug = route === "/" ? "home" : route.replaceAll("/", "_").replace(/^_/, "");
            const shotPath = resolve(outDir, `${locale.code}-${width}-${slug}.png`);
            await page.screenshot({ path: shotPath, fullPage: false });
            console.log(`[PASS] ${locale.code} ${width}px ${route.padEnd(10)} overflow=0`);
          }
        }
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
} else {
  console.log("\n[INFO] http://localhost:3000 not reachable; skipping live Playwright screenshot pass (pass --live when dev server is running).");
}

if (errors > 0) {
  console.error(`\ndesign:shots failed with ${errors} error(s).`);
  process.exit(1);
}

console.log("\ndesign:shots passed.");
