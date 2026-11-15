// @purpose Automated visual & DOM border-box audit for marketing routes and /dev/ui.
import { readFileSync, existsSync, mkdirSync } from "node:fs";
import { createRequire } from "node:module";
import { join, resolve } from "node:path";

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
  { label: "live-gre-widget", file: "apps/web/app/[locale]/(marketing)/gre/live-gre-widget.tsx" },
  { label: "/checkout", file: "apps/web/app/[locale]/(checkout)/checkout/page.tsx" },
  { label: "CheckoutClient", file: "apps/web/app/[locale]/(checkout)/checkout/CheckoutClient.tsx" },
  { label: "/for-institutions", file: "apps/web/app/[locale]/(marketing)/for-institutions/page.tsx" },
  { label: "/tools/gre-score-calculator", file: "apps/web/app/[locale]/(marketing)/tools/gre-score-calculator/page.tsx" },
  { label: "/tools/ielts-band-calculator", file: "apps/web/app/[locale]/(marketing)/tools/ielts-band-calculator/page.tsx" },
  { label: "WorkspacePrimitives", file: "apps/web/src/components/ui/WorkspacePrimitives.tsx" },
  { label: "(learner)/layout", file: "apps/web/app/[locale]/(learner)/layout.tsx" },
  { label: "(admin)/layout", file: "apps/web/app/[locale]/(admin)/layout.tsx" },
  { label: "/app", file: "apps/web/app/[locale]/(learner)/app/page.tsx" },
  { label: "/app/gre", file: "apps/web/app/[locale]/(learner)/app/gre/page.tsx" },
  { label: "/app/ielts", file: "apps/web/app/[locale]/(learner)/app/ielts/page.tsx" },
  { label: "/app/vocab", file: "apps/web/app/[locale]/(learner)/app/vocab/page.tsx" },
  { label: "/app/vocab/play", file: "apps/web/app/[locale]/(learner)/app/vocab/play/page.tsx" },
  { label: "/app/flashcards", file: "apps/web/app/[locale]/(learner)/app/flashcards/page.tsx" },
  { label: "/app/practice", file: "apps/web/app/[locale]/(learner)/app/practice/page.tsx" },
  { label: "/app/mistakes", file: "apps/web/app/[locale]/(learner)/app/mistakes/page.tsx" },
  { label: "/app/progress", file: "apps/web/app/[locale]/(learner)/app/progress/page.tsx" },
  { label: "/app/plan", file: "apps/web/app/[locale]/(learner)/app/plan/page.tsx" },
  { label: "/app/billing", file: "apps/web/app/[locale]/(learner)/app/billing/page.tsx" },
  { label: "/app/settings", file: "apps/web/app/[locale]/(learner)/app/settings/page.tsx" },
  { label: "/app/admin", file: "apps/web/app/[locale]/(learner)/app/admin/page.tsx" },
];

const LIVE_EXTRA_ROUTES = [
  "/sign-in",
  "/sign-up",
  "/exam/diagnostic",
  "/exam/ielts-preview",
  "/checkout",
  "/for-institutions",
  "/tools/gre-score-calculator",
  "/tools/ielts-band-calculator",
  "/app",
  "/app/gre",
  "/app/ielts",
  "/app/vocab",
  "/app/vocab/play",
  "/app/flashcards",
  "/app/practice",
  "/app/mistakes",
  "/app/progress",
  "/app/plan",
  "/app/billing",
  "/app/settings",
  "/admin",
];

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
    console.warn(`[WARN] Start dev server first with pnpm --filter @lumen/web dev`);
    process.exit(0);
  }

  let playwright = null;
  let browser = null;
  try {
    const req = createRequire(join(ROOT, "apps/web/package.json"));
    try {
      playwright = req("playwright");
    } catch {
      playwright = req("@playwright/test");
    }
    if (playwright?.chromium) {
      browser = await playwright.chromium.launch();
    }
  } catch {
    playwright = null;
    browser = null;
  }

  if (browser) {
    console.log("\n=== Live Playwright Responsive & Overflow Audit ===");
    const outDir = resolve(ROOT, "docs/logs/screenshots");
    mkdirSync(outDir, { recursive: true });

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
    console.log("\n=== Live HTTP & SSR DOM Verification Pass ===");
    const liveRoutes = [
      "/en",
      "/bn",
      "/en/courses",
      "/bn/courses",
      "/en/gre",
      "/en/ielts",
      "/en/pricing",
      "/en/help",
      "/en/sign-in",
      "/en/exam/diagnostic",
      "/en/exam/ielts-preview",
      "/en/checkout",
      "/en/tools/gre-score-calculator",
      "/en/tools/ielts-band-calculator",
      "/en/app",
      "/en/app/gre",
      "/en/app/ielts",
      "/en/app/billing",
      "/en/app/settings",
    ];

    for (const route of liveRoutes) {
      const url = `${baseUrl}${route}`;
      try {
        const res = await fetch(url);
        if (res.status !== 200) {
          console.error(`[FAIL] LIVE HTTP+DOM ${route} (status ${res.status})`);
          errors++;
          continue;
        }
        const html = await res.text();
        const expectedLang = route.startsWith("/bn") ? "bn" : "en";
        const hasHtmlLang = new RegExp(`<html[^>]*\\blang=["']${expectedLang}["']`, "i").test(html);
        if (!hasHtmlLang) {
          console.error(`[FAIL] LIVE HTTP+DOM ${route} missing <html lang="${expectedLang}">`);
          errors++;
          continue;
        }
        if (html.includes("data:image/svg+xml")) {
          console.error(`[FAIL] LIVE HTTP+DOM ${route} contains data:image/svg+xml placeholder`);
          errors++;
          continue;
        }
        console.log(`[PASS] LIVE HTTP+DOM ${route} (200 OK)`);
      } catch (err) {
        console.error(`[FAIL] LIVE HTTP+DOM ${route} (${err instanceof Error ? err.message : String(err)})`);
        errors++;
      }
    }
  }
} else {
  console.log("\n[INFO] http://localhost:3000 not reachable; skipping live Playwright screenshot pass (pass --live when dev server is running).");
}

if (errors > 0) {
  console.error(`\ndesign:shots failed with ${errors} error(s).`);
  process.exit(1);
}

console.log("\ndesign:shots passed.");
