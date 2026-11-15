/** @purpose Interactive institutional checkout client with plan switcher, 0% bKash Split-Pay, 15% Mushak 6.3 VAT ledger, and demo receipt preview */
'use client';

import React, { useState, useTransition } from 'react';
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
} from 'lucide-react';
import { CANONICAL_PRODUCTS, type ProductDefinition } from '@lumen/core';
import { initiateCheckoutAction, submitManualCheckoutAction } from '@/app/actions/checkout';
import { BangladeshPaymentTrustBar } from '../../(marketing)/_components/BangladeshPaymentTrustBar';
import { LocaleLink } from '../../_components/LocaleLink';

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

type PaymentMethodId = 'bkash' | 'nagad' | 'rocket' | 'card' | 'manual';
type ScheduleId = 'full' | 'split-2' | 'split-3';

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'] as const;

function formatAmount(minor: number, isBn: boolean, decimals = 2): string {
  const formatted = (minor / 100).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  if (!isBn) return formatted;
  return formatted.replace(/\d/g, (d) => BN_DIGITS[Number(d)] ?? d);
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

  const [selectedProduct, setSelectedProduct] = useState<ProductDefinition>(initialProduct);
  React.useEffect(() => {
    setSelectedProduct(initialProduct);
  }, [initialProduct]);

  const splitPayEligible = selectedProduct.prices.BD >= 499000;
  const [schedule, setSchedule] = useState<ScheduleId>('full');
  React.useEffect(() => {
    if (!splitPayEligible && schedule !== 'full') {
      setSchedule('full');
    }
  }, [splitPayEligible, schedule]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodId>('bkash');
  const [manualMethod, setManualMethod] = useState<'bkash' | 'nagad'>('bkash');

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
    verifiedTotalBdt?: number;
  } | null>(null);
  const [isPending, startTransition] = useTransition();

  const totalMinor = selectedProduct.prices.BD;
  const basePriceMinor = Math.round(totalMinor / 1.15);
  const vatMinor = totalMinor - basePriceMinor;

  const dueTodayMinor =
    schedule === 'split-2'
      ? Math.round(totalMinor * 0.5)
      : schedule === 'split-3'
        ? Math.round(totalMinor * 0.4)
        : totalMinor;

  const installmentRows =
    schedule === 'split-2'
      ? [
          { label: isBn ? '১ম কিস্তি (৫০%)' : '1st Installment (50%)', date: formatDateOffset(0, isBn), amount: Math.round(totalMinor * 0.5) },
          { label: isBn ? '২য় কিস্তি (৫০%)' : '2nd Installment (50%)', date: formatDateOffset(30, isBn), amount: totalMinor - Math.round(totalMinor * 0.5) },
        ]
      : schedule === 'split-3'
        ? [
            { label: isBn ? '১ম কিস্তি (৪০%)' : '1st Installment (40%)', date: formatDateOffset(0, isBn), amount: Math.round(totalMinor * 0.4) },
            { label: isBn ? '২য় কিস্তি (৩০%)' : '2nd Installment (30%)', date: formatDateOffset(30, isBn), amount: Math.round(totalMinor * 0.3) },
            { label: isBn ? '৩য় কিস্তি (৩০%)' : '3rd Installment (30%)', date: formatDateOffset(60, isBn), amount: totalMinor - Math.round(totalMinor * 0.4) - Math.round(totalMinor * 0.3) },
          ]
        : [];

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
    totalBdt: number;
  }> => {
    const splitParts: 1 | 2 | 3 =
      schedule === 'split-2' ? 2 : schedule === 'split-3' ? 3 : 1;

    const response = await fetch('/api/checkout/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        planId: selectedProduct.slug,
        splitParts,
        clientSubmittedTotalBdt: Math.round(totalMinor / 100),
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
      canonicalOrder?: { totalBdt: number };
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
      totalBdt: data.canonicalOrder?.totalBdt ?? Math.round(totalMinor / 100),
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

          if (isGuest) {
            setDemoReceipt({
              orderCode: verified.receiptId,
              activatedAt: new Date().toLocaleTimeString(isBn ? 'bn-BD' : 'en-US', {
                hour: '2-digit',
                minute: '2-digit',
              }),
              verificationBadge: verified.verificationBadge,
              signatureDigest: verified.signature.slice(0, 16),
              verifiedTotalBdt: verified.totalBdt,
            });
            return;
          }

          const res = await initiateCheckoutAction({
            productSlug: selectedProduct.slug,
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
            productSlug: selectedProduct.slug,
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
          verifiedTotalBdt: verified.totalBdt,
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

  const paymentMethods: { id: PaymentMethodId; label: string; sub: string; icon: React.ReactNode }[] = [
    {
      id: 'bkash',
      label: isBn ? 'বিকাশ (bKash)' : 'bKash',
      sub: isBn ? 'তাৎক্ষণিক পেমেন্ট অথবা ০% স্প্লিট-পে' : 'Instant wallet checkout or 0% Split-Pay',
      icon: <Smartphone className="h-4 w-4 text-[var(--brand)]" />,
    },
    {
      id: 'nagad',
      label: isBn ? 'নগদ (Nagad)' : 'Nagad',
      sub: isBn ? 'SSLCommerz এর মাধ্যমে দ্রুত নগদ পেমেন্ট' : 'Fast Nagad checkout via SSLCommerz',
      icon: <Smartphone className="h-4 w-4 text-[var(--accent)]" />,
    },
    {
      id: 'rocket',
      label: isBn ? 'রকেট (Rocket / DBBL)' : 'Rocket (DBBL)',
      sub: isBn ? 'ডাচ-বাংলা মোবাইল ব্যাংকিং' : 'Dutch-Bangla Mobile Banking',
      icon: <Building2 className="h-4 w-4 text-[var(--brand-ink)]" />,
    },
    {
      id: 'card',
      label: isBn ? 'ভিসা / মাস্টারকার্ড (SSLCommerz)' : 'Visa / Mastercard via SSLCommerz',
      sub: isBn ? 'স্থানীয় ও আন্তর্জাতিক ডেবিট/ক্রেডিট কার্ড' : 'Local & international debit/credit cards',
      icon: <CreditCard className="h-4 w-4 text-[var(--brand-ink)]" />,
    },
    {
      id: 'manual',
      label: isBn ? 'ম্যানুয়াল বিকাশ / নগদ (TrxID)' : 'Manual bKash / Nagad (TrxID)',
      sub: isBn ? 'সরাসরি মার্চেন্ট পেমেন্ট ও TrxID যাচাই' : 'Direct merchant transfer & TrxID verification',
      icon: <ShieldCheck className="h-4 w-4 text-[var(--brand)]" />,
    },
  ];

  return (
    <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Page Header */}
      <div className="mb-8 border-b border-[var(--hairline)] pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--brand)]">
            <Lock className="h-3.5 w-3.5" />
            <span>{isBn ? 'নিরাপদ বাংলাদেশ চেকআউট • মূসক ৬.৩ অন্তর্ভুক্ত' : 'VERIFIED BANGLADESH CHECKOUT • MUSHAK 6.3 INCLUDED'}</span>
          </div>
          <h1 className="lumen-h2 mt-2">
            {isBn ? 'আপনার এনরোলমেন্ট সম্পন্ন করুন' : 'Complete Your Enrollment'}
          </h1>
        </div>
        <LocaleLink
          href="/pricing"
          className="text-xs font-semibold text-[var(--link)] underline underline-offset-4 hover:text-[var(--brand)]"
        >
          {isBn ? '← সব প্ল্যান তুলনা করুন' : '← Compare all plans'}
        </LocaleLink>
      </div>

      <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left 7 Columns: Guest Identity (if guest) + Plan & Schedule + Billing & Payment Method */}
        <div className="lg:col-span-7 space-y-8">
          {isGuest && (
            <section className="rounded-[4px] bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline)] pb-4">
                <h2 className="lumen-h3">
                  {isBn
                    ? 'ধাপ ১: শিক্ষার্থীর অ্যাকাউন্ট ও মূসক ৬.৩ বিলিং পরিচয়'
                    : 'Step 1: Scholar Account & Mushak 6.3 Billing Identity'}
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
                {isBn ? 'বিডিটি (৳)' : 'BDT (৳)'}
              </span>
            </div>

            {/* Interactive Plan Switcher */}
            <div className="space-y-2.5" role="radiogroup" aria-label={isBn ? 'প্ল্যান নির্বাচন' : 'Select Plan'}>
              {CANONICAL_PRODUCTS.map((prod) => {
                const active = prod.slug === selectedProduct.slug;
                return (
                  <button
                    key={prod.slug}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSelectedProduct(prod)}
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
                            ? `${prod.allowances.full_mocks} মক টেস্ট • ${prod.allowances.ai_credits} এআই মূল্যায়ন`
                            : `${prod.allowances.full_mocks} Full Mocks • ${prod.allowances.ai_credits} AI Evaluations`}
                        </div>
                      </div>
                    </div>
                    <div className="font-mono text-sm font-extrabold text-[var(--brand-ink)] shrink-0">
                      ৳{formatAmount(prod.prices.BD, isBn, 0)}
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
                    {isBn ? '৳৪,৯৯০+ প্ল্যানে ০% কিস্তি প্রযোজ্য' : '0% Split-Pay available on plans ≥ ৳4,990'}
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
                  <div className="text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? 'সম্পূর্ণ পেমেন্ট' : 'Full Payment'}
                  </div>
                  <div className="text-[11px] text-[var(--text)] mt-0.5 font-mono">
                    ৳{formatAmount(totalMinor, isBn, 0)} {isBn ? 'আজ' : 'today'}
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
                    {isBn ? '০% বিকাশ ২-কিস্তি' : '0% bKash 2-Part'}
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
                    {isBn ? '০% বিকাশ ৩-কিস্তি' : '0% bKash 3-Part'}
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
                      ? `মোট ৳${formatAmount(dueTodayMinor, isBn)} পেমেন্ট করে নিচে প্রেরকের নম্বর ও TrxID দিন।`
                      : `Send BDT ${formatAmount(dueTodayMinor, false)} via Make Payment and enter your sender number & TrxID below.`}
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
            </div>
          </section>
        </div>

        {/* Right 5 Columns: Transparent Order Ledger */}
        <aside className="lg:col-span-5 bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-6 lg:sticky lg:top-24">
          <div className="border-b border-[var(--hairline)] pb-4 flex items-center justify-between">
            <h2 className="lumen-h3">
              {isBn ? 'অর্ডার সারসংক্ষেপ ও ভ্যাট রসিদ' : 'Order Ledger'}
            </h2>
            <span className="font-mono text-xs text-[var(--brand)] font-bold">
              {selectedProduct.name}
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
                  ? `${formatAmount(selectedProduct.allowances.full_mocks * 100, true, 0)}টি পূর্ণাঙ্গ অ্যাডাপটিভ মক টেস্ট`
                  : `${selectedProduct.allowances.full_mocks} Full Adaptive Mock Tests`}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-700 shrink-0" />
              <span>
                {isBn
                  ? `${formatAmount(selectedProduct.allowances.ai_credits * 100, true, 0)}টি এআই রাইটিং / স্পিকিং মূল্যায়ন`
                  : `${selectedProduct.allowances.ai_credits} AI Writing / Speaking Evaluations`}
              </span>
            </li>
          </ul>

          {/* VAT Breakdown */}
          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-[var(--text)]">
              <span>{isBn ? 'মূল মূল্য (ভ্যাট ব্যতীত):' : 'Subtotal (excl. VAT):'}</span>
              <span className="font-mono font-semibold text-[var(--brand-ink)]">
                BDT {formatAmount(basePriceMinor, isBn)}
              </span>
            </div>
            <div className="flex justify-between text-[var(--text)]">
              <span>
                {isBn
                  ? '১৫% বাংলাদেশ ভ্যাট (মূসক ৬.৩ অন্তর্ভুক্ত):'
                  : '15% BD VAT (Mushak 6.3 Included):'}
              </span>
              <span className="font-mono font-semibold text-[var(--brand-ink)]">
                BDT {formatAmount(vatMinor, isBn)}
              </span>
            </div>
            <div className="flex justify-between border-t border-[var(--hairline)] pt-3 text-base font-extrabold text-[var(--brand-ink)]">
              <span>{isBn ? 'সর্বমোট মূল্য:' : 'Total (VAT Included):'}</span>
              <span className="font-mono text-[var(--brand)]">
                BDT {formatAmount(totalMinor, isBn)}
              </span>
            </div>
          </div>

          {/* Installment Schedule Dates if Split-Pay */}
          {installmentRows.length > 0 && (
            <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4 space-y-2 text-xs">
              <div className="font-bold text-[var(--brand-ink)]">
                {isBn ? '০% কিস্তির সময়সূচী:' : '0% Split-Pay Schedule:'}
              </div>
              <div className="divide-y divide-[var(--hairline)]">
                {installmentRows.map((row) => (
                  <div key={row.label} className="py-2 flex items-center justify-between gap-2">
                    <div>
                      <div className="font-semibold text-[var(--brand-ink)]">{row.label}</div>
                      <div className="text-[11px] text-[var(--text)]">{row.date}</div>
                    </div>
                    <span className="font-mono font-bold text-[var(--brand-ink)]">
                      BDT {formatAmount(row.amount, isBn)}
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
                      ? `যাচাইকৃত চেকআউটে যান (৳${formatAmount(dueTodayMinor, true, 0)}) →`
                      : `Proceed to Verified Checkout (BDT ${formatAmount(dueTodayMinor, false, 0)}) →`}
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
                  ? `${name || 'Guest Scholar'} (${email || 'guest@lumen.demo'})-এর জন্য ${selectedProduct.name} মূসক ৬.৩ রসিদসহ (${demoReceipt.activatedAt}) প্রস্তুত।`
                  : `${selectedProduct.name} activated for ${name || 'Guest Scholar'} (${email || 'guest@lumen.demo'}) with Mushak 6.3 VAT ledger at ${demoReceipt.activatedAt}.`}
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
