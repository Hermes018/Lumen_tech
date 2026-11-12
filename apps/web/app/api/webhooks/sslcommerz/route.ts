/** @purpose Instant Payment Notification (IPN) webhook handler with authoritative secondary order validation */

import { NextResponse } from 'next/server';
import {
  SslcommerzProvider,
  fulfillOrder,
} from '@lumen/core';

export async function POST(req: Request) {
  try {
    const rawBody = await req.text();
    const provider = new SslcommerzProvider();

    // 1. Parse incoming notification
    const parsed = await provider.parseWebhook({ rawBody });
    const { tran_id, val_id } = parsed.payload;

    if (!tran_id || !val_id) {
      return NextResponse.json(
        { error: 'Missing tran_id or val_id in IPN body' },
        { status: 400 }
      );
    }

    // 2. Execute authoritative secondary order validation API call (docs/10 §3.3)
    // Server-to-server check directly with SSLCommerz API
    const fulfillment = await fulfillOrder(tran_id, val_id, provider);

    if (fulfillment.success) {
      return NextResponse.json({
        status: 'success',
        tran_id,
        val_id,
        message: 'Payment authoritatively verified and entitlements granted',
        entitlementId: fulfillment.entitlement?.id,
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
    const message = error instanceof Error ? error.message : 'Unknown IPN webhook error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
