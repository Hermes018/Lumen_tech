/** @purpose Instant Payment Notification (IPN) webhook handler with cryptographic signature check, secondary order validation API, and idempotency guard */

import { NextResponse } from 'next/server';
import { z } from '@lumen/config';
import {
  SslcommerzProvider,
  fulfillOrder,
  localVerifySign,
  ProviderPermanentError,
} from '@lumen/core';

const sslcommerzIpnSchema = z.object({
  tran_id: z.string().min(1).max(60),
  val_id: z.string().min(1),
  status: z.string().optional(),
  amount: z.string().optional(),
  currency: z.string().optional(),
  currency_type: z.string().optional(),
  verify_sign: z.string().optional(),
  verify_key: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const formRecord = Object.fromEntries(new URLSearchParams(rawBody));

    // 1. Validate IPN body structure via Zod
    const parsedInput = sslcommerzIpnSchema.safeParse(formRecord);
    if (!parsedInput.success) {
      return NextResponse.json(
        { error: 'Invalid or incomplete IPN payload: missing tran_id or val_id' },
        { status: 400 }
      );
    }

    const provider = new SslcommerzProvider();
    const requireSignature =
      process.env.NODE_ENV === 'production' ||
      Boolean(formRecord.verify_sign || formRecord.verify_key);

    // 2. Enforce cryptographic verify_sign/verify_key hash verification (docs/10 §3.3)
    if (requireSignature && !localVerifySign(formRecord, provider.getStorePassword())) {
      return NextResponse.json(
        { error: 'Invalid SSLCommerz IPN cryptographic signature (verify_sign)' },
        { status: 401 }
      );
    }

    const parsed = await provider.parseWebhook({ rawBody, requireSignature });
    const { tran_id, val_id, amount, currency } = parsed.payload;

    if (!tran_id || !val_id) {
      return NextResponse.json(
        { error: 'Missing tran_id or val_id in IPN body' },
        { status: 400 }
      );
    }

    // 3. Execute authoritative secondary order validation API call (docs/10 §3.3)
    // Enforces exact amount_minor + currency match and idempotency on tran_id
    const fulfillment = await fulfillOrder(tran_id, val_id, provider, {
      ...(amount ? { amount } : {}),
      ...(currency ? { currency } : {}),
    });

    if (fulfillment.success) {
      return NextResponse.json({
        status: 'success',
        tran_id,
        val_id,
        idempotentReplay: Boolean(fulfillment.idempotentReplay),
        message: fulfillment.idempotentReplay
          ? 'Duplicate IPN ignored; order already fulfilled'
          : 'Payment authoritatively verified and entitlements granted',
        entitlementId: fulfillment.entitlement?.id ?? fulfillment.order?.entitlementId,
      });
    }

    return NextResponse.json(
      {
        status: 'unverified',
        tran_id,
        val_id,
        failureReason: fulfillment.payment.failureReason ?? 'verification_failed',
      },
      { status: 422 }
    );
  } catch (error) {
    if (error instanceof ProviderPermanentError) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    const message = error instanceof Error ? error.message : 'Unknown IPN webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
