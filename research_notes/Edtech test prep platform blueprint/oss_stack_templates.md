# Open-source infrastructure, templates and frameworks for an e-learning + mock-test platform (as of 2026-11-07)

Scope note: about 30 tool calls were used. Several GitHub pages returned no release or date data, so those are listed as Gaps. Nothing here is from memory unless marked "unverified".

## 1. Open-source LMS projects

### Takeaway
Every serious open-source LMS is AGPL or GPL. A fork would force source disclosure of modifications (AGPL covers network use). No LMS has an IELTS/GRE CBT engine. The cleaner path for a mock-test differentiator is a custom app. Borrow ideas from LearnHouse or ClassroomIO, and do not fork them.

### Cited Findings
- LearnHouse: 2.2k stars, 527 forks, AGPL-3.0. Enterprise features sit under a separate Enterprise License. — [GitHub](https://github.com/learnhouse/learnhouse)
- LearnHouse stack: Next.js, React, Tailwind, Tiptap on the web. The API is FastAPI, Python, SQLModel and Alembic. It also uses Hocuspocus/Yjs, PostgreSQL, Redis, Docker and S3. — [GitHub](https://github.com/learnhouse/learnhouse)
- LearnHouse features: courses, block editor, assignments, discussions, certificates, code execution with auto-grading in 30+ languages, analytics and user groups. Payments, SSO and multi-organization support are enterprise-only. — [GitHub](https://github.com/learnhouse/learnhouse)
- ClassroomIO: 1.7k stars, AGPL-3.0. Stack is SvelteKit, Hono, PostgreSQL, Better Auth and Tailwind. It offers cohorts, certificates, a REST API with webhooks, an AI tutor and an MCP server. — [GitHub](https://github.com/classroomio/classroomio)
- Frappe LMS: 3.4k stars, AGPL-3.0. Built on the Frappe framework with a Vue-based UI (Frappe UI). Has course/chapter/lesson structure, quizzes (single-choice, multiple-choice, open-ended), assignments, Zoom live classes and certificates. — [GitHub](https://github.com/frappe/lms)
- Open edX (edx-platform): about 8.2k stars, AGPL-3.0. — [GitHub](https://github.com/openedx/edx-platform)
- Canvas LMS (Instructure): 6.8k stars, AGPL-3.0. The repo shows Ruby (Gemfile) plus JS tooling, Docker and Jenkins. — [GitHub](https://github.com/instructure/canvas-lms)
- Moodle: about 7.6k stars, GPL-3.0. — [GitHub](https://github.com/moodle/moodle)

### Inferences
- AGPL/GPL (LearnHouse, ClassroomIO, Frappe LMS, Open edX, Canvas, Moodle) means a hosted fork must publish its modified source to users. That conflicts with a proprietary mock-test engine unless the engine is a separate service communicating over an API (a legal-review point, not settled here).
- Canvas, Moodle and Open edX are heavy (Ruby, PHP, Django). They are poor fits for Apple-grade UX and for AI-agent customisation.
- ClassroomIO (SvelteKit/Hono/Better Auth) and LearnHouse (Next.js) are the closest to a modern stack. Their UI and data models are useful references only.
- Chamilo, Sakai, Tutor LMS and LearnDash were not researched (GPL/WordPress-based, unverified).

### Gaps
- Last release dates and recent commit activity were not shown on the GitHub pages for any LMS.
- Not researched: Chamilo, Sakai, Tutor LMS, LearnDash, and newer Next.js LMS projects beyond LearnHouse.
- No evidence found of any open-source IELTS/GRE CBT engine.

## 2. Starter kits / templates

### Takeaway
Free MIT options exist. Open SaaS is MIT, has an active Wasp ecosystem and explicit AI-agent support. Vercel's old subscription starter is archived. Paid kits (Supastarter, Makerkit, Shipfast) were not verified.

### Cited Findings
- Open SaaS (Wasp): 15.5k stars, MIT. Stack is React, Node and Prisma. It includes Google/GitHub login, Stripe/Polar/Lemon Squeezy payments, shadcn UI with an admin dashboard, S3 uploads, background jobs, Playwright tests, agent guidance files and a Claude Code plugin. Deploys to Railway or Fly.io. — [GitHub](https://github.com/wasp-lang/open-saas)
- vercel/nextjs-subscription-payments: 7.7k stars, MIT, archived on 2025-01-23 and replaced by nextjs/saas-starter. — [GitHub](https://github.com/vercel/nextjs-subscription-payments)

### Inferences
- Open SaaS is attractive for AI-agent builds, but it ties you to the Wasp framework instead of plain Next.js.
- A plain Next.js + shadcn/ui + Better Auth + Drizzle/Prisma setup is likely best supported by coding agents (inference from library popularity, not tested).

### Gaps
- Not verified: create-t3-app, Supastarter, Makerkit, Shipfast, shadcn/ui blocks, Origin UI, Magic UI, Aceternity, Tremor licensing and status, and Tailwind v4 status.

## 3. Current versions and security

### Takeaway
Next.js is on the 16.x line. Latest stable seen is v16.4.3 (23 October, year not shown; a v16.5.0 canary exists). Next.js has had repeated serious advisories, so pin patched versions and never use middleware/proxy as the sole authorization layer.

### Cited Findings
- Latest stable seen: v16.4.3, "Latest" badge, published 23 October. Year not shown. Newest overall is canary v16.5.0-canary.29 (27 October). — [GitHub releases](https://github.com/vercel/next.js/releases)
- Next.js 16 changes: `middleware.ts` renamed to `proxy.ts`; Cache Components with the `use cache` directive; `updateTag()`. — [Auth0](https://auth0.com/blog/whats-new-nextjs-16/)
- React2Shell, CVE-2025-55182: maximum-severity RCE in React Server Components. Disclosed December 3 (2025), reported November 29 via Meta's bug bounty. Affects react-server-dom packages in React 19.0, 19.1.0, 19.1.1 and 19.2.0. Patched in React 19.0.1, 19.1.2, 19.2.1 and Next.js 15.0.5, 15.1.9, 15.2.6, 15.3.6, 15.4.8, 15.5.7 and 16.0.7. — [Xygeni](https://xygeni.io/blog/react2shell-cve-2025-55182-and-the-next-js-rce-risk/)
- Next.js 16.2.6 / 15.5.18 (2026-05-07) fixed 13 advisories (7 High). They include a middleware/proxy authorization bypass via `.rsc` segment-prefetch URLs (GHSA-267c-6grr-h53f, CVSS 7.5, affects 15.2.0 to below 15.5.16 and 16.0.0 to below 16.2.5), an RSC DoS (CVE-2026-23870) and a WebSocket SSRF (self-hosted only). The advice is to enforce authorization at the route or page level. — [lilting.ch](https://lilting.ch/en/articles/nextjs-security-release-16-2-6-15-5-18)
- Next.js 16.3.3 / 15.5.24 (2026-08-25) fixed two critical RCEs: a Windows path traversal (CVE-2026-75604, CVSS 9.0) and an AVIF image optimization RCE via Sharp/libheif (GHSA-2xp9-vwfh-vxw4, CVSS 9.5). The patch temporarily disables AVIF optimization. — [Teramont](https://teramont.net/blog/nextjs-16-3-3-15-5-24-critical-rce) (single secondary source)
- A Next.js security release was pre-announced for 2026-09-22. — [nextjs.org](https://nextjs.org/blog/upcoming-nextjs-security-release-september-22-2026) (title only seen in search; content not read)
- Prisma 7: Rust-free client is the default (generator `prisma-client`, output path required); Prisma claims ~90% smaller bundles and up to 3x faster queries. Driver adapters are required (e.g. `@prisma/adapter-pg`). Config moved to `prisma.config.ts`. Env vars are no longer auto-loaded. — [Prisma changelog 2025-11-19](https://www.prisma.io/changelog/2025-11-19)

### Inferences
- The CVE-2025-29927 middleware bypass was not fetched. The 2026 `.rsc` prefetch bypass shows the same lesson: do auth checks in the data-access layer and route handlers.
- Vendor claims for Prisma 7 speed are Prisma's own, not independent.

### Gaps
- Not verified: Tailwind v4 status, React 19.x current minor, Drizzle vs Prisma comparison, PostgreSQL 18 details (postgresql.org fetch failed), tRPC vs server actions vs Hono.
- Year of the v16.4.3 release is unconfirmed.

## 4. Auth libraries

### Takeaway
Better Auth (MIT) is the recommended default for a self-owned Postgres. The Auth.js team handed maintenance to Better Auth in September 2025, and Vercel acquired Better Auth in July 2026. Lucia is deprecated.

### Cited Findings
- 2025-09-22: Better Auth's team took over maintaining Auth.js. Auth.js receives security patches and urgent fixes; new projects are told to use Better Auth, except where stateless sessions without a database are needed. — [Better Auth blog](https://better-auth.com/blog/authjs-joins-better-auth)
- 2026-07-07: Vercel announced it is acquiring Better Auth. The library stays MIT, keeps its name and keeps community governance. — [Vercel blog](https://vercel.com/blog/vercel-acquires-better-auth)
- Better Auth GitHub: 29.5k stars, MIT. — [GitHub](https://github.com/better-auth/better-auth)
- ClassroomIO already uses Better Auth in production. — [GitHub](https://github.com/classroomio/classroomio)
- Lucia: deprecated March 2025, README points to a single-file replacement; 10.5k stars, MIT. — [GitHub](https://github.com/lucia-auth/lucia)
- Clerk: Hobby is free with 50,000 monthly retained users. Pro is $20/month billed annually or $25 monthly, with MFA included; extra users cost $0.02 each for 50,001-100,000. The B2B Enhanced add-on (custom roles and more) is $100/month. — [Clerk pricing](https://clerk.com/pricing)

### Inferences
- Vercel ownership raises a modest vendor-influence risk but keeps the MIT licence. Better Auth stores data in your own Postgres, which fits the cost and ownership goals.
- Clerk's custom roles sit behind a paid add-on, which makes it a weaker fit for a cost-sensitive Bangladesh startup.

### Gaps
- Better Auth plugin list (admin, organization, 2FA, passkey, rate-limit) and latest version were not confirmed from sources.
- Supabase Auth and Keycloak were not researched.

## 5. Backend / hosting

### Takeaway
Vercel Hobby cannot be used commercially. Supabase Free pauses inactive projects. A Hetzner VPS (Singapore exists) with R2 storage is the cheapest credible production path.

### Cited Findings
- Vercel Hobby is for personal, non-commercial use only. Pro is $20/month per developer seat with a $20 usage credit. — [Vercel pricing](https://vercel.com/pricing)
- Supabase: Free is $0 (500 MB database, 50k MAU, 1 GB storage, 5 GB egress; paused after 1 week of inactivity, max 2 projects). Pro starts at $25/month (8 GB database, 100k MAU, 100 GB storage, 250 GB egress). Team starts at $599/month. — [Supabase pricing](https://supabase.com/pricing)
- Cloudflare R2: $0.015/GB-month, free egress, free tier of 10 GB, 1M Class A and 10M Class B operations per month. — [Cloudflare docs](https://developers.cloudflare.com/r2/pricing/)
- Hetzner Cloud: regions include Singapore. Plans start at €5.99/month (Cost-Optimized, shown unavailable) and €6.49/month (Regular Performance), excl. VAT. — [Hetzner](https://www.hetzner.com/cloud/)

### Gaps
- Not researched: Neon, Railway, Fly.io, Render, Cloudflare Workers, Coolify/Dokploy, and measured latency from Bangladesh to Singapore or Mumbai.
- Whether Singapore offers the cheap shared plans is unconfirmed.

## 6. Supporting services

### Takeaway
Speech-to-text for IELTS speaking is cheap: roughly $0.003 to $0.009 per minute. Most other services in this section were not researched.

### Cited Findings
- OpenAI: gpt-4o-transcribe $0.006/min; gpt-4o-mini-transcribe $0.003/min; gpt-realtime-whisper $0.017/min. — [OpenAI pricing](https://developers.openai.com/api/docs/pricing)
- Deepgram Nova-3: $0.0077/min monolingual, $0.0092/min multilingual; $200 free credit. — [Deepgram](https://deepgram.com/pricing)
- AssemblyAI: pre-recorded $0.15/hr (Universal-2) or $0.21/hr (Universal-3.5 Pro); streaming $0.15/hr to $0.45/hr; free credits of 185 hours pre-recorded and 333 hours streaming. — [AssemblyAI](https://www.assemblyai.com/pricing)

### Inferences
- A 15-minute speaking mock costs well under $0.15 with any of these providers.
- Note that Deepgram's "$200 ≈ 43,000 minutes" claim does not match its listed rate (about 26,000 minutes), so treat that estimate cautiously.

### Gaps
- Not researched: Meilisearch/Typesense, Inngest/Trigger.dev/BullMQ/pg-boss, Resend/SES/Postmark, PostHog/Plausible/Umami, Sentry, Tiptap/Plate/BlockNote, KaTeX, Sandpack/JupyterLite/Pyodide, MediaRecorder browser support, Google STT pricing.
