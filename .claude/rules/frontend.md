---
paths:
  - "apps/web/**"
  - "packages/ui/**"
# `paths:` frontmatter = path-scoped rule loading (verify against installed Claude Code version)
---
# Frontend rules (apps/web, packages/ui)
- Tokens and `packages/ui` components only. No arbitrary hex/px, no gradients, no emoji icons (Lucide only). Checklist: docs/12 section 6.1.
- Server Components by default; `"use client"` only for interactivity; no business rules in components (call `packages/core` via actions/route handlers).
- Every data view: empty, loading (skeleton, no layout shift), error-with-retry states. Keyboard + visible focus; axe 0 serious/critical.
- Copy via next-intl keys in `en` and `bn`; never inline strings; no hard-coded brand (use `packages/config/brand.ts`).
- Routes only under the canonical groups in docs/00 D2. Locale `as-needed`.
- Images: next/image with dimensions + alt. Bangla text uses the Bangla font stack and taller line-height.
- Verify: `pnpm --filter @lumen/web typecheck && pnpm --filter @lumen/web test`; visual baselines are updated ONLY in CI Linux (docs/22 section 5.4), never on the Mac.
- Dev servers: one at a time (fanless Mac). Stop `pnpm dev` before running e2e/build.
