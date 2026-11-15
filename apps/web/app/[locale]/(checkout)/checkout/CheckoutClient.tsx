/** @purpose Interactive institutional checkout client with Geo-IP dual-currency switcher (BDT/USD), fractional split-pay clearing fees (0%/2.85%/4.75%), promo codes, and optional B2B Mushak 6.3 BIN chalan */
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
  Smartphone,
  Building2,
  Receipt,
  Globe,
  Tag,
} from 'lucide-react';
import { CANONICAL_PRODUCTS, type ProductDefinition } from '@lumen/core';
import { initiateCheckoutAction, submitManualCheckoutAction } from '@/app/actions/checkout';
import { BangladeshPaymentTrustBar } from '../../(marketing)/_components/BangladeshPaymentTrustBar';
import { LocaleLink } from '../../_components/LocaleLink';

import type {
  RuntimeCatalogPlan,
  RuntimeCatalogSnapshot,
  RuntimeFeeRates,
  RuntimePromoCode,
} from '@/src/lib/security/payment-guard';

export interface CheckoutUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role?: string;
}

export interface CheckoutClientProps {
  initialProduct: ProductDefinition;
  locale?: 'en' | 'bn';
  user?: CheckoutUser | null;
}

type CurrencyCode = 'BDT' | 'USD';
type PaymentMethodId =
  | 'bkash'
  | 'nagad'
  | 'nexus'
  | 'card'
  | 'manual'
  | 'intl-card'
  | 'intl-wire';
type ScheduleId = 'full' | 'split-2' | 'split-3';

const DEFAULT_FEE_RATES: RuntimeFeeRates = {
  split2Rate: 0.0285,
  split3Rate: 0.0475,
  vatRateBdt: 0.15,
};

const DEFAULT_PROMO_GRANTS: Readonly<Record<string, RuntimePromoCode>> = {
  LUMEN10: {
    code: 'LUMEN10',
    discountType: 'percent',
    value: 10,
    active: true,
    labelEn: '10% Scholar Launch Grant',
    labelBn: '১০% স্কলার লঞ্চ ছাড়',
    maxRedemptions: 500,
    redemptionsCount: 42,
    expiresAt: null,
  },
  DU20: {
    code: 'DU20',
    discountType: 'percent',
    value: 20,
    active: true,
    labelEn: '20% University Cohort Grant',
    labelBn: '২০% বিশ্ববিদ্যালয় কোহর্ট ছাড়',
    maxRedemptions: 250,
    redemptionsCount: 19,
    expiresAt: null,
  },
};

const PLAN_BASE_PRICE_MAP: Readonly<Record<string, { baseBdt: number; baseUsd: number }>> = {
  'ielts-academic-core': { baseBdt: 3470, baseUsd: 45 },
  'gre-complete-core': { baseBdt: 4339, baseUsd: 49 },
  'gre-mock-pack-5': { baseBdt: 1730, baseUsd: 25 },
  'lumen-annual-pass': { baseBdt: 8687, baseUsd: 99 },
  'gre-core': { baseBdt: 5209, baseUsd: 59 },
  'gre-plus': { baseBdt: 7383, baseUsd: 79 },
  'ielts-academic-plus': { baseBdt: 5643, baseUsd: 69 },
  'ai-credits-10': { baseBdt: 426, baseUsd: 9 },
  'mock-pack-4': { baseBdt: 861, baseUsd: 15 },
  'human-review-pack': { baseBdt: 1296, baseUsd: 19 },
};

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

function toBnDigits(text: string): string {
  return text.replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d);
}

function formatMoney(amount: number, currency: CurrencyCode, isBn: boolean, decimals?: number): string {
  const frac = decimals ?? (currency === 'USD' ? 2 : 0);
  const formatted = amount.toLocaleString('en-US', {
    minimumFractionDigits: frac,
    maximumFractionDigits: frac,
  });
  const localized = isBn ? toBnDigits(formatted) : formatted;
  return currency === 'USD' ? `$${localized}` : `৳${localized}`;
}

function formatAmount(minor: number, isBn: boolean, decimals = 2): string {
  const formatted = (minor / 100).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (!isBn) return formatted;
  return toBnDigits(formatted);
}

function formatDateOffset(days: number, isBn: boolean): string {
  if (days === 0) return isBn ? 'আজ (তাৎক্ষণিক)' : 'Today (Immediate)';
  const d = new Date(Date.now() + days * 86_400_000);
  const str = d.toLocaleDateString(isBn ? 'bn-BD' : 'en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return str;
}

export function CheckoutClient({ initialProduct, locale: propLocale, user }: CheckoutClientProps) {
  const hookLocale = useLocale();
  const locale = propLocale ?? (hookLocale === 'bn' ? 'bn' : 'en');
  const isBn = locale === 'bn';
  const isGuest = !user?.email;

  const [selectedSlug, setSelectedSlug] = useState<string>(initialProduct.slug);
  useEffect(() => {
    setSelectedSlug(initialProduct.slug);
  }, [initialProduct.slug]);

  const [runtimePlans, setRuntimePlans] = useState<Record<string, RuntimeCatalogPlan> | null>(null);
  const [feeRates, setFeeRates] = useState<RuntimeFeeRates>(DEFAULT_FEE_RATES);
  const [promoCatalog, setPromoCatalog] = useState<Readonly<Record<string, RuntimePromoCode>>>(DEFAULT_PROMO_GRANTS);
  const [splitPayFlagEnabled, setSplitPayFlagEnabled] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    fetch('/api/admin/catalog', { cache: 'no-store' })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: RuntimeCatalogSnapshot | null) => {
        if (!active || !data) return;
        if (data.plans) setRuntimePlans(data.plans);
        if (data.feeRates) setFeeRates(data.feeRates);
        if (data.promoCodes) setPromoCatalog(data.promoCodes);
        if (data.featureFlags) setSplitPayFlagEnabled(data.featureFlags.splitPayEnabled);
      })
      .catch(() => {
        // Keep canonical static defaults offline
      });
    return () => {
      active = false;
    };
  }, []);

  interface MergedCheckoutPlan {
    slug: string;
    name: string;
    baseBdt: number;
    baseUsd: number;
    fullMocks: number;
    aiCredits: number;
    splitPayEligible: boolean;
  }

  const availablePlans: MergedCheckoutPlan[] = (() => {
    const bySlug = new Map<string, MergedCheckoutPlan>();
    for (const prod of CANONICAL_PRODUCTS) {
      const rt = runtimePlans?.[prod.slug];
      if (rt && !rt.active) continue;
      const fallback = PLAN_BASE_PRICE_MAP[prod.slug] ?? {
        baseBdt: Math.round(prod.prices.BD / 115),
        baseUsd: Number((prod.prices.A / 100).toFixed(2)),
      };
      bySlug.set(prod.slug, {
        slug: prod.slug,
        name: rt ? (isBn ? rt.nameBn : rt.nameEn) : prod.name,
        baseBdt: rt ? rt.baseBdt : fallback.baseBdt,
        baseUsd: rt ? rt.baseUsd : fallback.baseUsd,
        fullMocks: rt ? rt.fullMocks : prod.allowances.full_mocks,
        aiCredits: rt ? rt.aiCredits : prod.allowances.ai_credits,
        splitPayEligible: rt ? rt.splitPayEligible : prod.prices.BD >= 499000,
      });
    }
    if (runtimePlans) {
      for (const rt of Object.values(runtimePlans)) {
        if (!rt.active || !rt.isCustom || bySlug.has(rt.planId)) continue;
        bySlug.set(rt.planId, {
          slug: rt.planId,
          name: isBn ? rt.nameBn : rt.nameEn,
          baseBdt: rt.baseBdt,
          baseUsd: rt.baseUsd,
          fullMocks: rt.fullMocks,
          aiCredits: rt.aiCredits,
          splitPayEligible: rt.splitPayEligible,
        });
      }
    }
    return Array.from(bySlug.values());
  })();

  const selectedPlan: MergedCheckoutPlan =
    availablePlans.find((p) => p.slug === selectedSlug) ?? {
      slug: initialProduct.slug,
      name: initialProduct.name,
      baseBdt:
        PLAN_BASE_PRICE_MAP[initialProduct.slug]?.baseBdt ??
        Math.round(initialProduct.prices.BD / 115),
      baseUsd:
        PLAN_BASE_PRICE_MAP[initialProduct.slug]?.baseUsd ??
        Number((initialProduct.prices.A / 100).toFixed(2)),
      fullMocks: initialProduct.allowances.full_mocks,
      aiCredits: initialProduct.allowances.ai_credits,
      splitPayEligible: initialProduct.prices.BD >= 499000,
    };

  const [currency, setCurrency] = useState<CurrencyCode>('BDT');
  useEffect(() => {
    let active = true;
    try {
      const urlCurr = new URLSearchParams(window.location.search).get('currency');
      if (urlCurr === 'BDT' || urlCurr === 'USD') {
        setCurrency(urlCurr);
        setPaymentMethod(urlCurr === 'USD' ? 'intl-card' : 'bkash');
        return;
      }
      const saved = window.localStorage.getItem('lumen_currency');
      if (saved === 'BDT' || saved === 'USD') {
        setCurrency(saved);
        setPaymentMethod(saved === 'USD' ? 'intl-card' : 'bkash');
        return;
      }
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const tzCurr: CurrencyCode = tz === 'Asia/Dhaka' ? 'BDT' : 'USD';
      setCurrency(tzCurr);
      setPaymentMethod(tzCurr === 'USD' ? 'intl-card' : 'bkash');
    } catch {
      // Ignore storage/timezone access errors
    }

    fetch('/api/pricing/region')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { currency?: string } | null) => {
        if (!active || !data) return;
        try {
          const saved = window.localStorage.getItem('lumen_currency');
          if (saved === 'BDT' || saved === 'USD') return;
        } catch {
          // Ignore storage restrictions
        }
        if (data.currency === 'BDT' || data.currency === 'USD') {
          setCurrency(data.currency);
          setPaymentMethod(data.currency === 'USD' ? 'intl-card' : 'bkash');
        }
      })
      .catch(() => {
        // Keep timezone fallback
      });

    return () => {
      active = false;
    };
  }, []);

  const handleCurrencyChange = (nextCurrency: CurrencyCode) => {
    setCurrency(nextCurrency);
    setPaymentMethod(nextCurrency === 'USD' ? 'intl-card' : 'bkash');
    setErrorMsg(null);
    try {
      window.localStorage.setItem('lumen_currency', nextCurrency);
    } catch {
      // Ignore storage restrictions
    }
  };

  const splitPayEligible = splitPayFlagEnabled && selectedPlan.splitPayEligible;
  const [schedule, setSchedule] = useState<ScheduleId>('full');
  useEffect(() => {
    if (!splitPayEligible && schedule !== 'full') {
      setSchedule('full');
    }
  }, [splitPayEligible, schedule]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('bkash');
  const [manualMethod, setManualMethod] = useState<'bkash' | 'nagad'>('bkash');

  const [promoInput, setPromoInput] = useState('');
  const [appliedPromoCode, setAppliedPromoCode] = useState<string | null>(null);
  const [promoFeedback, setPromoFeedback] = useState<string | null>(null);

  const [corporateName, setCorporateName] = useState('');
  const [corporateBin, setCorporateBin] = useState('');

  const [name, setName] = useState(user?.name && user.name !== 'Guest Scholar' ? user.name : '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('House 12, Road 4, Dhanmondi');
  const [city, setCity] = useState('Dhaka');
  const [trxId, setTrxId] = useState('');
  const [manualSenderPhone, setManualSenderPhone] = useState('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);
  const [demoReceipt, setDemoReceipt] = useState<{
    orderCode: string;
    activatedAt: string;
    verificationBadge: string;
    signatureDigest?: string;
    verifiedTotal?: number;
    currency: CurrencyCode;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const rawBase = currency === 'USD' ? selectedPlan.baseUsd : selectedPlan.baseBdt;
  const candidatePromo = appliedPromoCode ? promoCatalog[appliedPromoCode] ?? null : null;
  const activePromo =
    candidatePromo &&
    candidatePromo.active &&
    (!candidatePromo.expiresAt || Date.parse(candidatePromo.expiresAt) >= Date.now()) &&
    (candidatePromo.maxRedemptions === null || candidatePromo.redemptionsCount < candidatePromo.maxRedemptions)
      ? candidatePromo
      : null;
  const discountAmount = activePromo
    ? activePromo.discountType === 'percent'
      ? currency === 'USD'
        ? Number(((rawBase * activePromo.value) / 100).toFixed(2))
        : Math.round((rawBase * activePromo.value) / 100)
      : currency === 'USD'
        ? Number(Math.min(rawBase, activePromo.value).toFixed(2))
        : Math.round(Math.min(rawBase, activePromo.value))
    : 0;
  const discountedBase = Math.max(0, Number((rawBase - discountAmount).toFixed(2)));
  const processingFeeRate =
    schedule === 'full' ? 0 : schedule === 'split-2' ? feeRates.split2Rate : feeRates.split3Rate;
  const processingFee =
    currency === 'USD'
      ? Number((discountedBase * processingFeeRate).toFixed(2))
      : Math.round(discountedBase * processingFeeRate);
  const subtotalAmount = Number((discountedBase + processingFee).toFixed(2));
  const vatAmount = currency === 'BDT' ? Math.round(subtotalAmount * feeRates.vatRateBdt) : 0;
  const totalAmount = Number((subtotalAmount + vatAmount).toFixed(2));

  const roundCurr = (val: number): number =>
    currency === 'USD' ? Number(val.toFixed(2)) : Math.round(val);

  const installmentRows =
    schedule === 'split-2'
      ? (() => {
          const first = roundCurr(totalAmount * 0.5);
          const second = Number((totalAmount - first).toFixed(2));
          return [
            { label: isBn ? '১ম কিস্তি (৫০%)' : '1st Installment (50%)', date: formatDateOffset(0, isBn), amount: first },
            { label: isBn ? '২য় কিস্তি (৫০%)' : '2nd Installment (50%)', date: formatDateOffset(30, isBn), amount: second },
          ];
        })()
      : schedule === 'split-3'
        ? (() => {
            const first = roundCurr(totalAmount * 0.4);
            const second = roundCurr(totalAmount * 0.3);
            const third = Number((totalAmount - first - second).toFixed(2));
            return [
              { label: isBn ? '১ম কিস্তি (৪০%)' : '1st Installment (40%)', date: formatDateOffset(0, isBn), amount: first },
              { label: isBn ? '২য় কিস্তি (৩০%)' : '2nd Installment (30%)', date: formatDateOffset(30, isBn), amount: second },
              { label: isBn ? '৩য় কিস্তি (৩০%)' : '3rd Installment (30%)', date: formatDateOffset(60, isBn), amount: third },
            ];
          })()
        : [];

  const dueTodayAmount = installmentRows[0]?.amount ?? totalAmount;

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setAppliedPromoCode(null);
      setPromoFeedback(null);
      return;
    }
    const found = promoCatalog[code];
    const expired = found?.expiresAt ? Date.parse(found.expiresAt) < Date.now() : false;
    const maxedOut =
      found && found.maxRedemptions !== null && found.redemptionsCount >= found.maxRedemptions;
    if (!found || !found.active || expired || maxedOut) {
      setAppliedPromoCode(null);
      setPromoFeedback(
        isBn
          ? 'অকার্যকর বা মেয়াদোত্তীর্ণ কোড। অনুগ্রহ করে LUMEN10 বা DU20 চেষ্টা করুন।'
          : 'Unrecognized or inactive code. Try LUMEN10 or DU20.',
      );
      return;
    }
    setAppliedPromoCode(found.code);
    setPromoFeedback(isBn ? `${found.code} প্রয়োগ করা হয়েছে: ${found.labelBn}` : `${found.code} applied: ${found.labelEn}`);
  };

  const createIdempotencyKey = (): string => {
    const rand = Math.random().toString(36).slice(2, 12).padEnd(10, '0');
    return `lmn_${Date.now().toString(36)}_${rand}`;
  };

  const verifyCheckoutWithCanonicalLedger = async (
    effectiveName: string,
    effectiveEmail: string,
  ): Promise<{
    receiptId: string;
    signature: string;
    verificationBadge: string;
    totalAmount: number;
  }> => {
    const splitParts: 1 | 2 | 3 =
      schedule === 'split-2' ? 2 : schedule === 'split-3' ? 3 : 1;

    const response = await fetch('/api/checkout/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: selectedPlan.slug,
        splitParts,
        splitMode: schedule,
        currency,
        promoCode: appliedPromoCode ?? undefined,
        corporateBin: currency === 'BDT' && corporateBin.trim() ? corporateBin.trim() : undefined,
        corporateName: currency === 'BDT' && corporateName.trim() ? corporateName.trim() : undefined,
        clientSubmittedTotal: totalAmount,
        paymentMethod,
        idempotencyKey: createIdempotencyKey(),
        timestampMs: Date.now(),
        customerName: effectiveName,
        customerEmail: effectiveEmail,
        returnPath: '/app',
      }),
    });

    const data = (await response.json()) as {
      verified?: boolean;
      receiptId?: string;
      signature?: string;
      verificationBadge?: string;
      canonicalOrder?: { totalAmount?: number; totalBdt?: number };
      error?: string;
      message?: string;
    };

    if (!response.ok || !data.verified || !data.receiptId) {
      throw new Error(data.message || data.error || 'Canonical price verification failed');
    }

    return {
      receiptId: data.receiptId,
      signature: data.signature ?? '',
      verificationBadge:
        data.verificationBadge ?? 'PCI-DSS SAQ-A & HMAC-SHA256 Price-Lock Verified',
      totalAmount: data.canonicalOrder?.totalAmount ?? data.canonicalOrder?.totalBdt ?? totalAmount,
    };
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setManualSuccessMsg(null);

    const effectiveName = name.trim() || 'Guest Scholar';
    const effectiveEmail = email.trim() || 'guest@lumen.demo';
    const effectivePhone = phone.trim() || '+8801712345678';

    startTransition(async () => {
      try {
        if (paymentMethod !== 'manual') {
          const verified = await verifyCheckoutWithCanonicalLedger(effectiveName, effectiveEmail);

          if (isGuest || currency === 'USD') {
            setDemoReceipt({
              orderCode: verified.receiptId,
              activatedAt: new Date().toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              verificationBadge: verified.verificationBadge,
              signatureDigest: verified.signature.slice(0, 16),
              verifiedTotal: verified.totalAmount,
              currency,
            });
            return;
          }

          const res = await initiateCheckoutAction({
            productSlug: selectedPlan.slug,
            name: effectiveName,
            email: effectiveEmail,
            phone: effectivePhone,
            address,
            city,
          });

          if (res.redirectUrl) {
            window.location.href = res.redirectUrl;
          } else {
            setErrorMsg(
              isBn
                ? 'SSLCommerz গেটওয়ে সেশন শুরু করতে ব্যর্থ হয়েছে।'
                : 'Failed to initialize SSLCommerz gateway session.'
            );
          }
        } else {
          if (!trxId || trxId.trim().length < 6) {
            setErrorMsg(
              isBn
                ? 'অনুগ্রহ করে একটি সঠিক ট্রানজেকশন আইডি (কমপক্ষে ৬ অক্ষরের TrxID) লিখুন।'
                : 'Please enter a valid Transaction ID (at least 6 alphanumeric characters).'
            );
            return;
          }

          const res = await submitManualCheckoutAction({
            productSlug: selectedPlan.slug,
            name: effectiveName,
            email: effectiveEmail,
            phone: effectivePhone,
            address,
            city,
            method: manualMethod,
            trxId: trxId.trim().toUpperCase(),
            senderNumber: manualSenderPhone.trim() || effectivePhone,
          });

          if (res.ok) {
            setManualSuccessMsg(
              isBn
                ? `ম্যানুয়াল পেমেন্ট সফলভাবে জমা হয়েছে! অর্ডার #${res.orderId} এখন যাচাইয়ের অপেক্ষায় রয়েছে।`
                : `Manual payment submitted! Order #${res.orderId} is pending verification for TrxID ${res.trxId}.`
            );
            setTrxId('');
          }
        }
      } catch (err) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : isBn
              ? 'চেকআউট প্রক্রিয়া শুরু করতে ব্যর্থ হয়েছে'
              : 'Checkout initiation failed'
        );
      }
    });
  };

  const handleDemoActivation = () => {
    setErrorMsg(null);
    const effectiveName = name.trim() || 'Guest Scholar';
    const effectiveEmail = email.trim() || 'guest@lumen.demo';

    startTransition(async () => {
      try {
        const verified = await verifyCheckoutWithCanonicalLedger(effectiveName, effectiveEmail);
        setDemoReceipt({
          orderCode: verified.receiptId,
          activatedAt: new Date().toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          verificationBadge: verified.verificationBadge,
          signatureDigest: verified.signature.slice(0, 16),
          verifiedTotal: verified.totalAmount,
          currency,
        });
      } catch (err) {
        setErrorMsg(
          err instanceof Error
            ? err.message
            : isBn
              ? 'ক্যানোনিকাল প্রাইস যাচাই ব্যর্থ হয়েছে'
              : 'Canonical price verification failed',
        );
      }
    });
  };

  const paymentMethods: { id: PaymentMethodId; label: string; sub: string; icon: React.ReactNode }[] =
    currency === 'BDT'
      ? [
          {
            id: 'bkash',
            label: isBn ? 'বিকাশ (bKash)' : 'bKash',
            sub: isBn ? 'তাৎক্ষণিক পেমেন্ট অথবা স্প্লিট-পে' : 'Instant wallet checkout or Split-Pay',
            icon: <Smartphone className="h-4 w-4 text-[var(--brand)]" />,
          },
          {
            id: 'nagad',
            label: isBn ? 'নগদ (Nagad)' : 'Nagad',
            sub: isBn ? 'SSLCommerz এর মাধ্যমে দ্রুত নগদ পেমেন্ট' : 'Fast Nagad checkout via SSLCommerz',
            icon: <Smartphone className="h-4 w-4 text-[var(--accent)]" />,
          },
          {
            id: 'card',
            label: isBn ? 'লোকাল কার্ড (Visa / Mastercard BDT)' : 'Local Cards (Visa / Mastercard BDT)',
            sub: isBn ? 'বাংলাদেশি ডেবিট ও ক্রেডিট কার্ড (SSLCommerz)' : 'Bangladesh debit & credit cards via SSLCommerz',
            icon: <CreditCard className="h-4 w-4 text-[var(--brand-ink)]" />,
          },
          {
            id: 'nexus',
            label: isBn ? 'ডাচ-বাংলা নেক্সাস / রকেট' : 'Dutch-Bangla Nexus',
            sub: isBn ? 'ডাচ-বাংলা নেক্সাস কার্ড ও রকেট ব্যাংকিং' : 'Dutch-Bangla Nexus & Rocket banking',
            icon: <Building2 className="h-4 w-4 text-[var(--brand-ink)]" />,
          },
          {
            id: 'manual',
            label: isBn ? 'ম্যানুয়াল বিকাশ / নগদ (TrxID)' : 'Manual bKash / Nagad (TrxID)',
            sub: isBn ? 'সরাসরি মার্চেন্ট পেমেন্ট ও TrxID যাচাই' : 'Direct merchant transfer & TrxID verification',
            icon: <ShieldCheck className="h-4 w-4 text-[var(--brand)]" />,
          },
        ]
      : [
          {
            id: 'intl-card',
            label: isBn ? 'আন্তর্জাতিক ভিসা / মাস্টারকার্ড / অ্যামেক্স (USD)' : 'International Visa / Mastercard / Amex (USD)',
            sub: isBn ? 'বিশ্বব্যাপী নিরাপদ ইউএসডি কার্ড চেকআউট' : 'Global USD card settlement with 0% BD VAT',
            icon: <CreditCard className="h-4 w-4 text-[var(--brand)]" />,
          },
          {
            id: 'intl-wire',
            label: isBn ? 'প্রাতিষ্ঠানিক ওয়্যার / Stripe Global' : 'Institutional Wire / Stripe Global',
            sub: isBn ? 'বিশ্ববিদ্যালয় ও আন্তর্জাতিক অনুদান নিষ্পত্তি' : 'Global bank settlement & Stripe Global',
            icon: <Globe className="h-4 w-4 text-[var(--brand-ink)]" />,
          },
        ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Page Header */}
      <div className="mb-8 border-b border-[var(--hairline)] pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--brand)]">
            <Lock className="h-3.5 w-3.5" />
            <span>
              {currency === 'BDT'
                ? isBn
                  ? 'নিরাপদ বাংলাদেশ চেকআউট • BDT ৳'
                  : 'VERIFIED BANGLADESH CHECKOUT • BDT ৳'
                : isBn
                  ? 'আন্তর্জাতিক চেকআউট • USD $'
                  : 'VERIFIED INTERNATIONAL CHECKOUT • USD $'}
            </span>
          </div>
          <h1 className="lumen-h2 mt-2">
            {isBn ? 'আপনার এনরোলমেন্ট সম্পন্ন করুন' : 'Complete Your Enrollment'}
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <div
            role="group"
            aria-label={isBn ? 'বিলিং অঞ্চল ও মুদ্রা' : 'Billing Region & Currency'}
            className="inline-flex border border-[var(--hairline)] rounded-[4px] bg-[var(--surface-paper)]"
          >
            <button
              type="button"
              onClick={() => handleCurrencyChange('BDT')}
              aria-pressed={currency === 'BDT'}
              className={`px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                currency === 'BDT'
                  ? 'bg-[var(--brand-ink)] text-white'
                  : 'bg-transparent text-[var(--brand-ink)] hover:bg-[var(--bg-warm)]'
              }`}
            >
              Bangladesh (BDT ৳)
            </button>
            <button
              type="button"
              onClick={() => handleCurrencyChange('USD')}
              aria-pressed={currency === 'USD'}
              className={`border-l border-[var(--hairline)] px-3 py-1.5 text-xs font-bold transition-colors cursor-pointer ${
                currency === 'USD'
                  ? 'bg-[var(--brand-ink)] text-white'
                  : 'bg-transparent text-[var(--brand-ink)] hover:bg-[var(--bg-warm)]'
              }`}
            >
              International (USD $)
            </button>
          </div>
          <LocaleLink
            href="/pricing"
            className="text-xs font-semibold text-[var(--link)] underline underline-offset-4 hover:text-[var(--brand)]"
          >
            {isBn ? '← সব প্ল্যান তুলনা করুন' : '← Compare all plans'}
          </LocaleLink>
        </div>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 7 Columns: Guest Identity (if guest) + Plan & Schedule + Billing & Payment Method */}
        <div className="lg:col-span-7 space-y-8">
          {isGuest && (
            <section className="rounded-[4px] bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline)] pb-4">
                <h2 className="lumen-h3">
                  {isBn
                    ? 'ধাপ ১: শিক্ষার্থীর অ্যাকাউন্ট ও বিলিং পরিচয়'
                    : 'Step 1: Scholar Account & Billing Identity'}
                </h2>
                <LocaleLink
                  href="/sign-in"
                  className="text-xs font-semibold text-[var(--link)] underline underline-offset-4 hover:text-[var(--brand)]"
                >
                  {isBn ? 'ইতিমধ্যে অ্যাকাউন্ট আছে? সাইন ইন করুন' : 'Already have an account? Sign in'}
                </LocaleLink>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? 'শিক্ষার্থীর পূর্ণ নাম' : 'Full Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isBn ? 'আয়মান রহমান' : 'Ayman Rahman'}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="scholar@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? 'বাংলাদেশ মোবাইল (+880)' : 'Bangladesh Mobile'}
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="+8801XXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                  />
                </div>
              </div>
            </section>
          )}

          {/* Plan & Schedule Selection */}
          <section className="rounded-[4px] bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4">
              <h2 className="lumen-h3">
                {isGuest
                  ? isBn
                    ? 'ধাপ ২: প্ল্যান ও পেমেন্ট শিডিউল'
                    : 'Step 2: Plan & Schedule Selection'
                  : isBn
                    ? 'ধাপ ১: প্ল্যান ও পেমেন্ট শিডিউল'
                    : 'Step 1: Plan & Schedule Selection'}
              </h2>
              <span className="font-mono text-xs text-[var(--text)]">
                {currency === 'BDT' ? (isBn ? 'বিডিটি (৳)' : 'BDT (৳)') : 'USD ($)'}
              </span>
            </div>

            {/* Interactive Plan Switcher */}
            <div className="space-y-2.5" role="radiogroup" aria-label={isBn ? 'প্ল্যান নির্বাচন' : 'Select Plan'}>
              {availablePlans.map((prod) => {
                const active = prod.slug === selectedPlan.slug;
                const displayBase = currency === 'USD' ? prod.baseUsd : prod.baseBdt;
                return (
                  <button
                    key={prod.slug}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedSlug(prod.slug)}
                    className={`w-full flex items-center justify-between gap-4 rounded-[4px] border p-4 text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-[var(--brand)] bg-[var(--bg-tint)]'
                        : 'border-[var(--hairline)] bg-[var(--bg)] hover:bg-[var(--bg-warm)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-4 w-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                          active ? 'border-[var(--brand)] bg-[var(--brand)]' : 'border-[var(--hairline)] bg-[var(--surface-paper)]'
                        }`}
                      >
                        {active && <span className="h-1.5 w-1.5 bg-white" />}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-[var(--brand-ink)]">{prod.name}</div>
                        <div className="text-xs text-[var(--text)] mt-0.5">
                          {isBn
                            ? `${prod.fullMocks} মক টেস্ট • ${prod.aiCredits} এআই মূল্যায়ন`
                            : `${prod.fullMocks} Full Mocks • ${prod.aiCredits} AI Evaluations`}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-sm font-extrabold text-[var(--brand-ink)] shrink-0">
                      {formatMoney(displayBase, currency, isBn)}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Payment Schedule Toggle */}
            <div className="border-t border-[var(--hairline)] pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[var(--brand-ink)]">
                  {isBn ? 'পেমেন্ট শিডিউল' : 'Payment Schedule'}
                </span>
                {!splitPayEligible && (
                  <span className="text-xs text-[var(--text)]">
                    {isBn ? '৳৪,৯৯০+ প্ল্যানে স্প্লিট-পে প্রযোজ্য' : 'Split-Pay available on plans ≥ ৳4,990 / $49'}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setSchedule('full')}
                  className={`rounded-[4px] border p-3 text-left transition-colors cursor-pointer ${
                    schedule === 'full'
                      ? 'border-[var(--brand)] bg-[var(--bg-tint)]'
                      : 'border-[var(--hairline)] bg-[var(--bg)] hover:bg-[var(--bg-warm)]'
                  }`}
                >
                  <div className="inline-block rounded-[4px] border border-emerald-700/40 bg-emerald-50 px-1.5 py-0.5 text-[10px] font-bold text-emerald-900 mb-1">
                    {isBn ? 'সেরা মূল্য · ০% প্রসেসিং ফি' : 'Best Value · 0% Processing Fee'}
                  </div>
                  <div className="text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? 'সম্পূর্ণ পেমেন্ট' : 'Full Payment'}
                  </div>
                  <div className="text-[11px] text-[var(--text)] mt-0.5 font-mono">
                    {isBn ? 'স্প্লিট-পে ফি ১০০% সাশ্রয়' : 'Save 100% on Split-Pay Fees'}
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!splitPayEligible}
                  onClick={() => setSchedule('split-2')}
                  className={`rounded-[4px] border p-3 text-left transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                    schedule === 'split-2'
                      ? 'border-[var(--brand)] bg-[var(--bg-tint)]'
                      : 'border-[var(--hairline)] bg-[var(--bg)] hover:bg-[var(--bg-warm)]'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? '২-কিস্তি স্প্লিট' : '2-Part Split'}
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--brand)] mt-0.5">
                    {isBn
                      ? `+${toBnDigits((feeRates.split2Rate * 100).toFixed(2))}% গেটওয়ে ও ক্লিয়ারিং ফি`
                      : `+${(feeRates.split2Rate * 100).toFixed(2)}% Gateway & Clearing Fee`}
                  </div>
                  <div className="text-[11px] text-[var(--text)] mt-0.5 font-mono">
                    {isBn ? '৫০% আজ + ৫০% ৩০ দিনে' : '50% today + 50% in 30d'}
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!splitPayEligible}
                  onClick={() => setSchedule('split-3')}
                  className={`rounded-[4px] border p-3 text-left transition-colors cursor-pointer disabled:opacity-45 disabled:cursor-not-allowed ${
                    schedule === 'split-3'
                      ? 'border-[var(--brand)] bg-[var(--bg-tint)]'
                      : 'border-[var(--hairline)] bg-[var(--bg)] hover:bg-[var(--bg-warm)]'
                  }`}
                >
                  <div className="text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? '৩-কিস্তি স্প্লিট' : '3-Part Split'}
                  </div>
                  <div className="text-[11px] font-semibold text-[var(--brand)] mt-0.5">
                    {isBn
                      ? `+${toBnDigits((feeRates.split3Rate * 100).toFixed(2))}% গেটওয়ে ও ক্লিয়ারিং ফি`
                      : `+${(feeRates.split3Rate * 100).toFixed(2)}% Gateway & Clearing Fee`}
                  </div>
                  <div className="text-[11px] text-[var(--text)] mt-0.5 font-mono">
                    {isBn ? '৪০% + ৩০% + ৩০%' : '40% + 30% + 30%'}
                  </div>
                </button>
              </div>
            </div>
          </section>

          {/* Step 2: Payment Method Selector & Billing Details */}
          <section className="bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[var(--hairline)] pb-4">
              <h2 className="lumen-h3">
                {isBn ? 'ধাপ ২: পেমেন্ট পদ্ধতি ও শিক্ষার্থীর বিলিং তথ্য' : 'Step 2: Payment Method & Billing'}
              </h2>
            </div>

            {/* Sharp Architectural Radio Rows */}
            <div className="space-y-2.5" role="radiogroup" aria-label={isBn ? 'পেমেন্ট পদ্ধতি' : 'Payment Method'}>
              {paymentMethods.map((method) => {
                const active = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center justify-between gap-4 rounded-[4px] border p-3.5 text-left transition-colors cursor-pointer ${
                      active
                        ? 'border-[var(--brand)] bg-[var(--bg-tint)]'
                        : 'border-[var(--hairline)] bg-[var(--bg)] hover:bg-[var(--bg-warm)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`h-4 w-4 rounded-[4px] border flex items-center justify-center shrink-0 ${
                          active ? 'border-[var(--brand)] bg-[var(--brand)]' : 'border-[var(--hairline)] bg-[var(--surface-paper)]'
                        }`}
                      >
                        {active && <span className="h-1.5 w-1.5 bg-white" />}
                      </span>
                      <div>
                        <div className="text-sm font-bold text-[var(--brand-ink)]">{method.label}</div>
                        <div className="text-xs text-[var(--text)]">{method.sub}</div>
                      </div>
                    </div>
                    {method.icon}
                  </button>
                );
              })}
            </div>

            {/* Manual TrxID Sub-panel */}
            {paymentMethod === 'manual' && (
              <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-4 space-y-4">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setManualMethod('bkash')}
                    className={`flex-1 rounded-[4px] border py-2 text-xs font-bold cursor-pointer ${
                      manualMethod === 'bkash'
                        ? 'border-[var(--brand)] bg-[var(--surface-paper)] text-[var(--brand)]'
                        : 'border-[var(--hairline)] bg-[var(--bg)] text-[var(--text)]'
                    }`}
                  >
                    {isBn ? 'বিকাশ মার্চেন্ট' : 'bKash Merchant'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualMethod('nagad')}
                    className={`flex-1 rounded-[4px] border py-2 text-xs font-bold cursor-pointer ${
                      manualMethod === 'nagad'
                        ? 'border-[var(--brand)] bg-[var(--surface-paper)] text-[var(--brand)]'
                        : 'border-[var(--hairline)] bg-[var(--bg)] text-[var(--text)]'
                    }`}
                  >
                    {isBn ? 'নগদ মার্চেন্ট' : 'Nagad Merchant'}
                  </button>
                </div>

                <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-3 text-xs space-y-1">
                  <div className="flex justify-between font-mono font-bold text-[var(--brand-ink)]">
                    <span>{isBn ? 'মার্চেন্ট নম্বর:' : 'Merchant No:'}</span>
                    <span className="text-[var(--brand)]">
                      {manualMethod === 'bkash' ? '01894928001' : '01894928002'}
                    </span>
                  </div>
                  <p className="text-[var(--text)]">
                    {isBn
                      ? `মোট ${formatMoney(dueTodayAmount, currency, true)} পেমেন্ট করে নিচে প্রেরকের নম্বর ও TrxID দিন।`
                      : `Send ${formatMoney(dueTodayAmount, currency, false)} via Make Payment and enter your sender number & TrxID below.`}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[var(--brand-ink)]">
                      {isBn ? 'প্রেরকের মোবাইল নম্বর' : 'Sender Mobile Number'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={manualSenderPhone}
                      onChange={(e) => setManualSenderPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-2.5 text-xs focus:border-[var(--brand)] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[var(--brand-ink)]">
                      {isBn ? 'ট্রানজেকশন আইডি (TrxID)' : 'Transaction ID (TrxID)'}
                    </label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="BL54A92K1M"
                      className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-2.5 text-xs font-mono uppercase focus:border-[var(--brand)] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Billing Inputs */}
            <div className="border-t border-[var(--hairline)] pt-5 space-y-4">
              {!isGuest && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[var(--brand-ink)]">
                      {isBn ? 'শিক্ষার্থীর পূর্ণ নাম' : 'Student Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-[var(--brand-ink)]">
                        {isBn ? 'ইমেইল ঠিকানা' : 'Email Address'}
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-[var(--brand-ink)]">
                        {isBn ? 'মোবাইল নম্বর (বাংলাদেশ)' : 'Mobile Number (BD)'}
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+8801XXXXXXXXX"
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? 'বিলিং ঠিকানা' : 'Billing Address'}
                  </label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? 'শহর' : 'City'}
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                  />
                </div>
              </div>

              {currency === 'BDT' && (
                <details className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5 text-xs">
                  <summary className="cursor-pointer font-bold text-[var(--brand-ink)] select-none">
                    {isBn
                      ? 'কর্পোরেট / বিশ্ববিদ্যালয় স্পন্সর ভ্যাট চালান (মূসক ৬.৩ BIN)'
                      : 'Corporate / University Sponsor VAT Chalan (Mushak 6.3 BIN)'}
                  </summary>
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--brand-ink)]">
                        {isBn ? 'স্পন্সর প্রতিষ্ঠানের নাম' : 'Sponsor Organization Name'}
                      </label>
                      <input
                        type="text"
                        value={corporateName}
                        onChange={(e) => setCorporateName(e.target.value)}
                        placeholder={isBn ? 'ঢাকা বিশ্ববিদ্যালয় / কর্পোরেট বিভাগ' : 'University / Corporate Sponsor'}
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-2 text-xs text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-[var(--brand-ink)]">
                        {isBn ? '১৩-ডিজিটের এনবিআর BIN নম্বর' : '13-Digit NBR BIN Number'}
                      </label>
                      <input
                        type="text"
                        value={corporateBin}
                        onChange={(e) => setCorporateBin(e.target.value)}
                        placeholder="001234567-0101"
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-2 text-xs font-mono text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                      />
                    </div>
                  </div>
                </details>
              )}
            </div>
          </section>
        </div>

        {/* Right 5 Columns: Transparent Order Ledger */}
        <aside className="lg:col-span-5 bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
          <div className="border-b border-[var(--hairline)] pb-4 flex items-center justify-between">
            <h2 className="lumen-h3">
              {isBn ? 'অর্ডার সারসংক্ষেপ ও লেজার' : 'Order Ledger'}
            </h2>
            <span className="font-mono text-xs text-[var(--brand)] font-bold">
              {selectedPlan.name}
            </span>
          </div>

          {/* Allowances Summary */}
          <ul className="space-y-2 border-b border-[var(--hairline)] pb-5 text-xs text-[var(--text)]">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span>
                {isBn
                  ? 'পূর্ণাঙ্গ কম্পিউটার-ভিত্তিক মক টেস্ট ইঞ্জিন'
                  : 'Full Computer-Based Mock Test Engine'}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span>
                {isBn
                  ? `${formatAmount(selectedPlan.fullMocks * 100, true, 0)}টি পূর্ণাঙ্গ অ্যাডাপটিভ মক টেস্ট`
                  : `${selectedPlan.fullMocks} Full Adaptive Mock Tests`}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span>
                {isBn
                  ? `${formatAmount(selectedPlan.aiCredits * 100, true, 0)}টি এআই রাইটিং / স্পিকিং মূল্যায়ন`
                  : `${selectedPlan.aiCredits} AI Writing / Speaking Evaluations`}
              </span>
            </li>
          </ul>

          {/* Promo / Scholarship Code */}
          <div className="space-y-2 border-b border-[var(--hairline)] pb-4">
            <label className="flex items-center gap-1.5 text-xs font-bold text-[var(--brand-ink)]">
              <Tag className="h-3.5 w-3.5 text-[var(--brand)]" />
              <span>{isBn ? 'প্রোমো / স্কলারশিপ কোড' : 'Promo / Scholarship Code'}</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                placeholder="LUMEN10 / DU20"
                className="flex-1 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-xs font-mono uppercase text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleApplyPromo}
                className="rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] px-3.5 py-2 text-xs font-bold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] cursor-pointer"
              >
                {isBn ? 'প্রয়োগ করুন' : 'Apply'}
              </button>
            </div>
            {promoFeedback && (
              <p className="text-[11px] font-medium text-[var(--brand-ink)]">{promoFeedback}</p>
            )}
          </div>

          {/* Ledger Breakdown */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-[var(--text)]">
              <span>{isBn ? 'বেস প্ল্যান মূল্য:' : 'Base Plan Price:'}</span>
              <span className="font-mono font-semibold text-[var(--brand-ink)]">
                {formatMoney(rawBase, currency, isBn)}
              </span>
            </div>
            {discountAmount > 0 && activePromo && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>
                  {isBn
                    ? `স্কলারশিপ ছাড় (${activePromo.code}):`
                    : `Grant Discount (${activePromo.code}):`}
                </span>
                <span className="font-mono">-{formatMoney(discountAmount, currency, isBn)}</span>
              </div>
            )}
            {processingFee > 0 && (
              <div className="flex justify-between text-[var(--text)]">
                <span>
                  {isBn
                    ? `গেটওয়ে ও ক্লিয়ারিং ফি (+${(processingFeeRate * 100).toFixed(2)}%):`
                    : `Gateway & Clearing Fee (+${(processingFeeRate * 100).toFixed(2)}%):`}
                </span>
                <span className="font-mono font-semibold text-[var(--brand-ink)]">
                  +{formatMoney(processingFee, currency, isBn)}
                </span>
              </div>
            )}
            {currency === 'BDT' ? (
              <div className="flex justify-between text-[var(--text)]">
                <span>
                  {isBn
                    ? Math.round(feeRates.vatRateBdt * 100) === 15
                      ? '১৫% বাংলাদেশ ভ্যাট (মূসক ৬.৩ অন্তর্ভুক্ত):'
                      : `${toBnDigits(String(Math.round(feeRates.vatRateBdt * 100)))}% বাংলাদেশ ভ্যাট (মূসক ৬.৩ অন্তর্ভুক্ত):`
                    : `${Math.round(feeRates.vatRateBdt * 100)}% BD VAT (Mushak 6.3 Included):`}
                </span>
                <span className="font-mono font-semibold text-[var(--brand-ink)]">
                  {formatMoney(vatAmount, currency, isBn)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between text-[var(--text)]">
                <span>{isBn ? 'আন্তর্জাতিক ট্যাক্স / ভ্যাট:' : 'International Tax / BD VAT:'}</span>
                <span className="font-mono font-semibold text-[var(--brand-ink)]">$0.00</span>
              </div>
            )}
            <div className="flex justify-between border-t border-[var(--hairline)] pt-3 text-base font-extrabold text-[var(--brand-ink)]">
              <span>{isBn ? 'সর্বমোট মূল্য:' : 'Total Amount:'}</span>
              <span className="font-mono text-[var(--brand)]">
                {formatMoney(totalAmount, currency, isBn)}
              </span>
            </div>
          </div>

          {/* Installment Schedule Dates if Split-Pay */}
          {installmentRows.length > 0 && (
            <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4 space-y-2 text-xs">
              <div className="font-bold text-[var(--brand-ink)]">
                {isBn
                  ? `স্প্লিট-পে সময়সূচী (+${(processingFeeRate * 100).toFixed(2)}% ক্লিয়ারিং ফি):`
                  : `Split-Pay Schedule (+${(processingFeeRate * 100).toFixed(2)}% Clearing Fee):`}
              </div>
              <div className="divide-y divide-[var(--hairline)]">
                {installmentRows.map((row) => (
                  <div key={row.label} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-[var(--brand-ink)]">{row.label}</div>
                      <div className="text-[11px] text-[var(--text)]">{row.date}</div>
                    </div>
                    <span className="font-mono font-bold text-[var(--brand-ink)]">
                      {formatMoney(row.amount, currency, isBn)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="rounded-[4px] border border-[var(--crimson)] bg-[var(--bg-tint)] p-3 text-xs text-[var(--brand-ink)]">
              {errorMsg}
            </div>
          )}

          {manualSuccessMsg && (
            <div className="rounded-[4px] border border-emerald-700 bg-emerald-50/70 p-3 text-xs text-emerald-900 font-medium">
              {manualSuccessMsg}
            </div>
          )}

          {/* Primary Checkout CTA */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand)] py-3.5 px-4 text-sm font-bold text-white hover:bg-[var(--link)] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <span>
                {isPending
                  ? isBn
                    ? 'প্রক্রিয়াকরণ চলছে...'
                    : 'Processing...'
                  : paymentMethod === 'manual'
                    ? isBn
                      ? 'যাচাইয়ের জন্য TrxID জমা দিন →'
                      : 'Submit Manual TrxID →'
                    : isBn
                      ? `যাচাইকৃত চেকআউটে যান (${formatMoney(dueTodayAmount, currency, true)}) →`
                      : `Proceed to Verified Checkout (${formatMoney(dueTodayAmount, currency, false)}) →`}
              </span>
            </button>

            <button
              type="button"
              onClick={handleDemoActivation}
              className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] py-2.5 px-4 text-xs font-bold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] transition-colors cursor-pointer"
            >
              <Receipt className="h-3.5 w-3.5 text-[var(--brand)]" />
              <span>
                {isBn
                  ? 'তাৎক্ষণিক ডেমো এনটাইটেলমেন্ট ও রসিদ দেখুন'
                  : 'Preview Instant Demo Entitlement & Receipt'}
              </span>
            </button>
          </div>

          {/* Demo Entitlement Receipt Preview */}
          {demoReceipt && (
            <div className="rounded-[4px] border border-emerald-700 bg-emerald-50/70 p-4 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-emerald-900">
                <span>{isBn ? 'ডেমো এনটাইটেলমেন্ট সক্রিয়' : 'Demo Entitlement Active'}</span>
                <span className="font-mono">{demoReceipt.orderCode}</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-[4px] border border-emerald-700/30 bg-[var(--surface-paper)] px-2.5 py-1.5 font-mono text-[11px] font-semibold text-emerald-900">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
                <span>{demoReceipt.verificationBadge}</span>
                {demoReceipt.signatureDigest && (
                  <span className="ml-auto text-[10px] text-[var(--text)]">
                    sig:{demoReceipt.signatureDigest}
                  </span>
                )}
              </div>
              <p className="text-[var(--text)]">
                {isBn
                  ? `${name || 'Guest Scholar'} (${email || 'guest@lumen.demo'})-এর জন্য ${selectedPlan.name} (${formatMoney(demoReceipt.verifiedTotal ?? totalAmount, demoReceipt.currency, true)}) রসিদসহ (${demoReceipt.activatedAt}) প্রস্তুত।`
                  : `${selectedPlan.name} activated for ${name || 'Guest Scholar'} (${email || 'guest@lumen.demo'}) — ${formatMoney(demoReceipt.verifiedTotal ?? totalAmount, demoReceipt.currency, false)} verified at ${demoReceipt.activatedAt}.`}
              </p>
              <LocaleLink
                href="/app"
                className="inline-flex items-center gap-1 font-bold text-[var(--link)] underline underline-offset-4"
              >
                {isBn ? 'শিক্ষার্থী ওয়ার্কস্পেসে যান' : 'Go to Learner Workspace'}
                <ArrowRight className="h-3.5 w-3.5" />
              </LocaleLink>
            </div>
          )}

          {/* Trust Bar */}
          <div className="pt-2 border-t border-[var(--hairline)]">
            <BangladeshPaymentTrustBar variant="light" locale={locale} />
          </div>
        </aside>
      </form>
    </div>
  );
}
