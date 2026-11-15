/** @purpose Enterprise Admin ERP & Catalog runtime API (GET/POST) protected by same-origin CSRF, sliding-window rate limits, and strict Zod schemas */

import { NextResponse, type NextRequest } from 'next/server';
import { z } from '@lumen/config';
import { checkRateLimit, SECURITY_POLICY } from '@/src/lib/security/policy';
import {
  addRuntimePlan,
  applyRuntimeCmsUpdate,
  applyRuntimeOrderAction,
  applyRuntimeScholarAction,
  getRuntimeCatalog,
  PaymentSecurityError,
  resetRuntimeCatalogToDefaults,
  toggleRuntimeFeatureFlag,
  toggleRuntimePromoCode,
  updateRuntimeFeeRates,
  updateRuntimePlan,
  updateRuntimePsychometricStrictness,
  upsertRuntimePromoCode,
} from '@/src/lib/security/payment-guard';
import { verifySameOriginCsrf } from '@/src/lib/security/redirect-guard';

export const dynamic = 'force-dynamic';

const updatePlanSchema = z.object({
  action: z.literal('UPDATE_PLAN'),
  planId: z.string().min(1).max(80),
  baseBdt: z.number().nonnegative().finite().optional(),
  baseUsd: z.number().nonnegative().finite().optional(),
  nameEn: z.string().min(1).max(120).optional(),
  nameBn: z.string().min(1).max(120).optional(),
  featuresEn: z.array(z.string().min(1).max(160)).max(12).optional(),
  featuresBn: z.array(z.string().min(1).max(160)).max(12).optional(),
  allowSplit: z.boolean().optional(),
  active: z.boolean().optional(),
  fullMocks: z.number().int().nonnegative().max(200).optional(),
  aiCredits: z.number().int().nonnegative().max(500).optional(),
});

const addPlanSchema = z.object({
  action: z.literal('ADD_PLAN'),
  planId: z.string().min(2).max(80),
  nameEn: z.string().min(2).max(120),
  nameBn: z.string().min(1).max(120).optional(),
  baseBdt: z.number().nonnegative().finite(),
  baseUsd: z.number().nonnegative().finite(),
  featuresEn: z.array(z.string().min(1).max(160)).max(12).optional(),
  featuresBn: z.array(z.string().min(1).max(160)).max(12).optional(),
  allowSplit: z.boolean().optional(),
  fullMocks: z.number().int().nonnegative().max(200).optional(),
  aiCredits: z.number().int().nonnegative().max(500).optional(),
});

const updateFeesSchema = z.object({
  action: z.literal('UPDATE_FEES'),
  split2Rate: z.number().min(0).max(0.25).finite().optional(),
  split3Rate: z.number().min(0).max(0.25).finite().optional(),
  vatRateBdt: z.number().min(0).max(0.35).finite().optional(),
});

const upsertPromoSchema = z.object({
  action: z.literal('UPSERT_PROMO'),
  code: z.string().min(2).max(32),
  discountType: z.enum(['percent', 'fixed']),
  value: z.number().positive().finite(),
  active: z.boolean().optional(),
  labelEn: z.string().max(120).optional(),
  labelBn: z.string().max(120).optional(),
  maxRedemptions: z.number().int().positive().nullable().optional(),
  expiresAt: z.string().max(40).nullable().optional(),
});

const togglePromoSchema = z.object({
  action: z.literal('TOGGLE_PROMO'),
  code: z.string().min(2).max(32),
  active: z.boolean().optional(),
});

const orderActionSchema = z.object({
  action: z.literal('ORDER_ACTION'),
  orderId: z.string().min(2).max(60),
  operation: z.enum(['refund', 'mark_paid', 'issue_mushak']),
  corporateBin: z.string().max(40).optional(),
});

const cmsUpdateSchema = z.discriminatedUnion('kind', [
  z.object({
    action: z.literal('CMS_UPDATE'),
    kind: z.literal('top_ribbon'),
    enabled: z.boolean(),
    textEn: z.string().min(1).max(240),
    textBn: z.string().min(1).max(240),
    ctaLabelEn: z.string().max(60).optional(),
    ctaLabelBn: z.string().max(60).optional(),
    ctaHref: z.string().max(120).optional(),
  }),
  z.object({
    action: z.literal('CMS_UPDATE'),
    kind: z.literal('moderate'),
    submissionId: z.string().min(2).max(60),
    decision: z.enum(['approve', 'revision', 'remove']),
    feedbackNote: z.string().max(300).optional(),
  }),
  z.object({
    action: z.literal('CMS_UPDATE'),
    kind: z.literal('upsert_item'),
    item: z.object({
      id: z.string().min(2).max(60),
      kind: z.enum(['vocab', 'faq']),
      titleEn: z.string().min(1).max(160),
      titleBn: z.string().min(1).max(160),
      bodyEn: z.string().min(1).max(500),
      bodyBn: z.string().min(1).max(500),
      active: z.boolean(),
    }),
  }),
]);

const scholarActionSchema = z.object({
  action: z.literal('SCHOLAR_ACTION'),
  scholarId: z.string().min(2).max(60),
  operation: z.enum(['extend_30d', 'grant_ai_credits', 'reset_diagnostic', 'switch_cohort']),
  credits: z.number().int().positive().max(100).optional(),
  cohort: z.string().min(2).max(120).optional(),
});

const toggleFlagSchema = z.object({
  action: z.literal('TOGGLE_FLAG'),
  flag: z.enum([
    'translateBudgetGuard',
    'guestCheckoutEnabled',
    'splitPayEnabled',
    'maintenanceBanner',
    'aiStrictnessLevel',
  ]),
  value: z.union([z.boolean(), z.enum(['standard', 'strict', 'lenient'])]).optional(),
});

const psychometricUpdateSchema = z.object({
  action: z.literal('PSYCHOMETRIC_UPDATE'),
  itemId: z.string().min(2).max(60),
  aiStrictness: z.enum(['Standard', 'Strict', 'Calibrated']),
});

const resetDefaultsSchema = z.object({
  action: z.literal('RESET_DEFAULTS'),
});

const adminCatalogActionSchema = z.union([
  updatePlanSchema,
  addPlanSchema,
  updateFeesSchema,
  upsertPromoSchema,
  togglePromoSchema,
  orderActionSchema,
  cmsUpdateSchema,
  scholarActionSchema,
  toggleFlagSchema,
  psychometricUpdateSchema,
  resetDefaultsSchema,
]);

function resolveClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  const realIp = request.headers.get('x-real-ip')?.trim();
  return forwarded || realIp || 'local-admin';
}

export async function GET() {
  const catalog = getRuntimeCatalog();
  return NextResponse.json(catalog, {
    status: 200,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export async function POST(request: NextRequest) {
  const csrfOk = verifySameOriginCsrf({
    origin: request.headers.get('origin'),
    host: request.headers.get('host'),
    referer: request.headers.get('referer'),
  });
  if (!csrfOk) {
    return NextResponse.json(
      { error: 'SECURITY_CSRF_ORIGIN_MISMATCH', message: 'Cross-origin admin request rejected' },
      { status: 403 },
    );
  }

  const ip = resolveClientIp(request);
  const rate = checkRateLimit(`adminAction:${ip}`, 60);
  if (!rate.allowed) {
    const retryAfterSeconds = Math.max(1, Math.ceil((rate.resetAtMs - Date.now()) / 1000));
    return NextResponse.json(
      { error: 'SECURITY_RATE_LIMIT_EXCEEDED', message: 'Too many admin mutations' },
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

  const parsed = adminCatalogActionSchema.safeParse(parsedJson);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'VALIDATION_FAILED', details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;
  const actor = 'Ayman Rahman (Admin)';

  try {
    let catalog;
    switch (payload.action) {
      case 'UPDATE_PLAN': {
        catalog = updateRuntimePlan(
          payload.planId,
          {
            baseBdt: payload.baseBdt,
            baseUsd: payload.baseUsd,
            nameEn: payload.nameEn,
            nameBn: payload.nameBn,
            featuresEn: payload.featuresEn,
            featuresBn: payload.featuresBn,
            allowSplit: payload.allowSplit,
            active: payload.active,
            fullMocks: payload.fullMocks,
            aiCredits: payload.aiCredits,
          },
          actor,
        );
        break;
      }
      case 'ADD_PLAN': {
        catalog = addRuntimePlan(
          {
            planId: payload.planId,
            nameEn: payload.nameEn,
            nameBn: payload.nameBn,
            baseBdt: payload.baseBdt,
            baseUsd: payload.baseUsd,
            featuresEn: payload.featuresEn,
            featuresBn: payload.featuresBn,
            allowSplit: payload.allowSplit,
            fullMocks: payload.fullMocks,
            aiCredits: payload.aiCredits,
          },
          actor,
        );
        break;
      }
      case 'UPDATE_FEES': {
        catalog = updateRuntimeFeeRates(
          {
            split2Rate: payload.split2Rate,
            split3Rate: payload.split3Rate,
            vatRateBdt: payload.vatRateBdt,
          },
          actor,
        );
        break;
      }
      case 'UPSERT_PROMO': {
        catalog = upsertRuntimePromoCode(
          {
            code: payload.code,
            discountType: payload.discountType,
            value: payload.value,
            active: payload.active,
            labelEn: payload.labelEn,
            labelBn: payload.labelBn,
            maxRedemptions: payload.maxRedemptions,
            expiresAt: payload.expiresAt,
          },
          actor,
        );
        break;
      }
      case 'TOGGLE_PROMO': {
        catalog = toggleRuntimePromoCode(payload.code, payload.active, actor);
        break;
      }
      case 'ORDER_ACTION': {
        catalog = applyRuntimeOrderAction(payload.orderId, payload.operation, payload.corporateBin, actor);
        break;
      }
      case 'CMS_UPDATE': {
        if (payload.kind === 'top_ribbon') {
          catalog = applyRuntimeCmsUpdate(
            {
              kind: 'top_ribbon',
              enabled: payload.enabled,
              textEn: payload.textEn,
              textBn: payload.textBn,
              ctaLabelEn: payload.ctaLabelEn,
              ctaLabelBn: payload.ctaLabelBn,
              ctaHref: payload.ctaHref,
            },
            actor,
          );
        } else if (payload.kind === 'moderate') {
          catalog = applyRuntimeCmsUpdate(
            {
              kind: 'moderate',
              submissionId: payload.submissionId,
              decision: payload.decision,
              feedbackNote: payload.feedbackNote,
            },
            actor,
          );
        } else {
          catalog = applyRuntimeCmsUpdate(
            {
              kind: 'upsert_item',
              item: payload.item,
            },
            actor,
          );
        }
        break;
      }
      case 'SCHOLAR_ACTION': {
        catalog = applyRuntimeScholarAction(
          payload.scholarId,
          payload.operation,
          { credits: payload.credits, cohort: payload.cohort },
          actor,
        );
        break;
      }
      case 'TOGGLE_FLAG': {
        catalog = toggleRuntimeFeatureFlag(payload.flag, payload.value, actor);
        break;
      }
      case 'PSYCHOMETRIC_UPDATE': {
        catalog = updateRuntimePsychometricStrictness(payload.itemId, payload.aiStrictness, actor);
        break;
      }
      case 'RESET_DEFAULTS': {
        catalog = resetRuntimeCatalogToDefaults(actor);
        break;
      }
    }

    return NextResponse.json(
      { ok: true, catalog },
      { status: 200, headers: { 'Cache-Control': 'no-store' } },
    );
  } catch (err) {
    if (err instanceof PaymentSecurityError) {
      return NextResponse.json({ error: err.code, message: err.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'ADMIN_MUTATION_FAILED' },
      { status: 400 },
    );
  }
}
