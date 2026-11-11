# 33 — i18n and Bangla Localisation Workflow

> Resolves GA-034 (25-GAP-AUDIT) and is the proposed doc 33. Conforms to `00-DECISIONS.md`: D2 (locale `as-needed`: English at root, Bangla under `/bn`), D3 (next-intl, locales `en` and `bn`, Noto Sans Bengali / Hind Siliguri), D9 (Haiku drafts strings, humans review), D12 (nothing else overrides). Typography numbers come from `08-UI-UX-DESIGN-SYSTEM.md` §2.2.2; number/date policy from `03-PRODUCT-SPEC.md` L-05.
> Marker `verify` = check against current library docs before relying on it. Marker `[Bangla editor]` = a linguistic decision that a native Bangla editor must confirm; I am proposing, not deciding. Machine-written Bangla is **draft only** (22 §model routing).

**Contents**

1. Principles and scope
2. next-intl setup (`as-needed`)
3. Message files: structure and namespaces
4. Key naming rules
5. ICU messages: plurals, select, rich text (Bangla rules)
6. Formatting: numbers, digits, currency, dates, lists
7. Fonts, line-height, mixed-script rules
8. Translation workflow (en master to published bn)
9. Glossary and style guide (tone, আপনি vs তুমি)
10. Locked and untranslatable strings
11. Content localisation (lessons, video, exams, AI feedback, email, SMS, legal)
12. SEO: hreflang and slug policy
13. QA checklist
14. CI checks
15. Tooling options and recommendation
16. Backlog (NEW-I18N-xx) and open decisions

---

## 1. Principles and scope

1. **English is the master.** `en` strings are written first by a human or a Haiku agent; `bn` is derived and reviewed. Keys exist in both locales always; `bn` values may be `needs_review` but never missing (a missing key fails CI).
2. **Bangladesh-first does not mean Bangla-only.** The product teaches English tests. Exam content (passages, questions, audio, answer options) stays English with `lang="en"` (07 §2109); only the surrounding UI, help, and explanations are bilingual.
3. **Trust over speed.** Machine-translated Bangla UI undermines the Bangladesh-first brand (GA-034). A native Bangla editor approves every string a user sees before production; there is no "ship unreviewed Bangla" path for public pages, payments, legal, or exam screens.
4. **Exam parity.** Latin digits by default, official English exam terms preserved (L-05, 08).
5. **No string is ever built by concatenation, and no brand name is typed into a message** (use `{brand}` from `packages/config/brand.ts`).
6. RTL is **not needed** (Bangla is left-to-right); do not add `dir` handling beyond `dir="ltr"` on `<html>`.
7. Scope: `en` and `bn` only. Adding a locale (e.g., Hindi, Urdu, Nepali) later means: add to `routing.locales`, a new `messages/<locale>/`, a new glossary column, a font check, and this doc's section 13 re-run.

---

## 2. next-intl setup (`as-needed`)

Library: `next-intl` (current major 4.x at time of writing; verify against https://next-intl.dev/docs before installing; the card for P0-29 must pin the exact version, no new dependency without approval). Next.js 16 renames `middleware.ts` to `proxy.ts` (04 §10); the next-intl routing handler is mounted in `proxy.ts` and **only handles locale routing**, never authorization (D7).

### 2.1 File layout (`apps/web`)

```
apps/web/
  i18n/
    routing.ts          # defineRouting: locales, defaultLocale, localePrefix
    request.ts          # getRequestConfig: loads and merges namespace files, formats
    navigation.ts       # createNavigation: Link, redirect, usePathname, useRouter
    formats.ts          # shared number/date formats (section 6)
  messages/
    en/ common.json  nav.json  marketing.json  auth.json  checkout.json
        learner.json  exam.json  studio.json  grader.json  staff.json
        org.json  admin.json  errors.json  emails.json  notifications.json
    bn/ (same file names)
  proxy.ts              # next-intl handler + CSP nonce (D7); no auth logic
  app/[locale]/layout.tsx
```
(04 §6 draws `messages/{en.json, bn.json}` as two files; split-by-namespace is the better shape for 12 route groups and for parallel agents with disjoint `touch` lists, so this doc supersedes that tree line. Record in the 04 change log, NEW-I18N-01.)

### 2.2 `routing.ts`

```ts
// apps/web/i18n/routing.ts
import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'bn'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',   // D2: en at '/', bn at '/bn'
  localeDetection: false,      // proposal NEW-I18N-02: no automatic redirect by Accept-Language/cookie
  alternateLinks: true,        // emits Link headers; we also render <link rel="alternate" hreflang> ourselves (section 12)
  // pathnames: not used (slugs stay identical across locales, section 12.3)
});
export type AppLocale = (typeof routing.locales)[number];
```
Why `localeDetection: false`: with `as-needed`, detection can redirect an English-URL visitor to `/bn` based on browser headers, which breaks shared links, caches and crawler consistency. Instead: show a **non-blocking, dismissible banner** ("এই পাতাটি বাংলায় দেখুন" / "View in English") when `navigator.language` starts with `bn`, and store the explicit choice in `user_profile.locale` (05 §633) and a `NEXT_LOCALE` cookie only after the user clicks the language switcher. Verify the option name in the installed next-intl version.

### 2.3 `proxy.ts`

```ts
// apps/web/proxy.ts (excerpt; CSP nonce and auth-free by design)
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18n = createMiddleware(routing);

export default function proxy(request: NextRequest) {
  // 1. build CSP nonce (D7)  2. delegate locale routing
  return handleI18n(request);
}

export const config = {
  // skip API, webhooks, Inngest, Next internals, files
  matcher: ['/((?!api|trpc|_next|_vercel|monitoring|.*\\..*).*)'],
};
```
Rules: `/api/*` (including `/api/auth/callback/google`, webhooks, `/api/inngest`) never gets a locale prefix (D2 table, row "—"). Verify the exported function name for Next 16 (`proxy` vs default export) in the Next.js and next-intl docs.

### 2.4 `request.ts` (merge namespace files)

```ts
// apps/web/i18n/request.ts
import { getRequestConfig } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import { routing } from './routing';
import { NAMESPACES } from './namespaces';   // generated list: ['common','nav',...]
import { formats } from './formats';

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested) ? requested : routing.defaultLocale;
  const entries = await Promise.all(
    NAMESPACES.map(async (ns) => [ns, (await import(`../messages/${locale}/${ns}.json`)).default] as const),
  );
  return {
    locale,
    messages: Object.fromEntries(entries),
    formats,
    timeZone: 'Asia/Dhaka',          // default display zone (L-05); per-user override later
    onError: (e) => { if (process.env.NODE_ENV === 'production') captureI18nError(e); else throw e; },
    getMessageFallback: ({ namespace, key }) => `⟦${namespace}.${key}⟧`,   // visible in dev/QA; never silent
  };
});
```
Notes: (a) **No runtime fallback to English in production for bn**: a missing bn key is a CI failure (section 14). `getMessageFallback` only exists to make any escape obvious and to log it to Sentry. (b) For route groups that need only a few namespaces (e.g., `(exam)` ships `exam`, `common`, `errors`), pass only those to the client provider (`NextIntlClientProvider messages={pick(messages, ['exam','common'])}`) to keep the client bundle small on 3G (08 P7).

### 2.5 Layout, html lang and fonts

```tsx
// apps/web/app/[locale]/layout.tsx
export function generateStaticParams() { return routing.locales.map((locale) => ({ locale })); }
export default async function RootLayout({ children, params }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);                    // static rendering support
  return (
    <html lang={locale} dir="ltr" className={cn(inter.variable, notoBengali.variable, hindSiliguri.variable, jetbrainsMono.variable)}>
      <body><NextIntlClientProvider>{children}</NextIntlClientProvider></body>
    </html>
  );
}
```
Font imports and the `bn` preload follow 08 §2.2.1 exactly.

### 2.6 Navigation and links
Always import `Link`, `redirect`, `usePathname`, `useRouter` from `@/i18n/navigation` (never `next/link` directly for in-app links) so `/bn` is preserved. Lint rule (NEW-I18N-05): ban `next/link` and `next/navigation`'s `redirect` outside `i18n/navigation.ts`.

### 2.7 Language switcher
Component in `packages/ui`: labels are **endonyms, never translated**: "English" and "বাংলা". `lang` attribute on each option (`lang="bn"`), `hrefLang`, keeps current path via `usePathname()`. Persists to `user_profile.locale` for signed-in users.

### 2.8 Server vs client strings
Prefer `getTranslations` in Server Components (no JS shipped). Use `useTranslations` only in Client Components that need it. Server actions return **error codes / message keys** (`AppError.messageKey`, 04 §560), never prose, and the client renders them in the active locale.

---

## 3. Message files: structure and namespaces

### 3.1 Namespace map (one file per namespace, per locale)

| Namespace | Route groups / used by | Owner (task area) | Notes |
|---|---|---|---|
| `common` | everything | P0-29 | buttons (save/cancel/next), states (loading/empty/error), units, relative-time labels, language names |
| `nav` | `(marketing)`, App shell | P0-28 | header, footer, menus, breadcrumbs |
| `marketing` | `(marketing)` | P0-33 | home, course landing, pricing, tools, blog chrome. Blog/article **bodies** are CMS content, not messages (section 11) |
| `auth` | `(auth)` | P0-12..24 | sign-in/up, OTP, onboarding, 2FA, consent |
| `checkout` | `(checkout)` | P1 payments | cart/buy-now, order status, receipts text, payment error codes |
| `learner` | `(learner)` | P1 | dashboard, player chrome, practice, vocab, plan, progress, settings |
| `exam` | `(exam)` | P1 test engine | Test shell: instructions, timers, warnings, submit dialogs. Question content is **not** here (English, from DB) |
| `studio` | `(studio)` | P1 | instructor CMS |
| `grader` | `(grader)` | P1 | grading UI |
| `staff` | `(staff)` | P1 | editor/support/finance. English-first; bn optional until staff need it (decision 16.3) |
| `org` | `(org)` | P2 | institution portal |
| `admin` | `(admin)` | P1 | English-only allowed at P1 (staff tool). Still key-based so bn can be added |
| `errors` | `AppError.messageKey` catalogue | P0 | all user-facing error messages (04 §570) |
| `emails` | React Email templates | P0/P1 | subjects, bodies, footers; rendered per recipient locale |
| `notifications` | in-app notifications (`titleKey`, `bodyKey`, 05 §2877) | P1 | stored as key+params, rendered at read time |
| `seo` | metadata | P0-42 | page titles, descriptions, OG text per route |

### 3.2 File shape

```json
// apps/web/messages/en/checkout.json
{
  "buyNow": {
    "cta": "Buy now",
    "summary": {
      "title": "Order summary",
      "itemCount": "{count, plural, one {# item} other {# items}}",
      "total": "Total: {amount}"
    }
  },
  "status": {
    "verifying": { "title": "Verifying your payment", "body": "This usually takes a few seconds. Please do not close this page." }
  }
}
```
```json
// apps/web/messages/bn/checkout.json   (same keys, same ICU argument names)
{
  "buyNow": {
    "cta": "এখনই কিনুন",
    "summary": {
      "title": "অর্ডারের সারসংক্ষেপ",
      "itemCount": "{count, plural, one {#টি আইটেম} other {#টি আইটেম}}",
      "total": "সর্বমোট: {amount}"
    }
  }
}
```
Rules: nested objects max depth 4; one concept per leaf; no arrays of strings used as UI copy (arrays hide key identity; use numbered keys `step1`, `step2`) except when a list is purely data; values are plain strings (ICU) only; JSON sorted alphabetically within a level by a formatter (`pnpm i18n:sort`) to minimise merge conflicts between parallel agents.

### 3.3 Status metadata (outside the shipped JSON)
Translation status lives in `i18n/status/<locale>.json`, not in message values:
```json
{ "checkout.buyNow.cta": { "state": "approved", "by": "editor-1", "at": "2026-12-01", "sourceHash": "a1b2c3" } }
```
States: `draft_machine` → `draft_edited` → `approved` → `stale` (the `en` source hash changed since approval). CI uses it for the release gate (section 14, rule R9).

---

## 4. Key naming rules

1. Path = `namespace.area.element[.state]`, lowerCamelCase segments: `auth.signIn.form.email.label`, `exam.timer.warning.fiveMinutes`, `errors.forbidden`.
2. Name by **purpose, not by text**: `checkout.status.verifying.title`, not `checkout.pleaseWait`. If the English changes, the key does not.
3. Reuse keys only for truly identical meaning in the same context (`common.actions.save`). Do **not** reuse a key across contexts that Bangla may phrase differently (e.g., "Close" = বন্ধ করুন (action) vs কাছাকাছি (near)). When unsure, make two keys.
4. Suffixes: `.title`, `.body`, `.label`, `.placeholder`, `.hint`, `.error.<code>`, `.cta`, `.aria` (screen-reader-only text), `.tooltip`, `.empty`, `.loading`.
5. Always give `aria-label`/`alt`/`title` their own `.aria`/`.alt` keys; accessibility text is translated too.
6. ICU argument names: lowerCamelCase, **identical in en and bn** (`{count}`, `{amount}`, `{examName}`, `{brand}`); CI compares the placeholder sets (rule R4).
7. Never put HTML in strings. Use ICU rich-text tags (`<b>…</b>`, `<link>…</link>`) rendered through `t.rich`; allowed tag names are a closed list in `i18n/rich-tags.ts` (`b`, `i`, `link`, `br`, `nowrap`, `en`) and CI checks tags match across locales.
8. No sentence fragments assembled in code (`t('a') + ' ' + t('b')`). Word order differs: Bangla is SOV. Give the whole sentence one key with arguments.
9. Agents add keys with a one-line `// context` comment in the **status file** (`i18n/context.json`: `{ "key": "Button on the order summary; max 20 chars" }`) so reviewers see where the string appears and its length limit.
10. Maximum lengths: buttons/chips ≤ 24 characters in Bangla; nav items ≤ 18; headings may wrap to 2 lines (08 truncation rule).

---

## 5. ICU messages: plurals, select, rich text

### 5.1 Bangla plural rules (CLDR; verify with `Intl.PluralRules('bn')`)

- Cardinal categories for `bn`: **`one`** and **`other`**. The `one` category applies when **i = 0 or n = 1**, i.e. for **0 and 1** (and fractions below 2 whose integer part is 0, such as 0.5). It is **not** the English rule: in Bangla, zero takes the `one` form.
- In practice Bangla does not inflect the noun for number; the **classifier** carries it: ১টি বই, ৩টি বই, বইগুলো (definite plural). So `one` and `other` bodies are often identical. Still provide **both branches** (ICU requires `other`; `one` must exist when the English has it so the CI parity check holds).
- Ordinals (`selectordinal`): `bn` has `one` (1, 5, 7, 8, 9, 10), `two` (2, 3), `few` (4), `many` (6), `other`. Bangla ordinal suffixes are irregular (১ম, ২য়, ৩য়, ৪র্থ, ৫ম, ৬ষ্ঠ, ৭ম…). Avoid ordinals in UI where possible ("Section 2" not "2nd section"); when needed, use `selectordinal` with all categories `[Bangla editor]`.

```text
en: "{count, plural, =0 {No tests yet} one {# test} other {# tests}}"
bn: "{count, plural, =0 {এখনও কোনো টেস্ট নেই} one {#টি টেস্ট} other {#টি টেস্ট}}"
```
`=0` explicit branches are recommended for empty states (works in both locales and avoids relying on the Bangla `one` quirk).

### 5.2 Classifier convention
Counts use `#টি` (inanimate, formal, preferred in UI), `#জন` for people (`{count, plural, one {#জন শিক্ষার্থী} other {#জন শিক্ষার্থী}}`), `#টা` is colloquial and **not** used `[Bangla editor]`. Note `#` renders using the **active numbering system** chosen in `formats` (section 6.2): Latin digits by default, so output is `3টি টেস্ট` unless the user enabled Bangla numerals (`৩টি টেস্ট`).

### 5.3 Select (gender, role, state)
Bangla has no grammatical gender on verbs or pronouns (তিনি/সে are gender-neutral), so **do not use `select` for gender**. Use `select` for state/role/variant:
```text
"{role, select, student {শিক্ষার্থী} guardian {অভিভাবক} instructor {শিক্ষক} other {ব্যবহারকারী}}"
```
`other` is mandatory. Never use boolean-looking selects for text that differs by more than a word; write two keys.

### 5.4 Numbers, dates inside messages
Pass raw values and let ICU format them: `"{price, number, currency}"`, `"{date, date, short}"` with named formats from `formats.ts` (section 6). Do not pre-format in code and pass strings (breaks digit preference).

### 5.5 Rich text
```text
en: "By continuing you agree to our <terms>Terms</terms> and <privacy>Privacy Policy</privacy>."
bn: "চালিয়ে গেলে আপনি আমাদের <terms>শর্তাবলি</terms> ও <privacy>গোপনীয়তা নীতি</privacy> মেনে নিচ্ছেন।"
```
Tag **names** are identical across locales; tag **order** may differ.

### 5.6 Punctuation
Bangla sentence terminator is the danda "।" (U+0964), not "."; question mark "?" and exclamation "!" are Latin. Use "।" in Bangla prose, keep "." inside numbers, URLs, abbreviations. Quotation marks: “ ” (curly). Do not end button labels with punctuation. Avoid exclamation marks in both languages (calm tone, D8, i18n-copywriter rules).

---

## 6. Formatting: numbers, digits, currency, dates

All formatting goes through **one helper module** (`apps/web/i18n/format.ts` + named `formats` for next-intl) so policy changes in one place. No `toLocaleString()` calls and no hand-built currency strings anywhere else (lint rule NEW-I18N-05).

### 6.1 The numbering-system trap
In CLDR/ICU, the **default numbering system for `bn` locales is Bengali digits (`beng`)**. So `new Intl.NumberFormat('bn-BD').format(1234)` prints `১,২৩৪`. Our policy (L-05, 08) is **Latin digits by default** in both locales, so every formatter must set the numbering system **explicitly**:

```ts
// apps/web/i18n/format.ts
export type DigitPref = 'latn' | 'beng';          // from user setting "Use Bangla numerals" (F-ACC-08), default 'latn'
const base = (locale: AppLocale) => (locale === 'bn' ? 'bn-BD' : 'en-BD');   // en-BD: verify availability; fall back to 'en-GB'
export function nf(locale: AppLocale, digits: DigitPref, opts: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat(base(locale), { ...opts, numberingSystem: digits });
}
```
Equivalent locale-tag form: `bn-BD-u-nu-latn` / `bn-BD-u-nu-beng`. Test: `nf('bn','latn').format(1234.5)` must not contain any character in U+09E6–U+09EF (snapshot test, section 14 rule R10).

### 6.2 Where Bangla numerals apply (user setting only)

| Context | Digits |
|---|---|
| Prose and UI counts (e.g., "৩টি কোর্স", progress "৪ দিন") | user setting: Latin default, Bangla if opted in |
| Prices, order totals, invoices, receipts | Latin by default; Bangla only if user opted in **and** the string is not a legal/financial document (invoices/PDFs always Latin) |
| Exam shell: timers, question numbers, option labels, scores, **band scores** | **Always Latin** (08, L-05); never converted |
| Phone numbers, OTP codes, order IDs, verification codes, dates in legal text | Always Latin |
| URLs, slugs, file names | Always Latin |
| Notifications/emails | Latin unless `user_profile` setting is on |

Implementation: a React context `DigitPrefProvider` + server helper reading `user_profile.preferences`. Components in the exam shell import `nfExam()` which hard-codes `latn`.

### 6.3 Currency (BDT ৳ and USD)

Prices are stored as `amount_minor` integer + ISO currency (D5); formatting divides by 100 only at the edge.

```ts
export function formatMoney(amountMinor: number, currency: 'BDT'|'USD', locale: AppLocale, digits: DigitPref) {
  return nf(locale, digits, {
    style: 'currency', currency,
    currencyDisplay: 'narrowSymbol',                      // ৳ and $ not "BDT"/"US$"
    minimumFractionDigits: amountMinor % 100 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountMinor / 100);
}
// expected (verify with real ICU in the unit test): 
// formatMoney(499900,'BDT','en','latn') -> "৳4,999"        formatMoney(499900,'BDT','bn','latn') -> "৳4,999"
// lakh grouping appears above 99,999: formatMoney(15000000,'BDT','en','latn') -> "৳1,50,000" (en-BD/bn-BD Indian-style grouping; verify; en-GB would print 150,000)
// formatMoney(2500,'USD','en','latn') -> "$25"   formatMoney(2500,'USD','bn','beng') -> "$২৫"
```
Rules: (a) show **৳** before the amount, no space; (b) BDT prices are whole taka in marketing (`.00` dropped) but receipts show 2 decimals; (c) USD shows `$` plus, on pages visible to non-BD users, the ISO code when ambiguity matters ("$25 USD"); (d) lakh/crore grouping for BDT (`1,50,000`) is **correct for Bangladeshi readers** and comes from `en-BD`/`bn-BD`; if `en-BD` is unavailable in the Node ICU build, fall back to `en-IN` grouping for BDT and add a unit test (`Intl.NumberFormat.supportedLocalesOf(['en-BD'])`); (e) never display BDT and USD side by side for the same product without the price-book region logic (C16).

### 6.4 Dates and times
Policy (L-05): dates `DD MMM YYYY`, **12-hour** time, default zone **Asia/Dhaka** (UTC+6, no DST), stored as UTC.

```ts
export const dateShort = (d: Date, locale: AppLocale, digits: DigitPref) =>
  new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Dhaka', numberingSystem: digits,
  }).format(d);
// en: "07 Nov 2026"      bn (latn digits): "07 নভেম্বর 2026"      bn (beng): "০৭ নভেম্বর ২০২৬"
export const timeShort = (d: Date, locale: AppLocale, digits: DigitPref) =>
  new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Dhaka', numberingSystem: digits,
  }).format(d);
// bn day-period text (AM/PM vs পূর্বাহ্ন/অপরাহ্ন) depends on ICU data: verify and lock with a snapshot.
```
Rules: show the zone when it matters ("10:00 PM Dhaka time" / "রাত ১০:০০ ঢাকার সময়") for live classes and exam slots, and offer "show in my time zone" for international learners; relative times via `Intl.RelativeTimeFormat` (`numeric: 'auto'`); durations as "1 h 30 min" / "১ ঘণ্টা ৩০ মিনিট" built from named keys (`common.units.hour`), not string concatenation; month names in Bangla follow the Gregorian calendar (the Bangla calendar/Bangabda is out of scope; do not use `u-ca-bengali`, which ICU does not provide `[verify]`).

### 6.5 Lists, units, sorting
`Intl.ListFormat(locale, {type:'conjunction'})` for "A, B and C" ("A, B এবং C"). File sizes and speeds: Latin numerals + English unit symbols (MB, Mbps, kbps) in both locales. Sorting Bangla names: `Intl.Collator('bn')` (not `localeCompare` without locale). Search: Postgres `simple` config indexes `title_bn` (05 §1109); Bangla stemming is not provided, so search matches on whole tokens only (documented limitation).

---

## 7. Fonts, line-height and mixed-script rules

Authoritative detail: `08` §2.2.1–2.2.2 (copied, not redefined). Operational summary:

| Aspect | Rule |
|---|---|
| Faces | Noto Sans Bengali (primary, variable, self-hosted via `next/font`), Hind Siliguri (dense tables / fallback). Latin faces **before** Bangla faces in the stack so digits and Latin words use Inter/SF per glyph |
| Size | ×1.06 on Bangla (`--bn-size`): body 18 px |
| Line-height | ×1.2 (`--bn-lh`): body ≈ 1.7, headings ≈ 1.3–1.35, prose ≈ 2.0. Matras and conjuncts stack above/below the line and collide at Latin leading |
| Letter-spacing | 0 in Bangla. Negative tracking tears conjuncts (`--bn-track: 0`) |
| Weight | body 400/500; headings max 600 (700 clogs counters under 24 px) |
| Italics / uppercase / small caps | None in Bangla. Use 600 weight or accent colour for emphasis; eyebrow labels not uppercased |
| Truncation | Prefer wrapping to 2 lines; `line-clamp` only with `padding-block: 0.1em`; no single-line ellipsis on headings |
| Hyphenation | `hyphens: none` for `:lang(bn)`; Bangla breaks at spaces; `overflow-wrap: anywhere` only on URL/code containers |
| Buttons / chips | 44 / 32 px height (+4 px) |
| Min size | 12 px (caption); inputs ≥ 16 px |
| Preload | `bn` locale preloads Noto Bengali 400 and 600 subsets (08 §2.2.1) |
| Font fallback | `font-display: swap`; fallback stack ends with `"Kalpurush", "SolaimanLipi", "Vrinda", "Nirmala UI", "Noto Sans Bengali", system-ui` `[Bangla editor/QA to confirm]` so a failed webfont never shows tofu on Android/Windows |

```css
:lang(bn) { font-feature-settings: "kern", "liga", "clig", "calt"; hyphens: none; text-rendering: optimizeLegibility; }
:lang(bn) em, :lang(bn) i { font-style: normal; font-weight: 600; }
```
Do not disable ligatures/`clig`; they form the conjuncts (যুক্তাক্ষর).

### 7.1 Mixed-script rules (Bangla text containing English)

1. **Locked exam terms stay in Latin script** inside Bangla sentences: IELTS, GRE, TOEFL, PTE, Band score, Listening, Reading, Writing, Speaking, Task 1/Task 2, AWA, Verbal Reasoning, Quantitative Reasoning (section 10). Add a Bangla gloss on first use per page or in a tooltip, not in every sentence.
2. Wrap each inline English run in `<span lang="en">` (rich tag `<en>…</en>` in messages) so screen readers switch voice and CSS can apply the Latin font; **never** rely on font fallback alone.
3. Suffixes attach to English terms with a **hyphen**: `IELTS-এর`, `GRE-তে`, `Band score-এ`, `PDF-টি`. Never `IELTSএর`. `[Bangla editor]`
4. A single **UI label** (button, tab, chip, nav item) is **one script**, except locked product names/terms. A sentence may contain English runs; a label should not mix languages. (Consistent with 08 P7 "never mix English and Bangla in one label"; locked terms are the single exception, e.g., the tab "Band score" may stay English as a whole label.)
5. User-generated text (names, essays, Q&A) is wrapped in `<bdi>` and never altered by translation.
6. Digits inside Bangla sentences follow the digit preference (section 6.2); digits inside a locked English term never change (`Task 2`, `Band 7.5`).
7. Spacing: one space between Bangla and Latin runs only where the hyphen suffix is not used; no spaces before "।", "?" or ",".
8. Banglish (Bangla written in Latin letters) is **not used** in UI. Allowed only in verbatim user content and in the AI test sets (31).

---

## 8. Translation workflow (en master to published bn)

### 8.1 Roles

| Role | Who | Responsibilities |
|---|---|---|
| Source author | Human or Haiku `i18n-copywriter` | writes `en`, adds context note and max length |
| Draft translator | **Haiku** (`i18n-copywriter`, Batch API for bulk, 22 §cost) with the glossary in context | produces `bn` draft; flags uncertainties; **never publishes** |
| Bangla editor | Native Bangla reviewer: founder at first, then a hired freelance editor (BD-based, education/IT register) | edits for naturalness, glossary adherence, tone; marks `approved` |
| Second reader (sample) | A learner-persona reviewer (e.g., a university student) | reads 10% sample for comprehension |
| Context QA | Founder or QA agent + editor | checks strings in the real UI at 320/360/768 px (section 13) |
| Legal reviewer | Counsel | legal/policy pages only (`26`, section 11.6) |
Roster is maintained in `docs/i18n/ROSTER.md` (name, role, availability, rate; contact details in the password manager, not git).

### 8.2 Pipeline (per batch of strings)

```
 1. EN master        author adds/changes keys in messages/en/<ns>.json + context + max length
        │            CI R1/R2/R4: key parity, placeholders; status file marks bn "stale" or "missing"
 2. DRAFT bn         Haiku task: input = changed en keys + glossary.csv + style guide (this doc §9) + 2 approved examples
        │            output = messages/bn/<ns>.json updates; state = draft_machine; list of "uncertain" keys with reason
 3. AUTO-CHECK       CI: ICU syntax valid, placeholders identical, no banned patterns (Latin punctuation ".", Banglish, brand literal), length ≤ limit
        │
 4. HUMAN EDIT       Editor edits in the translation tool or PR (section 15); state = draft_edited → approved
        │            edits that change glossary terms update glossary.csv in the same PR
 5. IN-CONTEXT QA    deploy to preview; QA checklist (section 13) on each changed route in /bn; screenshots attached to PR
        │
 6. RELEASE GATE     CI R9: no public-route key in state draft_machine or stale on a release branch; PR needs the "bn-approved" label from the editor
        │
 7. PUBLISH          merge → staging → promote (28 §13)
 8. FEEDBACK         "Report a translation issue" link on every /bn page → creates an issue labelled i18n; editor triages weekly
```
Source changes after approval turn the `bn` value `stale` (hash mismatch). Stale strings stay live (they were approved) but block the next release if the change is semantic; typo-only changes may be waived by the editor with `waive` in the status file.

### 8.3 Batch rules for Haiku draft tasks (put in the task card)
- Work in units of ≤ 150 keys per call; include the glossary rows whose English terms occur in the batch; include 3 approved examples from the same namespace.
- Output format: JSON of keys → bn string, plus `uncertain: [{key, reason}]`.
- Forbidden: inventing prices/claims, translating locked terms, adding keys, changing ICU argument names, using Banglish, using তুমি-forms (section 9.2).
- Report: counts created/skipped/failed (22 §432 idempotency rule); "needs native review" flagged (i18n-copywriter output format).
- Cost planning: 500 strings ≈ USD 0.015 on Haiku batch (22 §cost table). Human editing is the real cost; budget editor time at ~100 to 150 strings per hour `[estimate; verify with the first batch]`.

### 8.4 Turnaround and priority tiers

| Tier | Strings | Editor gate | Target turnaround |
|---|---|---|---|
| A: money and trust | checkout, receipts, refund text, auth/OTP, errors, consent, legal summaries, exam shell warnings | Mandatory, two readers (editor + founder) | before every release touching them |
| B: acquisition | marketing, pricing, course pages, SEO titles/descriptions, onboarding | Mandatory editor | before launch of the page |
| C: product UI | learner, studio help, notifications, emails | Mandatory editor, may batch weekly | within the sprint |
| D: staff tools | grader, staff, admin, org | Optional until staff request bn (decision 16.3) | best effort |

### 8.5 Editing in PRs
Editor edits `messages/bn/*.json` through the translation tool (section 15) or, if unfamiliar with Git, in the tool's UI which opens a PR via bot. Every PR that touches `messages/bn/` must list: keys changed, state transitions, screenshots of 3 representative screens at 360 px.

---

## 9. Glossary and style guide

### 9.1 Voice and register

- Brand voice (D8, i18n-copywriter): calm, confident, specific, no hype; banned words in English (unleash, elevate, seamless, revolutionize, game-changer). Bangla equivalents to avoid: অবিশ্বাস্য, যুগান্তকারী, ১০০% গ্যারান্টি, "সেরা" without proof (also a legal risk, 02/26).
- Language form: **standard colloquial Bangla (চলিত ভাষা)**, Bangladeshi standard (Bangla Academy orthography; follow the current "প্রমিত বানানরীতি"), **not** সাধু ভাষা, and avoid West Bengal-specific vocabulary (e.g., prefer পানি as the audience expects in the education context only where the editor confirms; the editor owns such calls) `[Bangla editor]`.
- Sentence length ≤ 20 words; active voice; one idea per sentence; imperative in polite form (করুন, দিন, দেখুন).
- Numbers and units: follow section 6. Date wording: "৭ নভেম্বর" if Bangla digits are on, else "7 নভেম্বর".

### 9.2 Honorifics: আপনি vs তুমি (recommendation)

| Audience | Recommendation | Reason |
|---|---|---|
| Adults (18+), guardians, instructors, org admins, staff | **আপনি** everywhere (আপনার, করুন, দেখুন, করবেন) | Respectful default in Bangladeshi commercial and education settings; avoids the condescension of তুমি |
| Minors (self-declared under 18, D7 age band) | **Also আপনি in the product UI** (proposed default) | One tone avoids per-user string variants and the risk of sounding patronising to 16-17-year-old test takers (the main under-18 segment for IELTS/GRE prep is 16+); no extra ICU `select` complexity |
| Foundation track for young beginners (A0 to B1) | Founder decision (16.3): either আপনি throughout, or **তুমি** only inside lesson copy authored for beginners, never in system/legal/payment text | Friendly tone can help learning but mixing tones inside one screen is jarring |
| Guardian-facing messages about a minor | আপনি, third person for the learner ("আপনার সন্তানের …") | Formal, consent-related |
| Teachers' spoken lessons | Instructor's choice, style-guide default আপনি | Natural teacher voice is not controlled by message files |
Never use **তুই**. Never mix আপনি and তুমি in one screen. Verb forms must agree (আপনি করুন / করবেন; not "আপনি করো"). If তুমি is later approved for a surface, implement as **a separate namespace/file for that surface**, not as runtime select.

### 9.3 Exam terms: keep English, add Bangla gloss

| Term (locked, Latin script) | Where gloss appears | Gloss (draft) `[Bangla editor]` |
|---|---|---|
| Band score | tooltip + first mention in onboarding/help/score report | "IELTS-এর ফলাফলের স্কেল (০ থেকে ৯)" |
| Estimated band score | score card heading shows "Estimated band score" + subtitle | "আনুমানিক ব্যান্ড স্কোর: আসল পরীক্ষার ফল নয়" (D6: always labelled estimated) |
| Scaled score (GRE) | tooltip | "GRE-র ১৩০ থেকে ১৭০ স্কেল" |
| Listening / Reading / Writing / Speaking | section names in the exam shell stay English; nav label may add bn | শোনা / পড়া / লেখা / বলা (gloss only) |
| Task 1 / Task 2, AWA, Verbal Reasoning, Quantitative Reasoning | locked; tooltip gloss | per glossary file |
| Mock test | UI label "Mock test" appears as "মক টেস্ট" (transliterated, widely used in BD); not locked | |
| TRF, CEFR, IELTS Academic/General Training | locked | |
Pattern in running text: `আপনার Band score এখানে দেখুন` (term in Latin, hyphen suffix if needed). On first appearance per page: `Band score (ব্যান্ড স্কোর)` is **not** used; instead use the tooltip, to keep text clean.

### 9.4 Starter glossary (seed for `i18n/glossary.csv`; full list ≈ 150 terms is task NEW-I18N-03)

All Bangla below is a **draft proposal** produced for the editor to confirm; the editor's decisions override. Columns in the real CSV: `en, bn, pos, locked(Y/N), context, do_not_use, status, owner, updated`.

| English | Bangla (draft) | Notes |
|---|---|---|
| Course | কোর্স | transliteration is standard in BD |
| Lesson | পাঠ | alt: লেসন; live session = ক্লাস |
| Live class | লাইভ ক্লাস | |
| Mock test | মক টেস্ট | |
| Practice / Practice set | অনুশীলন / প্র্যাকটিস সেট | |
| Question bank | প্রশ্নব্যাংক | |
| Diagnostic test | ডায়াগনস্টিক টেস্ট | "মান নির্ণয় পরীক্ষা" is formal; avoid |
| Vocabulary | শব্দভান্ডার | editor to confirm spelling |
| Study plan | স্টাডি প্ল্যান | alt: পড়ার পরিকল্পনা |
| Progress | অগ্রগতি | |
| Dashboard | ড্যাশবোর্ড | |
| Certificate | সার্টিফিকেট | |
| Estimated (score) | আনুমানিক | always shown with scores (D6) |
| AI feedback | এআই ফিডব্যাক | write "এআই", not "AI", in running Bangla text; `AI` in tab labels allowed `[Bangla editor]` |
| AI credit | এআই ক্রেডিট | D12 C1 unit; keep consistent |
| Evaluation | মূল্যায়ন | |
| Submit | জমা দিন | |
| Save | সংরক্ষণ করুন | |
| Next / Back | পরবর্তী / পিছনে | |
| Cancel | বাতিল করুন | |
| Delete | মুছে ফেলুন | |
| Edit | সম্পাদনা করুন | |
| Search | খুঁজুন | |
| Sign in | লগ ইন | |
| Sign up / Create account | নতুন অ্যাকাউন্ট খুলুন | |
| Password | পাসওয়ার্ড | |
| OTP / verification code | OTP / ভেরিফিকেশন কোড | OTP locked in Latin |
| Account | অ্যাকাউন্ট | |
| Profile | প্রোফাইল | |
| Settings | সেটিংস | |
| Notification | নোটিফিকেশন | |
| Student | শিক্ষার্থী | |
| Guardian / Parent | অভিভাবক | |
| Instructor / Teacher | শিক্ষক | |
| Mentor | মেন্টর | |
| Grader | মূল্যায়নকারী | staff term |
| Enrol | ভর্তি হোন | editor to confirm "হোন"/"হন" |
| Buy now | এখনই কিনুন | |
| Order | অর্ডার | |
| Payment | পেমেন্ট | |
| Invoice / Receipt | ইনভয়েস / রশিদ | |
| Refund | টাকা ফেরত (রিফান্ড) | |
| Price / Total | মূল্য / সর্বমোট | |
| Discount / Coupon | ছাড় / কুপন | |
| Free | ফ্রি | |
| Plan / Pass | প্ল্যান / পাস | tier names are locked (section 10) |
| Time remaining | অবশিষ্ট সময় | exam timer label |
| Section | সেকশন | exam sections locked in English in the shell |
| Question | প্রশ্ন | |
| Answer | উত্তর | |
| Correct / Incorrect | সঠিক / ভুল | |
| Review | পর্যালোচনা | |
| Download / Upload | ডাউনলোড / আপলোড | |
| Error / Try again | ত্রুটি / আবার চেষ্টা করুন | |
| Help centre | সহায়তা কেন্দ্র | |
| Privacy policy / Terms | গোপনীয়তা নীতি / শর্তাবলি | legal-reviewed |
| Cookie | কুকি | |
Add `do_not_use` entries as found (e.g., avoid "দাখিল" for submit; avoid Indian-Bengali "ডাউনলোড করে নিন" variants if editor flags).

### 9.5 Tone examples (en to bn, for the Haiku prompt)

| Context | English | Bangla (draft) |
|---|---|---|
| Neutral instruction | "Enter the 6-digit code we sent to {contact}." | "{contact}-এ পাঠানো ৬ সংখ্যার কোডটি দিন।" (digits follow user setting; here shown with Bangla numeral for illustration) |
| Error (calm, specific) | "We could not verify your payment. If money was deducted, it will be matched automatically within a few minutes." | "আপনার পেমেন্ট যাচাই করা যায়নি। টাকা কাটা হয়ে থাকলে কয়েক মিনিটের মধ্যে এটি স্বয়ংক্রিয়ভাবে মিলিয়ে নেওয়া হবে।" |
| Empty state | "No tests yet. Start with the free diagnostic." | "এখনও কোনো টেস্ট নেই। ফ্রি ডায়াগনস্টিক টেস্ট দিয়ে শুরু করুন।" |
| Score disclaimer | "Estimated band score. Not an official result." | "আনুমানিক Band score। এটি অফিসিয়াল ফলাফল নয়।" |

---

## 10. Locked and untranslatable strings

Never passed to the translator and never altered in `bn` (Latin script, as shown):

| Class | Examples | Mechanism |
|---|---|---|
| Brand | `{brand}` from `packages/config/brand.ts` (`name`, plus `nameBn` field for the approved Bangla form when one exists) | ICU argument; lint: literal brand in any message file fails CI (grep test P0-07) |
| Exam trademarks | IELTS, GRE, TOEFL, PTE, Duolingo English Test, Common App, SAT, CEFR | `{exam}` argument or literal in an allow-list; trademark disclaimers (09/26) are **separate legal strings**: English authoritative, Bangla legal-reviewed (07 §2604) |
| Official score vocabulary | Band score, Scaled score, Task 1/2, AWA, Verbal Reasoning, Quantitative Reasoning | glossary `locked=Y` |
| Payment and platform names | bKash, Nagad, Rocket, SSLCommerz, Paddle, Visa, Mastercard, Google, Zoom, YouTube, WhatsApp, Facebook | glossary `locked=Y` |
| Tier and product names | Free, Core, Plus, Live, Mentor (D10) | product names are not translated; descriptive sub-labels are (e.g., "Core: স্ব-গতির রেকর্ডেড কোর্স") |
| Codes and technical | OTP, SMS, PDF, URL, email addresses, error codes (`E_PAYMENT_MISMATCH`), order IDs, coupon codes | literal |
| Currency symbols/codes | ৳, $, BDT, USD | via `formatMoney` |
| Language names | English, বাংলা | endonym, never translated |
| User content | names, essays, speaking transcripts, Q&A | `<bdi>`, untouched |
| Keyboard keys and code | Ctrl, Enter, `code` | literal |

Locked-term check (CI rule R7): for every glossary row with `locked=Y`, the same Latin string must appear in the `bn` value wherever it appears in the `en` value of the same key (case-sensitive).
Capitalisation: Bangla has none; keep Latin terms exactly as in `en`.

---

## 11. Content localisation (beyond UI strings)

### 11.1 Layers and storage (05)

| Layer | Storage | Locale handling | Editor |
|---|---|---|---|
| UI strings | `messages/<locale>/*.json` | this doc | Bangla editor + dev |
| Short content fields (titles, summaries, names) | `*_en` / `*_bn` columns (05 §39) | `bn` optional; validated at publish: required for any course/page marked "Bangla-ready" | Instructor / content_editor |
| Long content (lesson bodies, articles, FAQs) | `lesson_content` (UQ `lesson_id, locale`), `cms_page` (UQ `kind, slug, locale`) as Tiptap JSON | one row per locale | content_editor |
| Video captions | `media_asset.captions` / Bunny captions per language (10 §8.6) | WebVTT `en`, `bn` | content_editor, Bangla editor |
| Exam items (passages, questions, options, audio) | question versions (07) | **English only**, `lang="en"`; Bangla help text only in the shell and explanation fields | item writers |
| Emails/SMS/push | `emails` namespace + templates; SMS in `notifications` | recipient locale (`user_profile.locale`) | Bangla editor |
| Legal | `cms_page` kind=legal | versioned rows per locale | counsel + editor |

### 11.2 Lessons: bn explanation vs subtitles (decision table)

| Situation | Approach | Why |
|---|---|---|
| IELTS/GRE core lessons (taught mostly in English; learner is practising English) | **English audio + English captions as default; Bangla captions (`bn` WebVTT) as an option**; Bangla **text explanation** in the lesson body (`lesson_content` bn row) for key concepts | Preserves immersion and exam parity; cheap; improves comprehension for lower-level learners |
| Strategy/orientation, "How the test works", pricing explainer, onboarding | **Separate Bangla recording** (bn audio or presenter) | Trust and conversion; short videos so cost is low |
| English Foundation (A0 to B1, D11) | **Bangla-medium instruction**: Bangla-voiced lessons with English target phrases on screen; captions both | The track exists because learners cannot follow English-only |
| Live classes | Instructor's language of choice per batch; label the batch "English medium / বাংলা মাধ্যম / Mixed" | Pilot cohorts are manual (D1) |
| Tech tracks, university packs (P3) | Decide per course; default Bangla explanation + English terminology | BD CSE syllabus context |
Rules: (a) never auto-publish AI-translated captions; `source='auto'` needs editor approval (10 §8.6); (b) a course page shows "Instruction language" and "Captions available" badges; (c) the video player lists caption languages from the asset; (d) lesson transcripts are searchable in the displayed language; (e) every Bangla lesson body is reviewed with the same editor gate as strings (tier B).

### 11.3 Exam content in the Bangla UI
Instructions, timer warnings and buttons are bilingual; the passage/question stays English (`lang="en"` on the content region). A learner may enable "Show instructions in Bangla" in the shell; exam rules text in Bangla is legal-sensitive and tier A. No Bangla translations of questions (it would change difficulty and violate exam parity).

### 11.4 AI feedback language (GA-034 question; proposal for 07 §7.7 owner and founder)
- Evaluation output (07 §7.7, `evaluation_result.locale`, 05 §2440): **default English** because the learner is practising English: error spans, corrected sentences, band-descriptor criteria names, rewritten sample.
- Add a per-user toggle **"Explain in Bangla"** that returns *only* the summary, top 3 tips and criterion explanations in Bangla; error spans and rewrites stay English.
- Bangla output is produced by the same model call using a Bangla instruction block; quality is measured by the Bangla/Banglish test sets (31) and labelled "AI-generated, may contain mistakes" in `bn` (D6 estimated labelling still applies).
- Banglish **input** (learner writes Bangla in Latin letters in help chat) is handled by the AI test set; UI never outputs Banglish.

### 11.5 Email and SMS
- Subject lines and bodies from the `emails` namespace; React Email components receive `locale`; preview both locales in the email dev tool and Mailpit.
- Bangla email fonts: web fonts do not load in most clients; specify a font stack ending in `"Noto Sans Bengali", "Nirmala UI", "Vrinda", Arial, sans-serif` and test in Gmail (Android + web) and Outlook (Windows) for tofu `[verify per client]`.
- **SMS in Bangla uses Unicode (UCS-2)**: a single SMS holds **70 characters** (67 per segment when concatenated) versus 160 GSM-7 characters. OTP SMS therefore uses a **short English template by default** ("Your {brand} code is 123456. Valid 5 min.") unless the gateway-approved Bangla template exists; template registration with the operator is required (10 §15.2 #11). Decide per message class (NEW-I18N-09). Cost and segment calculator exist in 10 §15.1.
- OTP/verification TTL values come from D12 C8, not from message files (pass as arguments).

### 11.6 Legal pages (GA-002 interplay)
English text is authoritative; the Bangla version is drafted by counsel or reviewed by counsel before publish; each legal page states "In case of conflict, the English version prevails" (in both languages) `[counsel to confirm]`. Legal pages live in `cms_page` (versioned per locale), not in message files. Cookie banner copy (GA-019) is tier A.

### 11.7 Notifications stored as keys
In-app notifications store `{titleKey, bodyKey, params, href}` (05 §2877) and render at read time in the viewer's locale; params must be raw values (numbers, ISO dates), not preformatted strings.

---

## 12. SEO: hreflang and slug policy

### 12.1 URLs
- English: `https://<domain>/ielts` (no prefix). Bangla: `https://<domain>/bn/ielts`. `/en/...` is **not** a valid URL under `as-needed`; next-intl redirects `/en/x` to `/x` (verify) and we ensure sitemap and canonicals never emit `/en`.
- Canonical: each locale page canonicals to **itself** (never bn → en).

### 12.2 hreflang (public pages: all `(marketing)` routes, course pages, blog posts, tools, legal)

```tsx
// in generateMetadata (helper: buildAlternates(pathname, availableLocales))
alternates: {
  canonical: localeUrl(locale, pathname),
  languages: {
    'en': localeUrl('en', pathname),            // https://<domain>/ielts
    'bn': localeUrl('bn', pathname),            // https://<domain>/bn/ielts
    'x-default': localeUrl('en', pathname),     // English is the default
  },
}
```
Rules: (a) emit `hreflang` **only for locales that actually exist and are published** (a course with no `bn` content has no `bn` alternate and no `/bn/...` sitemap entry; the `/bn` URL returns the English content only if we decide so, otherwise 404: **decision: 404 for unpublished bn content on dynamic pages, not a silent English copy under /bn**); (b) alternates are reciprocal (each page lists both); (c) sitemap lists both locale URLs with `xhtml:link` alternates (P0-42); (d) `<html lang>` equals the page locale; (e) OG `locale` = `en_US`/`bn_BD`, `og:locale:alternate` for the other; (f) JSON-LD `inLanguage`.

### 12.3 Slugs
**Policy: slugs are identical across locales and are ASCII English kebab-case** (`/courses/ielts-academic-complete`, `/bn/courses/ielts-academic-complete`). No Bangla-script slugs. Reasons: percent-encoded URLs are unreadable when shared (WhatsApp/Facebook), harder to type, break in some analytics tools; a single slug maps 1:1 to one `course` row (05), so `hreflang` pairing is trivial; localized slugs add a redirect/lookup table for little SEO gain. Bangla search relevance comes from `<title>`, H1, description and body content in Bangla. Static route names (`/pricing`, `/courses`) also stay English (`pathnames` config not used). Revisit if Search Console shows a clear Bangla-query gap (NEW-I18N-10).

### 12.4 Metadata per locale
Title ≤ 60 characters, description ≤ 155 characters measured in **Bangla glyph clusters** (Bangla titles truncate earlier visually; target ≤ 45 clusters `[verify with SERP preview]`). Strings in the `seo` namespace; course titles from `title_bn`. Structured data text in the page locale.

### 12.5 Language-aware behaviours
Search Console: one property for the domain; check International Targeting is not set to a single country (hreflang is the signal). Social previews: separate OG images per locale (08/23). `robots.txt` allows `/bn`. `Content-Language` response header set per locale.

---

## 13. QA checklist (run per PR touching `bn` and before each release)

**Automated first** (section 14), then manual with Chrome DevTools device toolbar and one real Android phone on 4G.

Viewport sweep: **320**, 360, 390, 768, 1024, 1440 px. Locale sweep: `/` and `/bn`. Theme sweep: light and dark.

| # | Check | Pass criteria |
|---|---|---|
| 1 | Truncation | No clipped matras/descenders (ি ী ু ূ, ref র্, য-ফলা); no single-line ellipsis on headings; `line-clamp` has `padding-block` |
| 2 | Overflow at **320 px** | No horizontal scroll on any route; buttons wrap to 2 lines without overflowing; tables scroll in a wrapper; text can grow +35% (08 P7) |
| 3 | Font fallback | Block Google Fonts / throttle Slow 3G with fonts blocked: Bangla still renders (no tofu □); then confirm `swap` shows fallback within 100 ms and layout shift CLS < 0.1 |
| 4 | Stress strings | `প্রতিযোগিতামূলক পরীক্ষার প্রস্তুতি`, `ক্ষুদ্র ঋণ ও বিনিয়োগ`, `স্বতঃস্ফূর্ত`, `শ্রেষ্ঠত্ব`, `দ্বিতীয় অধিবেশন` render correctly on `/design` route (08) |
| 5 | Line-height | No collisions between lines in 2- and 3-line headings; prose paragraphs ≈ 2.0 |
| 6 | Digits | No Bangla digits unless the setting is on; exam shell, prices, OTP, dates in legal text always Latin; setting on → counts/prose convert but band scores do not |
| 7 | Currency | ৳ placement, lakh grouping, no `BDT` text unless intended |
| 8 | Dates/times | `DD MMM YYYY`, 12-hour, Asia/Dhaka label where relevant; Bangla month names |
| 9 | Mixed script | Locked terms Latin; hyphen suffixes; `lang="en"` spans present; screen reader switches voice (VoiceOver/TalkBack spot check) |
| 10 | Plurals | 0, 1, 2, 5, 11, 21 items render sensible text in both locales |
| 11 | Tone | আপনি-forms only; no তুমি/তুই; no Banglish; "।" used; no exclamation overload |
| 12 | Glossary | No deviation from glossary terms (CI R8 warns; human confirms) |
| 13 | Forms | Placeholder, validation errors, help text translated; input font ≥ 16 px; Bangla typing and paste work; IME composition not interrupted by autosave/validation |
| 14 | Accessibility | `lang` attributes correct; `aria-label`s translated; axe clean on `/bn`; focus order unchanged |
| 15 | Emails/SMS | Render in Gmail Android/web, Outlook; SMS segment count within budget |
| 16 | SEO | `hreflang` reciprocal; canonical self; sitemap has both; titles in Bangla; no `/en/` URLs |
| 17 | Performance | `/bn` LCP < 2.5 s on throttled 4G Moto G class; Bangla font subset ≤ budget in 08/11 §8.2 |
| 18 | Fallback behaviour | Force a missing key in dev: visible `⟦ns.key⟧`; in prod build the CI must have blocked it |
| 19 | Exam shell | Timer, warnings, submit dialog in Bangla at 320 px; keyboard shortcuts unaffected; content region `lang="en"` |
| 20 | Screenshots | Bangla screenshots for every changed page attached to the PR (08 §77 requires "no clipped matras, no tofu, correct numerals policy") |

Release sign-off for a launch: editor signs the **tier A and B** namespaces; founder performs a 30-minute read-through of the learner journey (home → diagnostic → sign-up → pay → learn) in `/bn`.

---

## 14. CI checks (`pnpm i18n:check`, part of `pnpm verify`)

Implemented as a Vitest suite plus a small script (`tooling/scripts/i18n-check.ts`); runs in < 10 s; failures print `file:key` and a fix hint.

| Rule | Check | Failure level |
|---|---|---|
| R1 | **Missing keys**: key set of `messages/en/<ns>.json` equals `bn` (both directions) | error |
| R2 | **Unused keys**: key not referenced in source (static scan of `t('…')`, `t.rich`, `getTranslations`, dynamic key prefixes listed in `i18n/dynamic-keys.json`) | error on PR, warn on legacy; auto-fix `pnpm i18n:prune` |
| R3 | **Undefined keys**: `t('x')` in code that does not exist in `en` (TypeScript: generate `Messages` type from `en` and declare via `next-intl` global `IntlMessages`/`AppConfig` so `t()` is type-checked; verify the declaration syntax for the installed major) | error |
| R4 | **Placeholder mismatch**: ICU argument names, types and plural/select skeleton identical between `en` and `bn` (parse with `@formatjs/icu-messageformat-parser`; verify package) | error |
| R5 | **ICU validity**: every message parses; plural/select have `other`; no unbalanced braces/tags | error |
| R6 | **Rich tags**: tag names/sets equal across locales; only allowed tags | error |
| R7 | **Locked terms** preserved (section 10): brand never literal; exam terms appear in `bn` when in `en` | error |
| R8 | **Glossary adherence**: `en` term present → expected `bn` term present or `do_not_use` term absent (heuristic) | warn (error for locked) |
| R9 | **Release gate**: on `release/*` and `main`, public-route keys in state `draft_machine` or `stale` | error on release branch, warn elsewhere |
| R10 | **Digit policy**: `bn` values contain no U+09E6–U+09EF digits (Bangla digits come only from formatters); formatter snapshot tests for `nf/formatMoney/dateShort` | error |
| R11 | **Script hygiene**: `bn` values: no ASCII "." sentence terminator before whitespace/end (use "।") except inside numbers/URLs/abbreviations; no "ঃ" misuse; no Latin transliteration patterns (Banglish heuristic word list); no `তুমি/তোমার/তুই` forms (tone rule) | error |
| R12 | **Length limits**: `i18n/context.json` max length vs `bn` length (Bangla glyph clusters via `Intl.Segmenter('bn')`) | warn → error at tier A |
| R13 | **Sorted/format**: JSON sorted, 2-space indent, no duplicate keys | error (auto-fix `pnpm i18n:sort`) |
| R14 | **No hard-coded literals**: ESLint rule (`eslint-plugin-i18next` `no-literal-string` or `@formatjs/eslint-plugin-enforce-id`; choose in P0-29, verify) in `apps/web/app/**` and `packages/ui/**` for JSX text and `aria-label`, `alt`, `title`, `placeholder` | error (allow-list for `lang="en"` exam content, dev-only `/design` route) |
| R15 | **Link hygiene**: ban `next/link` outside `i18n/navigation.ts` | error |
| R16 | **hreflang test**: Playwright test fetches 5 public pages in both locales: reciprocal alternates, canonical self, `html lang` | error |
| R17 | **Visual smoke**: Playwright screenshots of 10 key routes at 320/360/1024 in `/bn`, diffed against approved baselines; plus axe | error on diff beyond threshold (baselines approved by editor) |
| R18 | **Pseudo-locale**: run the suite once with `en-XA`-style expansion (+35% length, accented) to catch overflow in `en` before bn exists | warn |

Missing-key behaviour at runtime: production never falls back silently (section 2.4). The Sentry tag `i18n.missing` is alerted at > 0 events/day.

---

## 15. Tooling options and recommendation

| Option | Licence / hosting | Fit | Pros | Cons |
|---|---|---|---|---|
| **i18n Ally** (VS Code extension) | MIT, local | Developer ergonomics | Inline translations in the editor, missing-key view, supports next-intl/ICU patterns and namespaced files (verify config `i18n-ally.localesPaths`, `keystyle: nested`) | No review workflow, no translation memory, no non-dev editor access |
| **Tolgee** | Open source (Apache-2.0 core; self-host free; cloud has paid tiers; verify) | Dev + in-context | **In-context editing on the running site** (alt-click string), screenshots, translation memory, machine-translation suggestions, SDK for Next.js/next-intl-compatible JSON, Git/CLI sync, roles for reviewers | Another service to host or pay for; React SDK integration work; verify next-intl compatibility |
| **Weblate** | GPL-3.0, self-host (or hosted plan; verify) | Review workflow | Mature approval workflow, glossary, translation memory, git-native (commits to the repo), CI-style checks, quality checks for ICU/placeholder | Heavier to run (Django/Postgres/Redis); UI is translator-oriented, less in-context; GPL only matters if we modify and distribute it (we only run it) |
| **Crowdin** | SaaS (free for open source; paid otherwise; verify) | Large teams/community | Best polish, glossary, TM, integrations, AI assist | Proprietary; per-seat/word cost; unnecessary for one editor |
| **Plain JSON + PR review** (no tool) | — | Smallest start | Zero cost, zero hosting | Editor needs Git; no TM; easy to bypass |

### 15.1 Recommendation
1. **Now (P0 to P1 launch, one editor, ~1,500 to 3,000 strings): i18n Ally in the dev's VS Code + CI checks (section 14) + PR review by the Bangla editor** using a simple GitHub workflow (editor gets a GitHub account with write access to `messages/bn/**` via CODEOWNERS and works in PRs; the founder can screen-share the first sessions). Cost USD 0. This avoids a hosted tool before it is justified and keeps the repo the single source of truth.
2. **Adopt Tolgee (self-hosted or cloud, verify pricing and next-intl JSON import/export) when any of these is true:** a second translator joins, the editor is uncomfortable with Git, string count > ~3,000, or the founder wants in-context editing on staging. It is the best open-source match for "edit on the live page" and keeps an approval state per key that maps to our `draft_machine` → `approved` states (section 3.3).
3. **Weblate is the fallback** if a strict reviewer workflow and Git-native sync matter more than in-context editing.
4. Whatever tool is chosen, **the repo JSON remains the source of truth** and `pnpm i18n:check` stays the gate. Decision recorded as an ADR (`docs/logs/ADR-TEMPLATE.md`) when switching (NEW-I18N-11).

### 15.2 Other tooling
- Generated `Messages` types from `en` for type-safe keys (R3).
- `pnpm i18n:extract` (agent-assisted): finds literal strings in components; Haiku proposes keys; never auto-merges.
- `pnpm i18n:glossary-check` for R8.
- Translation memory before a tool exists: `i18n/tm.jsonl` (source hash → approved bn) appended by the editor PR; Haiku prompts include the nearest 3 matches (embedding not required; simple token overlap).
- Pseudo-locale for layout testing (R18).

---

## 16. Backlog, open decisions

### 16.1 New tasks (add to `docs/12-BUILD-PLAN-AGENTS.md` §11 and `PROGRESS.md`)

> **Final IDs: see 12 Appendix B.** The `NEW-*` IDs in this list are source IDs only; PROGRESS.md and the build loop use the final P0/P1/P2/P3 IDs (or `BG-xx` human gates) given there. Do not rewrite this list.

| ID | Task | Owner | Depends | Acceptance / verify |
|---|---|---|---|---|
| NEW-I18N-01 | Adopt namespace-split message layout (`messages/<locale>/<ns>.json`), `i18n/namespaces.ts` generator; amend 04 §6 tree and i18n-copywriter agent path | sonnet | P0-29 | App loads merged namespaces; `/bn` renders; 04 change-log line |
| NEW-I18N-02 | Routing config: `as-needed`, `localeDetection: false`, language switcher with endonyms, dismissible suggestion banner, persist to `user_profile.locale` | sonnet | P0-29 | Playwright: `/` English for `Accept-Language: bn`; banner appears; choice persists |
| NEW-I18N-03 | Create `i18n/glossary.csv` (~150 terms, `locked` flag, `do_not_use`), loaded by R7/R8 and by Haiku prompts | haiku + Bangla editor | P0-29 | 150 rows; editor sign-off; CI parses |
| NEW-I18N-04 | Formatting module `format.ts` + `formats.ts` (numbers, money, dates, lists) with explicit `numberingSystem`; digit preference context; `nfExam()` hard-Latin | sonnet | P0-29, F-ACC-08 | Snapshot tests: Latin default in `bn`; BDT lakh grouping; Asia/Dhaka; 12-hour |
| NEW-I18N-05 | ESLint rules: no literal strings (R14), ban `next/link`/`toLocaleString`/`Intl.*` outside format module (R15) | sonnet | NEW-I18N-04 | Lint fails on seeded violations |
| NEW-I18N-06 | `pnpm i18n:check` suite implementing R1 to R13, plus `i18n:sort`, `i18n:prune`; status files (`i18n/status/*.json`) | sonnet | NEW-I18N-01 | Each rule has a failing and a passing fixture |
| NEW-I18N-07 | Typed message keys (`Messages` from `en`) and runtime Sentry reporting of missing keys | sonnet | NEW-I18N-01 | `t('nope')` fails `tsc`; prod logs `i18n.missing` |
| NEW-I18N-08 | Playwright i18n suite: hreflang (R16), 320 px overflow sweep, visual baselines (R17), axe on `/bn` | qa-engineer (sonnet) | P0-42, P0-48 | CI job `i18n-e2e` green; baselines approved |
| NEW-I18N-09 | SMS and email Bangla policy: template register (OTP short English default), segment calculator in tests, email font-stack test | sonnet + founder | P1 SMS | Template register in 29/10; calculator unit tests |
| NEW-I18N-10 | SEO helper `buildAlternates`, sitemap alternates, 404 for unpublished bn content; revisit-slug note | sonnet | P0-42 | Playwright R16; sitemap validator |
| NEW-I18N-11 | Translation workflow runbook + roster file (`docs/i18n/ROSTER.md`), GitHub labels (`i18n`, `bn-approved`), PR template with bn checklist, CODEOWNERS entry for `messages/bn/**` (editor) | haiku | P0-29 | Template present; CODEOWNERS valid |
| NEW-I18N-12 | Haiku batch translation runner (`tooling/scripts/i18n-draft.ts` or agent prompt in 13) with glossary + TM, idempotent, per-item output files, counts report | sonnet | NEW-I18N-03 | Re-run is a no-op; report shows created/skipped/failed |
| NEW-I18N-13 | Bangla font fallback stack verification on Android/Windows without webfonts; document results in 08 | qa-engineer | P0-26 | Screenshots without tofu |
| NEW-I18N-14 | "Report a translation issue" link + GitHub issue template | haiku | P0-28 | Link on `/bn` footer |
| NEW-I18N-15 | AI feedback language policy implementation: `evaluation_result.locale`, "Explain in Bangla" toggle, Bangla test set hooks (31) | sonnet + opus review | P1 AI eval | Toggle returns Bangla summary/tips only; eval set passes threshold |
| NEW-I18N-16 | Lesson localisation fields: course "Instruction language" and "Captions available" badges; publish validator for "Bangla-ready" | sonnet | P1 CMS | Publish blocked when flagged Bangla-ready with missing `bn` |
| NEW-I18N-17 | Tolgee/Weblate evaluation spike (time-boxed 1 day) at 2,500 strings or second translator | sonnet | trigger | ADR with decision |

### 16.2 Cross-doc edits triggered
- `00-DECISIONS.md` Change Log (founder-approved only): note `localeDetection: false` and slug policy if accepted.
- `04-ARCHITECTURE.md` §6 tree: namespace layout (NEW-I18N-01).
- `08-UI-UX-DESIGN-SYSTEM.md` §2.2.2: add fallback-font row and `hyphens: none`; link here.
- `03-PRODUCT-SPEC.md` L-05: link here for the numbering-system trap; F-ACC-08 setting name "Use Bangla numerals".
- `12-BUILD-PLAN-AGENTS.md`: P0-29 acceptance gains "`pnpm i18n:check` in `verify`"; P1-46 acceptance gains "editor approval gate".
- `25-GAP-AUDIT.md`: mark GA-034 addressed by 33 (plus open decisions below).
- `28-FOUNDER-SETUP-AND-ENVIRONMENTS.md`: i18n Ally extension (2.6); smoke script could add `smoke:i18n`.

### 16.3 Decisions needed from the founder / Bangla editor

| # | Decision | Recommendation |
|---|---|---|
| 1 | Honorific for minors and Foundation track | আপনি in the product; তুমি only in beginner lesson copy if the founder wants warmth (section 9.2) |
| 2 | Automatic language redirect | Off; suggestion banner instead (section 2.2) |
| 3 | Staff tools in Bangla at P1 | English-only for `admin`, `staff`, `org` until a staff member needs bn |
| 4 | Bangla slugs | No; identical ASCII slugs (section 12.3) |
| 5 | Bangla gloss style for exam terms | Tooltip + first-mention help, not inline parentheses (section 9.3) |
| 6 | OTP SMS language | Short English default; Bangla only when gateway-approved template exists (section 11.5) |
| 7 | AI feedback language | English default + optional "Explain in Bangla" (section 11.4) |
| 8 | Translation tool | i18n Ally + PR review now; Tolgee when triggers hit (section 15.1) |
| 9 | Who is the first Bangla editor and rate | Founder at first; hire a freelance editor before launch tier A/B (section 8.1) |
| 10 | Brand name in Bangla script (`nameBn`) | Decide when the brand is final; until then English everywhere (placeholder) |
