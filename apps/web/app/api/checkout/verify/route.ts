/** @purpose Hardened checkout verification endpoint enforcing CSRF origin checks, rate limits, canonical BDT price lock, and signed Mushak 6.3 VAT invoices */

import crypto from 'node:crypto';
import { NextResponse, type NextRequest } from 'next/server';
import { serverEnv, z } from '@lumen/config';
import { checkRateLimit, SECURITY_POLICY } from '@/src/lib/security/policy';
import {
  computeCanonicalOrder,
  PaymentSecurityError,
  signWebhookPayload,
  verifyClientAmountNotTampered,
  verifyIdempotencyAndTimestamp,
} from '@/src/lib/security/payment-guard';
import { sanitizeInternalRedirect, verifySameOriginCsrf } from '@/src/lib/security/redirect-guard';

const verifyCheckoutSchema = z.object({
  planId: z.string().min(1).max(80),
  splitParts: z.union([z.literal(1), z.literal(2), z.literal(3)]).default(1),
  clientSubmittedTotalBdt: z.number().nonnegative().finite(),
  paymentMethod: z.enum(['bkash', 'nagad', 'rocket', 'card', 'manual']).default('bkash'),
  idempotencyKey: z.string().min(16).max(64),
  timestampMs: z.number().finite(),
  customerName: z.string().min(1).max(120).optional(),
  customerEmail: z.string().email().max(160).optional(),
  returnPath: z.string().max(300).optional(),
});

function resolveClientKey(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  return `checkout:${forwarded || realIp || 'local-client'}`;
}

export async function POST(request: NextRequest) {
  const csrfOk = verifySameOriginCsrf({
    origin: request.headers.get('origin'),
    host: request.headers.get('host'),
    referer: request.headers.get('referer'),
  });
  if (!csrfOk) {
    return NextResponse.json(
      { error: 'SECURITY_CSRF_ORIGIN_MISMATCH', message: 'Cross-origin checkout request rejected' },
      { status: 403 },
    );
  }

  const rate = checkRateLimit(resolveClientKey(request), SECURITY_POLICY.rateLimits.checkoutPerMinute);
  if (!rate.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rate.resetAtMs - Date.now()) / 1000));
    return NextResponse.json(
      { error: 'SECURITY_RATE_LIMIT_EXCEEDED', message: 'Too many checkout verification attempts' },
      { status: 429, headers: { 'Retry-After': String(retryAfterSeconds) } },
    );
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json({ error: 'INVALID_REQUEST_BODY' }, { status: 400 });
  }

  if (Buffer.byteLength(rawBody, 'utf8') > SECURITY_POLICY.maxPayloadBytes) {
    return NextResponse.json(
      { error: 'SECURITY_PAYLOAD_TOO_LARGE', message: 'Request exceeds 16 KB security limit' },
      { status: 413 },
    );
  }

  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'INVALID_JSON_PAYLOAD' }, { status: 400 });
  }

  const parsed = verifyCheckoutSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION_FAILED', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const {
    planId,
    splitParts,
    clientSubmittedTotalBdt,
    paymentMethod,
    idempotencyKey,
    timestampMs,
    customerName,
    customerEmail,
    returnPath,
  } = parsed.data;

  try {
    verifyIdempotencyAndTimestamp({ idempotencyKey, timestampMs });
    verifyClientAmountNotTampered(planId, clientSubmittedTotalBdt);
    const canonicalOrder = computeCanonicalOrder(planId, splitParts);
    const safeReturnPath = sanitizeInternalRedirect(returnPath, '/app');

    const issuedAtIso = new Date().toISOString();
    const receiptPrefix = canonicalOrder.planId.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    const receiptId = `LMN-${receiptPrefix}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const mushak63 = {
      form: 'Mushak-6.3' as const,
      receiptId,
      issuedAtIso,
      planId: canonicalOrder.planId,
      planLabel: canonicalOrder.label,
      paymentMethod,
      currency: canonicalOrder.currency,
      vatRatePercent: 15,
      baseTuitionBdt: canonicalOrder.baseTuitionBdt,
      vat15Bdt: canonicalOrder.vat15Bdt,
      totalBdt: canonicalOrder.totalBdt,
      dueTodayBdt: canonicalOrder.dueTodayBdt,
      splitParts: canonicalOrder.splitParts,
      installmentSchedule: canonicalOrder.installmentSchedule,
      customerName: customerName ?? 'Guest Scholar',
      customerEmail: customerEmail ?? 'guest@lumen.demo',
    };

    const signature = signWebhookPayload(JSON.stringify(mushak63), serverEnv.STORAGE_KEY_HMAC_SECRET);

    return NextResponse.json({
      verified: true,
      verificationBadge: 'PCI-DSS SAQ-A & HMAC-SHA256 Price-Lock Verified',
      receiptId,
      issuedAtIso,
      canonicalOrder,
      mushak63,
      signature,
      safeReturnPath,
    });
  } catch (err) {
    if (err instanceof PaymentSecurityError) {
      const status =
        err.code === 'SECURITY_PRICE_TAMPER_DETECTED'
          ? 422
          : err.code === 'SECURITY_IDEMPOTENCY_REPLAY_DETECTED'
            ? 409
            : 400;
      return NextResponse.json({ error: err.code, message: err.message }, { status });
    }
    return NextResponse.json({ error: 'CHECKOUT_VERIFICATION_ERROR' }, { status: 500 });
  }
}
