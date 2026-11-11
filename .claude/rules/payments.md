---
paths:
  - "packages/core/src/payments/**"
  - "packages/core/src/orders/**"
  - "packages/core/src/entitlements/**"
  - "apps/web/app/api/**/webhooks/**"
  - "apps/web/app/**/(checkout)/**"
---
# Payments / orders / entitlements rules
- Providers hide behind `PaymentProvider`. Hosted checkout only (SAQ-A); never touch card data.
- Webhook/IPN handler order: verify signature or call the provider validation API -> load order by our ID -> re-check amount + currency against OUR order -> idempotency key insert -> apply -> audit. Replay must be a no-op. Forged payload must fail closed.
- Entitlements are the only access check; single choke point; grants carry `starts_at/ends_at/source`. Prices come from the price book server-side, never the client.
- Money in integer minor units; BDT and USD price books; refunds follow D5 (7 days, <20% consumed, no refund on consumed AI credits).
- Sandbox keys only in agent sessions; real keys exist only in Vercel env, never in files, prompts or logs. Log provider event IDs, never PAN-like data or full payloads with PII.
- Provider API shapes (SSLCommerz/Paddle fields, signature algorithm): read the saved docs in `docs/research-cache/` or fetch current vendor docs; if neither is available mark "(verify against installed version / vendor docs)" and stop - do not guess field names.
- Two-key rule (docs/22 section 6.2): Sonnet implements, Opus architect-reviewer approves, then founder is told before merge.
