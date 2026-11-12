/** @purpose Unit tests for SSLCommerz payment integration, money arithmetic, and entitlements */

import { describe, it, expect } from 'vitest';
import { createHash } from 'node:crypto';
import {
  formatMinorToMajor,
  parseMajorToMinor,
  formatCurrency,
  calculateTaxInclusive,
} from '../commerce/money';
import {
  SslcommerzProvider,
  localVerifySign,
  ProviderPermanentError,
} from '../commerce/sslcommerz';
import {
  grantEntitlement,
  hasActiveEntitlement,
  getUserEntitlements,
} from '../commerce/entitlements';
import {
  createOrder,
  fulfillOrder,
} from '../commerce/checkout';

describe('Money Arithmetic & Formatting (docs/10 §1.1)', () => {
  it('formats minor units to major decimal string', () => {
    expect(formatMinorToMajor(399000)).toBe('3990.00');
    expect(formatMinorToMajor(0)).toBe('0.00');
    expect(formatMinorToMajor(1050)).toBe('10.50');
    expect(formatMinorToMajor(-500)).toBe('-5.00');
  });

  it('parses major decimal to integer minor units', () => {
    expect(parseMajorToMinor('3990.00')).toBe(399000);
    expect(parseMajorToMinor(3990)).toBe(399000);
    expect(parseMajorToMinor('15.50')).toBe(1550);
    expect(() => parseMajorToMinor('invalid')).toThrow();
  });

  it('formats currency strings for English and Bangla locales', () => {
    expect(formatCurrency(399000, 'BDT', 'en')).toContain('3,990.00');
    expect(formatCurrency(399000, 'BDT', 'bn')).toContain('৳');
    expect(formatCurrency(8900, 'USD', 'en')).toBe('$89.00');
  });

  it('calculates VAT-inclusive breakdown accurately', () => {
    const tax = calculateTaxInclusive(10500, 0.05); // 105 BDT with 5% VAT
    expect(tax.baseMinor).toBe(10000);
    expect(tax.vatMinor).toBe(500);
    expect(tax.baseMinor + tax.vatMinor).toBe(10500);
  });
});

describe('SSLCommerz Gateway Adapter (docs/10 §3)', () => {
  const provider = new SslcommerzProvider({
    storeId: 'test_store',
    storePassword: 'test_password',
    isLive: false,
  });

  it('rejects non-BDT currency for SSLCommerz', async () => {
    await expect(
      provider.createCheckout({
        orderId: 'ord-1',
        paymentId: 'pay-1',
        providerRef: 'LATRAN01',
        amountMinor: 399000,
        currency: 'USD',
        customer: { userId: 'u1', name: 'Learner', email: 'u1@lumen.edu', country: 'BD' },
        lines: [],
        returnUrls: { success: 'http://localhost/s', fail: 'http://localhost/f', cancel: 'http://localhost/c' },
        webhookUrl: 'http://localhost/ipn',
      })
    ).rejects.toThrow(ProviderPermanentError);
  });

  it('rejects amounts outside allowed limits (< 10 BDT or > 500,000 BDT)', async () => {
    await expect(
      provider.createCheckout({
        orderId: 'ord-1',
        paymentId: 'pay-1',
        providerRef: 'LATRAN01',
        amountMinor: 500, // 5 BDT (minimum is 10 BDT / 1000 minor)
        currency: 'BDT',
        customer: { userId: 'u1', name: 'Learner', email: 'u1@lumen.edu', country: 'BD' },
        lines: [],
        returnUrls: { success: 'http://localhost/s', fail: 'http://localhost/f', cancel: 'http://localhost/c' },
        webhookUrl: 'http://localhost/ipn',
      })
    ).rejects.toThrow(/outside allowed limits/i);
  });

  it('generates sandbox checkout session with tran_id <= 30 chars', async () => {
    const res = await provider.createCheckout({
      orderId: 'ord-100',
      paymentId: 'pay-100',
      providerRef: 'LA261112TESTREF01',
      amountMinor: 399000,
      currency: 'BDT',
      customer: { userId: 'u1', name: 'Ayman Rahman', email: 'ayman@lumen.edu', country: 'BD' },
      lines: [{ orderItemId: 'item-1', title: 'IELTS Academic Core', category: 'Education', unitAmountMinor: 399000, quantity: 1 }],
      returnUrls: { success: 'http://localhost/checkout/return?status=success', fail: 'http://localhost/checkout/return?status=fail', cancel: 'http://localhost/checkout/return?status=cancel' },
      webhookUrl: 'http://localhost/api/webhooks/sslcommerz',
    });

    expect(res.redirectUrl).toBeDefined();
    expect(res.redirectUrl).toContain('tran_id=LA261112TESTREF01');
  });

  it('enforces IPN invariant: parsed webhook authenticated is always false', async () => {
    const rawBody = 'tran_id=LATRAN99&val_id=VAL123&status=VALID&amount=3990.00';
    const parsed = await provider.parseWebhook({ rawBody });

    expect(parsed.provider).toBe('sslcommerz');
    expect(parsed.providerRef).toBe('LATRAN99');
    expect(parsed.authenticated).toBe(false); // MUST BE FALSE: verifyPayment is required
  });

  it('verifies payment authoritatively via secondary validation hint', async () => {
    const verified = await provider.verifyPayment({
      providerRef: 'LATRAN99',
      hint: { val_id: 'SANDBOX_VAL_99' },
      expected: { amountMinor: 399000, currency: 'BDT' },
    });

    expect(verified.status).toBe('paid');
    expect(verified.providerRef).toBe('LATRAN99');
    expect(verified.amountMinor).toBe(399000);
    expect(verified.currency).toBe('BDT');
  });

  it('computes and verifies local verify_sign cryptographic hash', () => {
    const storePass = 'testpass';
    const params: Record<string, string> = {
      tran_id: 'TXN100',
      val_id: 'VAL100',
      amount: '100.00',
      verify_key: 'amount,store_passwd,tran_id,val_id',
    };

    // Before signature provided
    expect(localVerifySign(params, storePass)).toBe(false);

    // With invalid signature
    params.verify_sign = 'bad_hash';
    expect(localVerifySign(params, storePass)).toBe(false);

    // With computed valid signature
    const md5Pass = createHash('md5').update(storePass).digest('hex');
    const validSign = createHash('md5')
      .update(`amount=100.00&store_passwd=${md5Pass}&tran_id=TXN100&val_id=VAL100`)
      .digest('hex');
    params.verify_sign = validSign;
    expect(localVerifySign(params, storePass)).toBe(true);
  });
});

describe('Entitlements Engine (D5 & docs/10)', () => {
  const userId = 'usr-entitlement-test';

  it('grants and verifies active product entitlements', () => {
    const ent = grantEntitlement(userId, 'ielts-academic-core', 'purchase');

    expect(ent.userId).toBe(userId);
    expect(ent.productSlug).toBe('ielts-academic-core');
    expect(ent.isActive).toBe(true);
    expect(ent.allowancesJson).toBeDefined();

    expect(hasActiveEntitlement(userId, 'ielts-academic-core')).toBe(true);
    expect(hasActiveEntitlement(userId, 'unowned-course')).toBe(false);

    const userList = getUserEntitlements(userId);
    expect(userList.length).toBeGreaterThanOrEqual(1);
  });
});

describe('Order Creation & Fulfillment Flow', () => {
  it('creates order, executes secondary validation, and authoritatively grants entitlements', async () => {
    const orderRes = await createOrder({
      userId: 'usr-buyer-01',
      productSlug: 'ielts-academic-core',
      customer: {
        userId: 'usr-buyer-01',
        name: 'Ayman Rahman',
        email: 'ayman@lumen.edu',
        country: 'BD',
      },
      appUrl: 'http://localhost:3000',
    });

    expect(orderRes.order.status).toBe('pending');
    expect(orderRes.order.amountMinor).toBe(399000);
    expect(orderRes.order.providerRef.length).toBeLessThanOrEqual(30);

    // Fulfill order with valid sandbox val_id
    const fulfillment = await fulfillOrder(
      orderRes.order.providerRef,
      'SANDBOX_VAL_ORDER_TEST'
    );

    expect(fulfillment.success).toBe(true);
    expect(fulfillment.order?.status).toBe('paid');
    expect(fulfillment.entitlement?.productSlug).toBe('ielts-academic-core');
    expect(hasActiveEntitlement('usr-buyer-01', 'ielts-academic-core')).toBe(true);
  });
});
