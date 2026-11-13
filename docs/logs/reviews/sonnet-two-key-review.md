# Two-Key Review (Sonnet 5.5 Low) - Stage 4A

**VERDICT: FAIL (2 critical, 3 medium). Not PASS. Apply diffs below, then re-review.**

## 1. packages/auth/src/server.ts - mostly OK
- `requireServerActor()` enforces 2FA correctly: `roles.some(requiresTwoFactor)` or `requireTwoFactor` throws `2FA_REQUIRED` (L289-295).
- MEDIUM M1: `twoFactorVerified = Boolean(twoFactorEnabled)` (L217-226). It is not a per-session verified flag. Safe only while Better Auth never issues a full session before the 2FA challenge. Flag for two-key follow-up. No mechanical fix.
- MEDIUM M2: dev fallback actor (L239-255) is gated on `NODE_ENV==='development'` and `LUMEN_STRICT_AUTH!=='1'`. Acceptable, but staging must set `LUMEN_STRICT_AUTH=1`.
- The `BETTER_AUTH_SECRET` fallback to a hardcoded dev secret (L23) is a risk in production. Fail closed when `NODE_ENV==='production'`. See diff C.

## 2. SSLCommerz - CRITICAL C1
`verifyPayment` (sslcommerz.ts L271) returns `paid` for any `val_id` starting `SANDBOX_VAL_`. It skips the Order Validation API and takes the amount from the IPN hint. This runs in all environments, including live.
- IPN signature check: `localVerifySign` is correct (MD5 over sorted `verify_key` fields plus md5(store_passwd)). The webhook requires it in production and rejects missing fields.
- Weakness: in non-production with no signature fields the IPN is accepted. With the sandbox bypass, any staging or preview deploy is free-purchasable.
- Also, `createCheckout` falls back to a simulated success URL when the gateway call fails (L179-197), including in live mode.
- MEDIUM M3: `computed === verify_sign` is not a timing-safe compare. Use `timingSafeEqual`.

```diff
--- a/packages/core/src/commerce/sslcommerz.ts
+++ b/packages/core/src/commerce/sslcommerz.ts
@@ verifyPayment
-    if (valId.startsWith('SANDBOX_VAL_')) {
+    if (!this.isLive && process.env.NODE_ENV !== 'production' && valId.startsWith('SANDBOX_VAL_')) {
@@ createCheckout catch / fallthrough (before "Deterministic Sandbox Simulation")
+    if (this.isLive || process.env.NODE_ENV === 'production') {
+      throw new ProviderTransientError('SSLCommerz gateway unavailable');
+    }
@@ localVerifySign tail
-  return computedHash.toLowerCase() === f.verify_sign.toLowerCase();
+  const a = Buffer.from(computedHash.toLowerCase());
+  const b = Buffer.from(f.verify_sign.toLowerCase());
+  return a.length === b.length && timingSafeEqual(a, b);
```
and change the import to `import { createHash, timingSafeEqual } from 'node:crypto';`

## 3. Entitlements / refunds - CRITICAL C2
`executeRefund` calls `revokeEntitlementOnRefund` (refunds.ts L311) **before** `evaluateRefundEligibility` (L329). If the order is ineligible (past 7 days, 20% or more consumed, more than 1 mock), it throws at L347-351. By then the entitlement is already revoked and the remaining credits are zeroed with negative ledger entries. The learner loses access without a refund.
- A retry also reads `consumedAiCredits = 0` (no matched entitlement). It then falls back to the default `aiCreditsIncluded=10` and `fullMocksIncluded=4`, so the consumption checks can be bypassed.
- Fix: make a read-only usage preview, evaluate eligibility, then revoke.

```diff
--- a/packages/core/src/commerce/entitlements.ts
+++ b/packages/core/src/commerce/entitlements.ts
@@ revokeEntitlementOnRefund params
+  dryRun?: boolean;
@@ after `userEntitlementsMap.set(params.userId, updatedList);`
-  userEntitlementsMap.set(params.userId, updatedList);
+  if (!params.dryRun) userEntitlementsMap.set(params.userId, updatedList);
@@ both appendLedgerEntry calls inside the loop
-    if (remainingEntCredits > 0) {
+    if (!params.dryRun && remainingEntCredits > 0) {
@@
-    if (remainingEntMocks > 0) {
+    if (!params.dryRun && remainingEntMocks > 0) {
```
```diff
--- a/packages/core/src/commerce/refunds.ts
+++ b/packages/core/src/commerce/refunds.ts
-  const revokePreview = revokeEntitlementOnRefund({
+  const revokePreview = revokeEntitlementOnRefund({
+    dryRun: true,
     userId: order.userId,
@@ after `if (!eligibility.eligible) { throw ... }`
+  const revoked = revokeEntitlementOnRefund({
+    userId: order.userId, orderId: order.id, entitlementId: order.entitlementId,
+    productSlug: order.productSlug, reason: params.reason, now,
+  });
@@ result
-    revokedEntitlements: revokePreview.revokedEntitlements,
+    revokedEntitlements: revoked.revokedEntitlements,
```
Also reject refunds when `order.status === 'refunded'` or the order is not `paid`. The idempotency map is in memory only.

## 4. Ledger observations
- 7-day / under-20% rule: window and `consumedPct >= 0.20` and `>1 mock` are enforced strictly. Consumed AI credits are **deducted** (D5 pro-rata), not a hard block. That matches the code comment, but not the "strictly block" wording in the stage prompt. Confirm against D5; no change made.
- MEDIUM M4: ledger persistence is `void repo.save()` with swallowed errors (entitlements.ts L151-165, L263-267). `balanceAfter` is stored as `delta`. State lives in in-memory Maps, so the balance is lost on restart and across instances. The "double spend" guard (`activeUserLocks`, sync) is only process-local. Before production it needs a DB unique index on `idempotency_key` and a transactional `SELECT ... FOR UPDATE` balance check. Log in HANDOFF "Needs two-key review".
- Idempotency keys are global (not per-user). A caller-chosen key can collide with another user's debit and return their entry. Namespace keys as `${userId}:${key}`.

## Diff C (auth secret)
```diff
--- a/packages/auth/src/server.ts
+++ b/packages/auth/src/server.ts
-    secret: options.secret || process.env.BETTER_AUTH_SECRET || 'dev_secret_at_least_32_characters_long_lumen_auth',
+    secret: options.secret || process.env.BETTER_AUTH_SECRET || (process.env.NODE_ENV === 'production'
+      ? (() => { throw new Error('BETTER_AUTH_SECRET is required in production'); })()
+      : 'dev_secret_at_least_32_characters_long_lumen_auth'),
```
(Env access should move to `packages/config/env.ts` per the rules.)
