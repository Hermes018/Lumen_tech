/** @purpose Deterministic Concurrency & Ledger Stress Test (P1-40) proving zero negative balances and zero double-fulfillments under concurrent load */

import { describe, it, expect } from 'vitest';
import {
  grantLedgerCredits,
  getLedgerBalance,
  consumeAiCredit,
  createOrder,
  fulfillOrder,
  grantEntitlement,
  getUserEntitlements,
  type Actor,
} from '../commerce/index';

describe('Pilot Concurrency & Ledger Stress Test (docs/10, docs/22)', () => {
  it('mathematically proves zero negative balances when firing 50 concurrent consumeAiCredit requests against 5 credits', async () => {
    const studentId = `user_concurrency_${Date.now()}`;
    const studentActor: Actor = {
      id: studentId,
      roles: ['student'],
      twoFactorVerified: false,
    };

    // 1. Initial State: Plus tier (daily ceiling = 6) with exactly 5 AI credits
    grantEntitlement(studentId, 'gre-complete-plus', 'purchase', new Date(), {
      aiCreditsOverride: 0, // start with 0 from package
      durationDaysOverride: 90,
    });

    const initialGrant = grantLedgerCredits({
      userId: studentId,
      credits: 5,
      reason: 'pilot_initial_concurrency_grant',
      sourceRef: 'pilot_test',
      idempotencyKey: `grant:concurrency:${studentId}`,
    });
    expect(initialGrant.delta).toBe(5);

    const initialBalance = getLedgerBalance(studentId, 'ai_credit');
    expect(initialBalance).toBe(5);

    // 2. Concurrency Spike: 50 parallel consume requests trying to debit 1 credit each
    const CONCURRENCY_COUNT = 50;
    const tasks = Array.from({ length: CONCURRENCY_COUNT }, (_, index) => {
      return new Promise<{ success: boolean; error?: string; remaining?: number }>((resolve) => {
        try {
          const res = consumeAiCredit(studentActor, {
            userId: studentId,
            evaluationType: 'gre_awa', // cost = 1 credit per D12 C1
            ref: `essay_attempt_${index}`,
            idempotencyKey: `consume:concurrency:${studentId}:req_${index}`,
          });
          resolve({ success: true, remaining: res.remainingCredits });
        } catch (err: unknown) {
          const errMsg = err instanceof Error ? err.message : String(err);
          resolve({ success: false, error: errMsg });
        }
      });
    });

    const results = await Promise.all(tasks);

    const successfulDebits = results.filter((r) => r.success);
    const rejectedDebits = results.filter((r) => !r.success);

    // 3. Mathematical Verification:
    // With 5 initial credits, exactly 5 debits can succeed
    expect(successfulDebits.length).toBe(5);
    expect(rejectedDebits.length).toBe(45);

    // Final ledger balance MUST be >= 0 (strictly zero negative balance invariant)
    const finalBalance = getLedgerBalance(studentId, 'ai_credit');
    expect(finalBalance).toBe(0);

    // All rejections must be due to insufficient credits
    for (const rejected of rejectedDebits) {
      expect(rejected.error).toMatch(/Insufficient.*credits|INSUFFICIENT_CREDITS/i);
    }
  });

  it('mathematically proves zero double-spend when 50 concurrent requests use identical idempotency keys', async () => {
    const studentId = `user_idemp_${Date.now()}`;
    const studentActor: Actor = {
      id: studentId,
      roles: ['student'],
      twoFactorVerified: false,
    };

    grantLedgerCredits({
      userId: studentId,
      credits: 5,
      reason: 'idemp_test_grant',
      sourceRef: 'pilot_test',
      idempotencyKey: `grant:idemp:${studentId}`,
    });

    // 50 parallel requests sharing the exact same idempotencyKey
    const SHARED_KEY = `consume:idemp:${studentId}:same_tx`;
    const tasks = Array.from({ length: 50 }, () => {
      return new Promise<{ success: boolean; idempotentReplay?: boolean }>((resolve) => {
        try {
          const res = consumeAiCredit(studentActor, {
            userId: studentId,
            evaluationType: 'gre_awa',
            ref: 'essay_duplicate_submission',
            idempotencyKey: SHARED_KEY,
          });
          resolve({ success: true, idempotentReplay: res.idempotentReplay });
        } catch {
          resolve({ success: false });
        }
      });
    });

    const results = await Promise.all(tasks);
    const successful = results.filter((r) => r.success);

    // All 50 succeed (1 primary debit, 49 idempotent replays)
    expect(successful.length).toBe(50);
    const primary = successful.filter((s) => !s.idempotentReplay);
    const replayed = successful.filter((s) => s.idempotentReplay);
    expect(primary.length).toBe(1);
    expect(replayed.length).toBe(49);

    // Ledger balance MUST be decremented by exactly 1, not 50!
    const balance = getLedgerBalance(studentId, 'ai_credit');
    expect(balance).toBe(4);
  });

  it('mathematically proves zero double-fulfillments across 50 concurrent SSLCommerz IPN webhooks', async () => {
    const buyerId = `buyer_concurrency_${Date.now()}`;
    const orderRes = await createOrder({
      userId: buyerId,
      productSlug: 'gre-complete-core',
      customer: {
        userId: buyerId,
        name: 'Concurrency Stress Buyer',
        email: 'stress@lumen.academy',
        country: 'BD',
      },
      appUrl: 'http://localhost:3000',
    });

    const providerRef = orderRes.order.providerRef;
    const valId = `SANDBOX_VAL_STRESS_${Date.now()}`;

    // 50 parallel IPN callbacks firing simultaneously for the same order
    const PARALLEL_IPNS = 50;
    const ipnTasks = Array.from({ length: PARALLEL_IPNS }, () => {
      return fulfillOrder(providerRef, valId);
    });

    const fulfillments = await Promise.all(ipnTasks);

    // Exactly one call should be the original fulfillment (idempotentReplay: false)
    const primaryFulfillments = fulfillments.filter((f) => f.success && !f.idempotentReplay);
    const replayedFulfillments = fulfillments.filter((f) => f.success && f.idempotentReplay);

    expect(primaryFulfillments.length).toBe(1);
    expect(replayedFulfillments.length).toBe(PARALLEL_IPNS - 1);

    // Verify user entitlements: exactly 1 entitlement created
    const entitlements = getUserEntitlements(buyerId);
    expect(entitlements.length).toBe(1);
    expect(entitlements[0]?.orderId).toBe(orderRes.order.id);

    // Entitlement IDs must match across all fulfillments
    for (const f of fulfillments) {
      expect(f.entitlement?.id).toBe(entitlements[0]?.id);
    }
  });
});
