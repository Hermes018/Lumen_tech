/** @purpose SSLCommerz payment gateway adapter, IPN validation, and cryptographic signature verification */

import { createHash, timingSafeEqual } from 'node:crypto';
import { formatMinorToMajor, parseMajorToMinor, type Currency } from './money';

export interface CheckoutCustomer {
  userId: string;
  name: string;
  email: string;
  phoneE164?: string;
  address1?: string;
  city?: string;
  postcode?: string;
  country: string;
}

export interface CheckoutLine {
  orderItemId: string;
  title: string;
  category: string;
  unitAmountMinor: number;
  quantity: number;
}

export interface CreateCheckoutInput {
  orderId: string;
  paymentId: string;
  providerRef: string; // unique transaction reference (tran_id) <= 30 chars
  amountMinor: number;
  currency: Currency;
  customer: CheckoutCustomer;
  lines: CheckoutLine[];
  returnUrls: { success: string; fail: string; cancel: string };
  webhookUrl: string;
  locale?: 'en' | 'bn';
}

export interface CreateCheckoutResult {
  redirectUrl: string;
  providerSessionId?: string;
  raw: unknown;
}

export interface ParsedWebhook {
  provider: 'sslcommerz';
  providerEventId: string;
  eventType: string;
  providerRef: string;
  authenticated: boolean; // always false for raw IPN; server verifyPayment is mandatory
  signatureValid: boolean;
  payload: {
    tran_id: string;
    val_id?: string;
    status?: string;
    risk_level?: string;
    amount?: string;
    currency?: string;
    verify_sign?: string;
    verify_key?: string;
  };
}

export interface VerifiedPayment {
  status: 'paid' | 'pending' | 'failed' | 'cancelled' | 'held_review';
  providerRef: string;
  providerTxnId?: string;
  amountMinor: number;
  currency: Currency;
  paidAt?: Date;
  method?: string;
  riskLevel?: 0 | 1;
  failureReason?: string;
  raw: unknown;
}

export class ProviderPermanentError extends Error {}
export class ProviderTransientError extends Error {}

export interface SslcommerzConfig {
  storeId?: string;
  storePassword?: string;
  isLive?: boolean;
}

interface SslcInitResponse {
  status?: string;
  GatewayPageURL?: string;
  sessionkey?: string;
  [key: string]: unknown;
}

interface SslcValidationResponse {
  status?: string;
  tran_id?: string;
  currency_type?: string;
  currency?: string;
  amount?: string | number;
  currency_amount?: string | number;
  bank_tran_id?: string;
  risk_level?: string | number;
  card_type?: string;
  tran_date?: string;
  [key: string]: unknown;
}

export class SslcommerzProvider {
  readonly id = 'sslcommerz' as const;
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isLive: boolean;

  constructor(config?: SslcommerzConfig) {
    this.storeId = config?.storeId || process.env.SSLCZ_STORE_ID || 'sandbox_store';
    this.storePassword = config?.storePassword || process.env.SSLCZ_STORE_PASSWORD || 'sandbox_passwd';
    this.isLive = config?.isLive ?? process.env.SSLCZ_IS_LIVE === 'true';
  }

  private baseUrl(): string {
    return this.isLive ? 'https://securepay.sslcommerz.com' : 'https://sandbox.sslcommerz.com';
  }

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    if (input.currency !== 'BDT') {
      throw new ProviderPermanentError('SSLCommerz adapter is BDT-only in this platform');
    }
    if (input.amountMinor < 1000 || input.amountMinor > 50_000_000) {
      throw new ProviderPermanentError('Amount outside allowed limits: 10.00 BDT to 500,000.00 BDT');
    }
    for (const url of Object.values(input.returnUrls)) {
      if (url.length > 255) {
        throw new ProviderPermanentError('Return URL exceeds 255 characters limit');
      }
    }

    const c = input.customer;
    const body = new URLSearchParams({
      store_id: this.storeId,
      store_passwd: this.storePassword,
      total_amount: formatMinorToMajor(input.amountMinor),
      currency: 'BDT',
      tran_id: input.providerRef,
      success_url: input.returnUrls.success,
      fail_url: input.returnUrls.fail,
      cancel_url: input.returnUrls.cancel,
      ipn_url: input.webhookUrl,
      emi_option: '0',
      cus_name: c.name.slice(0, 50) || 'Learner',
      cus_email: c.email,
      cus_add1: c.address1 ?? 'N/A',
      cus_city: c.city ?? 'Dhaka',
      cus_postcode: c.postcode ?? '1000',
      cus_country: 'Bangladesh',
      cus_phone: (c.phoneE164 ?? '').replace(/^\+?880/, '0') || '01700000000',
      shipping_method: 'NO',
      product_name: input.lines.map((l) => l.title).join(', ').slice(0, 100),
      product_category: 'Education',
      product_profile: 'non-physical-goods',
      value_a: input.orderId,
      value_b: input.paymentId,
    });

    try {
      const response = await fetch(`${this.baseUrl()}/gwprocess/v4/api.php`, {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body,
      });

      if (response.ok) {
        const json = (await response.json()) as SslcInitResponse;
        if (json.status === 'SUCCESS' && json.GatewayPageURL) {
          return {
            redirectUrl: json.GatewayPageURL,
            providerSessionId: json.sessionkey,
            raw: redact(json),
          };
        }
      }
      if (this.isLive || process.env.NODE_ENV === 'production') {
        throw new ProviderTransientError('SSLCommerz gateway session initiation failed');
      }
    } catch (err) {
      if (err instanceof ProviderTransientError || err instanceof ProviderPermanentError) {
        throw err;
      }
      if (this.isLive || process.env.NODE_ENV === 'production') {
        throw new ProviderTransientError(
          `SSLCommerz gateway unavailable: ${err instanceof Error ? err.message : String(err)}`
        );
      }
      // In offline / unit test sandbox mode without active gateway connection,
      // fallback to standard sandbox simulation URL
    }

    const isProduction = (process.env.NODE_ENV as string) === 'production';
    const isTest = (process.env.NODE_ENV as string) === 'test';
    const isSandboxEnv = process.env.SSLCOMMERZ_SANDBOX === 'true';
    const allowSandboxSimulation = isTest || (!isProduction && isSandboxEnv);

    if (this.isLive || isProduction || !allowSandboxSimulation) {
      throw new ProviderTransientError('SSLCommerz gateway unavailable');
    }

    // Deterministic Sandbox Simulation for testing / development
    const simulatedSessionKey = `sslc_sess_${Date.now()}`;
    const sep = input.returnUrls.success.includes('?') ? '&' : '?';
    const simulatedGatewayUrl = `${input.returnUrls.success}${sep}tran_id=${encodeURIComponent(
      input.providerRef
    )}&val_id=SANDBOX_VAL_${Date.now()}&amount=${formatMinorToMajor(
      input.amountMinor
    )}&card_type=BKASH-BKash&status=VALID`;

    return {
      redirectUrl: simulatedGatewayUrl,
      providerSessionId: simulatedSessionKey,
      raw: { simulated: true, tran_id: input.providerRef },
    };
  }

  getStorePassword(): string {
    return this.storePassword;
  }

  async parseWebhook({
    rawBody,
    requireSignature = false,
  }: {
    rawBody: string;
    requireSignature?: boolean;
  }): Promise<ParsedWebhook> {
    const f = Object.fromEntries(new URLSearchParams(rawBody));
    if (!f.tran_id) {
      throw new ProviderPermanentError('SSLCommerz IPN payload missing tran_id');
    }

    const hasSignatureFields = Boolean(f.verify_sign || f.verify_key);
    const signatureValid = hasSignatureFields
      ? localVerifySign(f, this.storePassword)
      : !requireSignature && !this.isLive;

    if ((requireSignature || hasSignatureFields) && !signatureValid) {
      throw new ProviderPermanentError('SSLCommerz IPN signature (verify_sign) verification failed');
    }

    return {
      provider: 'sslcommerz',
      providerEventId: `${f.tran_id}:${f.val_id ?? 'noval'}:${f.status ?? 'nostatus'}`,
      eventType: `IPN:${f.status ?? 'UNKNOWN'}`,
      providerRef: f.tran_id,
      authenticated: false, // Invariant: Raw IPN is NEVER treated as authenticated; secondary verifyPayment is mandatory
      signatureValid,
      payload: {
        tran_id: f.tran_id,
        val_id: f.val_id,
        status: f.status,
        risk_level: f.risk_level,
        amount: f.amount,
        currency: f.currency_type ?? f.currency,
        verify_sign: f.verify_sign,
        verify_key: f.verify_key,
      },
    };
  }

  /**
   * Authoritative secondary order validation API call (docs/10 §3.3):
   * Calls validationserverAPI.php to confirm amount, currency, tran_id, and risk_level.
   */
  async verifyPayment(args: {
    providerRef: string;
    hint?: Record<string, string>;
    expected: { amountMinor: number; currency: Currency };
  }): Promise<VerifiedPayment> {
    const valId = args.hint?.val_id;
    const base = {
      providerRef: args.providerRef,
      currency: args.expected.currency,
      amountMinor: 0,
      raw: {},
    };

    if (!valId) {
      return {
        ...base,
        status: 'failed',
        failureReason: 'missing_val_id',
      };
    }

    const isProduction = (process.env.NODE_ENV as string) === 'production';
    const isTest = (process.env.NODE_ENV as string) === 'test';
    const isSandboxEnv = process.env.SSLCOMMERZ_SANDBOX === 'true';
    const allowSandbox = isTest || (!isProduction && isSandboxEnv);

    // In unit test sandbox environments where simulated val_id is used:
    if (valId.startsWith('SANDBOX_VAL_')) {
      if (this.isLive || isProduction || !allowSandbox) {
        return {
          ...base,
          status: 'failed',
          failureReason: 'sandbox_val_id_forbidden_in_production',
        };
      }
      const hintAmountMinor =
        args.hint?.amount !== undefined
          ? parseMajorToMinor(args.hint.amount)
          : args.expected.amountMinor;
      const hintCurrency = (args.hint?.currency || 'BDT') as Currency;

      if (hintCurrency !== args.expected.currency) {
        return {
          ...base,
          amountMinor: hintAmountMinor,
          status: 'failed',
          failureReason: 'currency_mismatch',
        };
      }

      if (hintAmountMinor !== args.expected.amountMinor) {
        return {
          ...base,
          amountMinor: hintAmountMinor,
          status: 'failed',
          failureReason: 'amount_mismatch',
        };
      }

      return {
        status: 'paid',
        providerRef: args.providerRef,
        providerTxnId: `BANK_${valId}`,
        amountMinor: args.expected.amountMinor,
        currency: 'BDT',
        paidAt: new Date(),
        method: 'bkash',
        riskLevel: 0,
        raw: { sandbox: true, val_id: valId },
      };
    }

    const qs = new URLSearchParams({
      val_id: valId,
      store_id: this.storeId,
      store_passwd: this.storePassword,
      format: 'json',
    });

    try {
      const response = await fetch(`${this.baseUrl()}/validator/api/validationserverAPI.php?${qs}`, {
        method: 'GET',
      });

      if (!response.ok) {
        return { ...base, status: 'failed', failureReason: `validation_http_${response.status}` };
      }

      const v = (await response.json()) as SslcValidationResponse;
      const rawRedacted = redact(v);

      if (v.status !== 'VALID' && v.status !== 'VALIDATED') {
        return {
          ...base,
          raw: rawRedacted,
          status: v.status === 'INVALID_TRANSACTION' ? 'failed' : 'pending',
          failureReason: String(v.status ?? 'invalid_status'),
        };
      }

      if (v.tran_id !== args.providerRef) {
        return {
          ...base,
          raw: rawRedacted,
          status: 'failed',
          failureReason: 'tran_id_mismatch',
        };
      }

      const curType = String(v.currency_type ?? v.currency ?? '');
      const reportedAmountMinor =
        curType === 'BDT'
          ? parseMajorToMinor(String(v.amount))
          : parseMajorToMinor(String(v.currency_amount ?? '0'));

      if (curType !== args.expected.currency) {
        return {
          ...base,
          amountMinor: reportedAmountMinor,
          raw: rawRedacted,
          status: 'failed',
          failureReason: 'currency_mismatch',
        };
      }

      if (reportedAmountMinor !== args.expected.amountMinor) {
        return {
          ...base,
          amountMinor: reportedAmountMinor,
          raw: rawRedacted,
          status: 'failed',
          failureReason: 'amount_mismatch',
        };
      }

      const risk = String(v.risk_level ?? '0');
      const isHighRisk = risk === '1';

      return {
        providerRef: args.providerRef,
        providerTxnId: v.bank_tran_id ? String(v.bank_tran_id) : undefined,
        amountMinor: reportedAmountMinor,
        currency: 'BDT',
        status: isHighRisk ? 'held_review' : 'paid',
        riskLevel: isHighRisk ? 1 : 0,
        method: String(v.card_type ?? 'sslcommerz').toLowerCase(),
        paidAt: v.tran_date ? new Date(String(v.tran_date)) : new Date(),
        raw: rawRedacted,
      };
    } catch (err) {
      return {
        ...base,
        status: 'pending',
        failureReason: err instanceof Error ? err.message : 'network_error',
      };
    }
  }
}

/**
 * Strips credentials, tokens, and sensitive data from logged raw payloads.
 */
function redact<T>(o: T): T {
  return JSON.parse(
    JSON.stringify(o, (k, v) => (/pass|secret|token|key|card_no/i.test(k) ? '[redacted]' : v))
  );
}

/**
 * Local verify_sign cryptographic calculation (docs/10 §3.3).
 * MD5 over sorted key=value pairs of fields named in verify_key plus store_passwd.
 */
export function localVerifySign(f: Record<string, string>, storePasswd: string): boolean {
  if (!f.verify_sign || !f.verify_key) return false;
  const keys = f.verify_key.split(',').sort();
  const md5Passwd = createHash('md5').update(storePasswd).digest('hex');

  const parts = keys.map((k) => {
    const val = k === 'store_passwd' ? md5Passwd : f[k] ?? '';
    return `${k}=${val}`;
  });

  if (!keys.includes('store_passwd')) {
    parts.push(`store_passwd=${md5Passwd}`);
  }
  parts.sort();

  const computedHash = createHash('md5').update(parts.join('&')).digest('hex');
  const a = Buffer.from(computedHash.toLowerCase());
  const b = Buffer.from(f.verify_sign.toLowerCase());
  return a.length === b.length && timingSafeEqual(a, b);
}
