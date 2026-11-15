/** @purpose Enterprise 7-Module Admin ERP, Pricing/Coupon Engine & CMS Moderation Studio (/app/admin) synced live with /api/admin/catalog & /checkout */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import {
  ShieldCheck,
  Receipt,
  Tag,
  SlidersHorizontal,
  Users,
  FileCheck2,
  Lock,
  Plus,
  Download,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Search,
  RefreshCw,
} from 'lucide-react';
import type {
  RuntimeCatalogPlan,
  RuntimeCatalogSnapshot,
  RuntimeFeatureFlags,
  RuntimePsychometricItem,
  SplitMode,
  SupportedCurrency,
} from '@/src/lib/security/payment-guard';

type AdminModuleTab =
  | 'catalog'
  | 'promos'
  | 'orders'
  | 'cms'
  | 'scholars'
  | 'calibration'
  | 'audit';

interface PlanDraft {
  baseBdt: string;
  baseUsd: string;
  nameEn: string;
  nameBn: string;
  featuresText: string;
  allowSplit: boolean;
  active: boolean;
}

const COHORT_OPTIONS = [
  'GRE & IELTS Fall Cohort',
  'GRE Quant Intensive',
  'IELTS Academic Band 8.0',
  'IELTS Academic Core',
  'University B2B Cohort',
] as const;

export default function AdminEnterpriseErpPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [activeTab, setActiveTab] = useState<AdminModuleTab>('catalog');
  const [catalog, setCatalog] = useState<RuntimeCatalogSnapshot | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  // Module 1: Catalog & Fees drafts
  const [planDrafts, setPlanDrafts] = useState<Record<string, PlanDraft>>({});
  const [split2Pct, setSplit2Pct] = useState<string>('2.85');
  const [split3Pct, setSplit3Pct] = useState<string>('4.75');
  const [vatPct, setVatPct] = useState<string>('15');
  const [showAddPlan, setShowAddPlan] = useState<boolean>(false);
  const [newPlan, setNewPlan] = useState({
    planId: '',
    nameEn: '',
    nameBn: '',
    baseBdt: '6500',
    baseUsd: '65',
    featuresText: '5 Full Adaptive Mocks, 15 AI Rubric Evaluations, 180-Day Access',
    allowSplit: true,
  });

  // Module 2: Promos & Calculator
  const [promoForm, setPromoForm] = useState({
    code: 'BUET25',
    discountType: 'percent' as 'percent' | 'fixed',
    value: '25',
    maxRedemptions: '100',
    expiresAt: '2027-06-30',
    labelEn: '25% BUET & Engineering Cohort Grant',
    labelBn: '২৫% বুয়েট ও ইঞ্জিনিয়ারিং কোহর্ট ছাড়',
    active: true,
  });
  const [calcPlanId, setCalcPlanId] = useState<string>('gre-complete');
  const [calcCurrency, setCalcCurrency] = useState<SupportedCurrency>('BDT');
  const [calcSplit, setCalcSplit] = useState<SplitMode>('split-2');
  const [calcPromo, setCalcPromo] = useState<string>('LUMEN10');

  // Module 3: Orders & Mushak 6.3 preview
  const [selectedMushakOrderId, setSelectedMushakOrderId] = useState<string | null>(null);
  const [binInputMap, setBinInputMap] = useState<Record<string, string>>({});

  // Module 4: CMS & Moderation
  const [ribbonDraft, setRibbonDraft] = useState({
    enabled: true,
    textEn: '',
    textBn: '',
    ctaLabelEn: '',
    ctaLabelBn: '',
    ctaHref: '/pricing',
  });
  const [moderationNotes, setModerationNotes] = useState<Record<string, string>>({});
  const [cmsItemDraft, setCmsItemDraft] = useState({
    kind: 'vocab' as 'vocab' | 'faq',
    titleEn: '',
    titleBn: '',
    bodyEn: '',
    bodyBn: '',
  });

  // Module 5: Scholars CRM
  const [scholarSearch, setScholarSearch] = useState<string>('');

  const hydrateDrafts = (snap: RuntimeCatalogSnapshot) => {
    const nextDrafts: Record<string, PlanDraft> = {};
    for (const [id, plan] of Object.entries(snap.plans)) {
      nextDrafts[id] = {
        baseBdt: String(plan.baseBdt),
        baseUsd: String(plan.baseUsd),
        nameEn: plan.nameEn,
        nameBn: plan.nameBn,
        featuresText: plan.featuresEn.join(' | '),
        allowSplit: plan.allowSplit,
        active: plan.active,
      };
    }
    setPlanDrafts(nextDrafts);
    setSplit2Pct((snap.feeRates.split2Rate * 100).toFixed(2));
    setSplit3Pct((snap.feeRates.split3Rate * 100).toFixed(2));
    setVatPct((snap.feeRates.vatRateBdt * 100).toFixed(1));
    setRibbonDraft({
      enabled: snap.topRibbon.enabled,
      textEn: snap.topRibbon.textEn,
      textBn: snap.topRibbon.textBn,
      ctaLabelEn: snap.topRibbon.ctaLabelEn,
      ctaLabelBn: snap.topRibbon.ctaLabelBn,
      ctaHref: snap.topRibbon.ctaHref,
    });
  };

  const loadCatalog = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/catalog', { cache: 'no-store' });
      if (!res.ok) throw new Error('Failed to load runtime catalog');
      const data = (await res.json()) as RuntimeCatalogSnapshot;
      setCatalog(data);
      hydrateDrafts(data);
    } catch (err) {
      setStatusMessage({
        tone: 'err',
        text: err instanceof Error ? err.message : 'Unable to fetch /api/admin/catalog',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadCatalog();
  }, []);

  const postAdminMutation = async (payload: Record<string, unknown>, okText: string) => {
    setSaving(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        catalog?: RuntimeCatalogSnapshot;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.ok || !json.catalog) {
        throw new Error(json.message || json.error || 'Admin mutation failed');
      }
      setCatalog(json.catalog);
      hydrateDrafts(json.catalog);
      setStatusMessage({ tone: 'ok', text: okText });
    } catch (err) {
      setStatusMessage({
        tone: 'err',
        text: err instanceof Error ? err.message : 'Admin mutation failed',
      });
    } finally {
      setSaving(false);
    }
  };

  const planList: RuntimeCatalogPlan[] = useMemo(
    () => (catalog ? Object.values(catalog.plans) : []),
    [catalog],
  );

  const promoList = useMemo(
    () => (catalog ? Object.values(catalog.promoCodes) : []),
    [catalog],
  );

  const filteredScholars = useMemo(() => {
    if (!catalog) return [];
    const q = scholarSearch.trim().toLowerCase();
    if (!q) return catalog.scholars;
    return catalog.scholars.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.cohort.toLowerCase().includes(q),
    );
  }, [catalog, scholarSearch]);

  // Live Net Tuition Preview for Module 2
  const calcPreview = useMemo(() => {
    if (!catalog) return null;
    const plan = catalog.plans[calcPlanId] ?? Object.values(catalog.plans)[0];
    if (!plan) return null;
    const rawBase = calcCurrency === 'USD' ? plan.baseUsd : plan.baseBdt;
    const promoKey = calcPromo.trim().toUpperCase();
    const promo = promoKey ? catalog.promoCodes[promoKey] : undefined;
    const promoValid =
      promo &&
      promo.active &&
      (!promo.expiresAt || Date.parse(promo.expiresAt) >= Date.now()) &&
      (promo.maxRedemptions === null || promo.redemptionsCount < promo.maxRedemptions);
    const roundCurr = (n: number) => (calcCurrency === 'USD' ? Number(n.toFixed(2)) : Math.round(n));
    const discount = promoValid
      ? promo.discountType === 'percent'
        ? roundCurr((rawBase * promo.value) / 100)
        : roundCurr(Math.min(rawBase, promo.value))
      : 0;
    const discountedBase = Math.max(0, Number((rawBase - discount).toFixed(2)));
    const feeRate =
      calcSplit === 'full'
        ? 0
        : calcSplit === 'split-2'
          ? catalog.feeRates.split2Rate
          : catalog.feeRates.split3Rate;
    const fee = roundCurr(discountedBase * feeRate);
    const subtotal = Number((discountedBase + fee).toFixed(2));
    const vat = calcCurrency === 'BDT' ? Math.round(subtotal * catalog.feeRates.vatRateBdt) : 0;
    const total = Number((subtotal + vat).toFixed(2));
    return { plan, rawBase, discount, promoValid, feeRate, fee, vat, total };
  }, [catalog, calcPlanId, calcCurrency, calcSplit, calcPromo]);

  const handleExportJson = () => {
    if (!catalog) return;
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumen-admin-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs: { id: AdminModuleTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'catalog',
      label: isBn ? '১. ক্যাটালগ, মূল্য ও ফি' : '1. Catalog, Pricing & Fees',
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      id: 'promos',
      label: isBn ? '২. প্রোমো ও স্কলারশিপ' : '2. Promos & Scholarships',
      icon: <Tag className="h-4 w-4" />,
    },
    {
      id: 'orders',
      label: isBn ? '৩. অর্ডার ও মূসক ৬.৩' : '3. Orders & Mushak 6.3',
      icon: <ShieldCheck className="h-4 w-4" />,
    },
    {
      id: 'cms',
      label: isBn ? '৪. সিএমএস ও মডারেশন' : '4. CMS & Moderation',
      icon: <FileCheck2 className="h-4 w-4" />,
    },
    {
      id: 'scholars',
      label: isBn ? '৫. শিক্ষার্থী ও কোহর্ট সিআরএম' : '5. Scholars & Cohort CRM',
      icon: <Users className="h-4 w-4" />,
    },
    {
      id: 'calibration',
      label: isBn ? '৬. এআই ক্যালিব্রেশন ও ফ্ল্যাগ' : '6. AI Calibration & Flags',
      icon: <SlidersHorizontal className="h-4 w-4" />,
    },
    {
      id: 'audit',
      label: isBn ? '৭. অডিট লগ ও ব্যাকআপ' : '7. Audit Log & Backup',
      icon: <Lock className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="rounded-[4px] border border-[var(--hairline)] border-l-4 border-l-[var(--brand)] bg-[var(--surface-paper)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--brand)]">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {isBn
                  ? `${brand.name} • এন্টারপ্রাইজ ৭-মডিউল অ্যাডমিন ইআরপি ও সিএমএস`
                  : `${brand.name} • ENTERPRISE 7-MODULE ADMIN ERP & CMS STUDIO`}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--brand-ink)]">
              {isBn
                ? 'লাইভ ক্যাটালগ, স্প্লিট-পে ফি, প্রোমো ইঞ্জিন ও প্রাতিষ্ঠানিক নিয়ন্ত্রণ'
                : 'Live Catalog Pricing, Fractional Split-Pay Fees, Promos & Governance'}
            </h1>
            <p className="mt-1 text-sm text-[var(--text)]">
              {isBn
                ? 'এই কনসোল থেকে BDT/USD মূল্য, ২.৮৫%/৪.৭৫% ক্লিয়ারিং ফি ও প্রোমো কোড পরিবর্তন করলে তা তাৎক্ষণিক /checkout-এ সিঙ্ক হয়।'
                : 'All price edits, new packages, split-pay fee rates, and promo codes sync live to /checkout & payment-guard.ts.'}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3.5 py-2 text-xs font-mono text-[var(--brand-ink)]">
              Sandbox: Ayman Rahman (admin) • ayman@lumen.academy
            </div>
            <button
              type="button"
              onClick={() => void loadCatalog()}
              disabled={loading || saving}
              className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-bold text-[var(--brand-ink)] hover:border-[var(--brand)] cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>{isBn ? 'রিফ্রেশ করুন' : 'Refresh Live State'}</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <div
            role="status"
            className={`mt-4 flex items-center justify-between gap-3 rounded-[4px] border px-4 py-2.5 text-xs font-semibold ${
              statusMessage.tone === 'ok'
                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                : 'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand)]'
            }`}
          >
            <span className="flex items-center gap-2">
              {statusMessage.tone === 'ok' ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 shrink-0" />
              )}
              {statusMessage.text}
            </span>
            <button
              type="button"
              onClick={() => setStatusMessage(null)}
              className="font-mono text-[11px] underline cursor-pointer"
            >
              {isBn ? 'বন্ধ করুন' : 'Dismiss'}
            </button>
          </div>
        )}
      </section>

      {/* 7 Flat Segmented Module Tabs */}
      <div
        role="tablist"
        aria-label={isBn ? 'অ্যাডমিন ইআরপি মডিউল' : 'Admin ERP modules'}
        className="flex flex-wrap gap-2 border-b border-[var(--hairline)] pb-3"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-[4px] border px-3 py-2 text-xs font-bold transition-colors cursor-pointer ${
                active
                  ? 'border-[var(--brand)] bg-[var(--brand-deep)] text-white'
                  : 'border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-ink)] hover:border-[var(--brand)] hover:bg-[var(--bg-warm)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {loading && !catalog ? (
        <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-8 text-center font-mono text-xs text-[var(--text)]">
          {isBn ? 'লাইভ ইআরপি ক্যাটালগ লোড হচ্ছে...' : 'Loading live ERP catalog from /api/admin/catalog...'}
        </div>
      ) : (
        catalog && (
          <>
            {/* MODULE 1: Catalog, Pricing & Fees */}
            {activeTab === 'catalog' && (
              <div className="space-y-6">
                {/* Global Split-Pay & VAT Fee Controls */}
                <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline)] pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[var(--brand-ink)]">
                        {isBn ? 'ফ্র্যাকশনাল স্প্লিট-পে ফি ও ভ্যাট কনফিগারেশন' : 'Fractional Split-Pay Gateway Fees & BD VAT Rate'}
                      </h2>
                      <p className="text-xs text-[var(--text)]">
                        {isBn
                          ? 'কিস্তির জন্য গেটওয়ে ও ক্লিয়ারিং ফি (%) এবং বাংলাদেশ ভ্যাট (%) নির্ধারণ করুন।'
                          : 'Configure 2-Part / 3-Part Gateway & Clearing Fee rates and Bangladesh VAT % enforced by payment-guard.ts.'}
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        void postAdminMutation(
                          {
                            action: 'UPDATE_FEES',
                            split2Rate: Number(split2Pct) / 100,
                            split3Rate: Number(split3Pct) / 100,
                            vatRateBdt: Number(vatPct) / 100,
                          },
                          isBn
                            ? 'স্প্লিট-পে ফি ও ভ্যাট লাইভ চেকআউটে সিঙ্ক হয়েছে।'
                            : 'Split-Pay fee rates & BD VAT synced to live /checkout.',
                        )
                      }
                      className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--link)] disabled:opacity-50 cursor-pointer"
                    >
                      {isBn ? 'ফি হার সংরক্ষণ ও সিঙ্ক করুন' : 'Save Fee Rates & Sync'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[var(--brand-ink)]">
                        {isBn ? '২-কিস্তি ক্লিয়ারিং ফি (%)' : '2-Part Split Clearing Fee (%)'}
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="25"
                        value={split2Pct}
                        onChange={(e) => setSplit2Pct(e.target.value)}
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 font-mono font-bold text-[var(--brand-ink)]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[var(--brand-ink)]">
                        {isBn ? '৩-কিস্তি ক্লিয়ারিং ফি (%)' : '3-Part Split Clearing Fee (%)'}
                      </label>
                      <input
                        type="number"
                        step="0.05"
                        min="0"
                        max="25"
                        value={split3Pct}
                        onChange={(e) => setSplit3Pct(e.target.value)}
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 font-mono font-bold text-[var(--brand-ink)]"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[var(--brand-ink)]">
                        {isBn ? 'বাংলাদেশ ভ্যাট / মূসক ৬.৩ (%)' : 'Bangladesh VAT / Mushak 6.3 (%)'}
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        max="35"
                        value={vatPct}
                        onChange={(e) => setVatPct(e.target.value)}
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 font-mono font-bold text-[var(--brand-ink)]"
                      />
                    </div>
                  </div>
                </section>

                {/* Package Pricing Table + Add Package */}
                <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-3">
                    <div>
                      <h2 className="text-base font-bold text-[var(--brand-ink)]">
                        {isBn ? 'কোর্স ও মক প্যাকেজ প্রাইসিং এডিটর' : 'Package Catalog & Dual-Currency Price Matrix'}
                      </h2>
                      <span className="font-mono text-xs text-[var(--text)]">
                        {planList.length} {isBn ? 'টি সক্রিয়/সংরক্ষিত প্যাকেজ' : 'packages configured'}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAddPlan((v) => !v)}
                      className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] px-3.5 py-2 text-xs font-bold text-[var(--brand-ink)] hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{isBn ? '+ নতুন প্যাকেজ যোগ করুন' : '+ Add Package'}</span>
                    </button>
                  </div>

                  {showAddPlan && (
                    <div className="rounded-[4px] border border-[var(--brand)] bg-[var(--bg)] p-4 space-y-3 text-xs">
                      <div className="font-bold text-[var(--brand-ink)]">
                        {isBn ? 'নতুন প্রাতিষ্ঠানিক প্যাকেজ তৈরি করুন' : 'Create New Package (Synced to /checkout)'}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="slug e.g. buet-quant-sprint"
                          value={newPlan.planId}
                          onChange={(e) => setNewPlan((p) => ({ ...p, planId: e.target.value }))}
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 font-mono"
                        />
                        <input
                          type="text"
                          placeholder="Package Title (EN)"
                          value={newPlan.nameEn}
                          onChange={(e) => setNewPlan((p) => ({ ...p, nameEn: e.target.value }))}
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2"
                        />
                        <input
                          type="text"
                          placeholder="প্যাকেজের নাম (BN)"
                          value={newPlan.nameBn}
                          onChange={(e) => setNewPlan((p) => ({ ...p, nameBn: e.target.value }))}
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2"
                        />
                        <input
                          type="number"
                          placeholder="Base BDT (৳)"
                          value={newPlan.baseBdt}
                          onChange={(e) => setNewPlan((p) => ({ ...p, baseBdt: e.target.value }))}
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 font-mono"
                        />
                        <input
                          type="number"
                          placeholder="Base USD ($)"
                          value={newPlan.baseUsd}
                          onChange={(e) => setNewPlan((p) => ({ ...p, baseUsd: e.target.value }))}
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 font-mono"
                        />
                        <label className="flex items-center gap-2 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 font-semibold">
                          <input
                            type="checkbox"
                            checked={newPlan.allowSplit}
                            onChange={(e) => setNewPlan((p) => ({ ...p, allowSplit: e.target.checked }))}
                          />
                          <span>{isBn ? 'স্প্লিট-পে অনুমোদিত' : 'Allow Split-Pay'}</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        placeholder="Features separated by | (e.g. 5 Mocks | 15 AI Evals)"
                        value={newPlan.featuresText}
                        onChange={(e) => setNewPlan((p) => ({ ...p, featuresText: e.target.value }))}
                        className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowAddPlan(false)}
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-1.5 font-bold cursor-pointer"
                        >
                          {isBn ? 'বাতিল' : 'Cancel'}
                        </button>
                        <button
                          type="button"
                          disabled={saving || !newPlan.planId.trim() || !newPlan.nameEn.trim()}
                          onClick={() => {
                            const featuresEn = newPlan.featuresText
                              .split(/[|,]/)
                              .map((s) => s.trim())
                              .filter(Boolean);
                            void postAdminMutation(
                              {
                                action: 'ADD_PLAN',
                                planId: newPlan.planId,
                                nameEn: newPlan.nameEn,
                                nameBn: newPlan.nameBn || newPlan.nameEn,
                                baseBdt: Number(newPlan.baseBdt) || 0,
                                baseUsd: Number(newPlan.baseUsd) || 0,
                                featuresEn,
                                allowSplit: newPlan.allowSplit,
                              },
                              `Package "${newPlan.planId}" created & synced to live /checkout.`,
                            );
                            setShowAddPlan(false);
                          }}
                          className="rounded-[4px] bg-[var(--brand)] px-4 py-1.5 font-bold text-white cursor-pointer disabled:opacity-50"
                        >
                          {isBn ? 'প্যাকেজ তৈরি করুন' : 'Create Package'}
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--hairline)] text-[var(--text)]">
                          <th className="py-2.5 pr-3 font-semibold">{isBn ? 'প্যাকেজ ও স্লাগ' : 'Package & Slug'}</th>
                          <th className="py-2.5 pr-3 font-semibold">{isBn ? 'বেস BDT (৳)' : 'Base BDT (৳)'}</th>
                          <th className="py-2.5 pr-3 font-semibold">{isBn ? 'বেস USD ($)' : 'Base USD ($)'}</th>
                          <th className="py-2.5 pr-3 font-semibold">{isBn ? 'ফিচারসমূহ' : 'Bullet Features'}</th>
                          <th className="py-2.5 pr-3 font-semibold">{isBn ? 'স্প্লিট / সক্রিয়' : 'Split / Active'}</th>
                          <th className="py-2.5 font-semibold">{isBn ? 'অ্যাকশন' : 'Sync'}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--hairline)]">
                        {planList.map((plan) => {
                          const draft = planDrafts[plan.planId];
                          if (!draft) return null;
                          return (
                            <tr key={plan.planId}>
                              <td className="py-3 pr-3 align-top min-w-[190px]">
                                <input
                                  type="text"
                                  value={draft.nameEn}
                                  onChange={(e) =>
                                    setPlanDrafts((prev) => ({
                                      ...prev,
                                      [plan.planId]: { ...draft, nameEn: e.target.value },
                                    }))
                                  }
                                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-1 font-bold text-[var(--brand-ink)]"
                                />
                                <div className="mt-1 font-mono text-[11px] text-[var(--text)]">
                                  {plan.planId} • Total ৳{plan.totalBdt.toLocaleString()}
                                </div>
                              </td>
                              <td className="py-3 pr-3 align-top">
                                <input
                                  type="number"
                                  value={draft.baseBdt}
                                  onChange={(e) =>
                                    setPlanDrafts((prev) => ({
                                      ...prev,
                                      [plan.planId]: { ...draft, baseBdt: e.target.value },
                                    }))
                                  }
                                  className="w-24 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-1 font-mono font-bold text-[var(--brand-ink)]"
                                />
                              </td>
                              <td className="py-3 pr-3 align-top">
                                <input
                                  type="number"
                                  value={draft.baseUsd}
                                  onChange={(e) =>
                                    setPlanDrafts((prev) => ({
                                      ...prev,
                                      [plan.planId]: { ...draft, baseUsd: e.target.value },
                                    }))
                                  }
                                  className="w-20 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-1 font-mono font-bold text-[var(--brand-ink)]"
                                />
                              </td>
                              <td className="py-3 pr-3 align-top min-w-[220px]">
                                <input
                                  type="text"
                                  value={draft.featuresText}
                                  onChange={(e) =>
                                    setPlanDrafts((prev) => ({
                                      ...prev,
                                      [plan.planId]: { ...draft, featuresText: e.target.value },
                                    }))
                                  }
                                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-1 text-[11px] text-[var(--text)]"
                                />
                              </td>
                              <td className="py-3 pr-3 align-top space-y-1">
                                <label className="flex items-center gap-1.5 text-[11px]">
                                  <input
                                    type="checkbox"
                                    checked={draft.allowSplit}
                                    onChange={(e) =>
                                      setPlanDrafts((prev) => ({
                                        ...prev,
                                        [plan.planId]: { ...draft, allowSplit: e.target.checked },
                                      }))
                                    }
                                  />
                                  <span>{isBn ? 'স্প্লিট' : 'Split'}</span>
                                </label>
                                <label className="flex items-center gap-1.5 text-[11px]">
                                  <input
                                    type="checkbox"
                                    checked={draft.active}
                                    onChange={(e) =>
                                      setPlanDrafts((prev) => ({
                                        ...prev,
                                        [plan.planId]: { ...draft, active: e.target.checked },
                                      }))
                                    }
                                  />
                                  <span>{isBn ? 'সক্রিয়' : 'Active'}</span>
                                </label>
                              </td>
                              <td className="py-3 align-top">
                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() =>
                                    void postAdminMutation(
                                      {
                                        action: 'UPDATE_PLAN',
                                        planId: plan.planId,
                                        nameEn: draft.nameEn,
                                        nameBn: draft.nameBn,
                                        baseBdt: Number(draft.baseBdt) || 0,
                                        baseUsd: Number(draft.baseUsd) || 0,
                                        featuresEn: draft.featuresText
                                          .split('|')
                                          .map((s) => s.trim())
                                          .filter(Boolean),
                                        allowSplit: draft.allowSplit,
                                        active: draft.active,
                                      },
                                      `${plan.planId} synced to live /checkout (৳${draft.baseBdt} / $${draft.baseUsd}).`,
                                    )
                                  }
                                  className="rounded-[4px] bg-[var(--brand-deep)] px-3 py-1.5 text-[11px] font-bold text-white hover:bg-[var(--brand)] cursor-pointer disabled:opacity-50"
                                >
                                  {isBn ? 'সেভ ও সিঙ্ক' : 'Save & Sync to Live Checkout'}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {/* MODULE 2: Promos, Scholarships & B2B Vouchers */}
            {activeTab === 'promos' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <section className="lg:col-span-7 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-5">
                  <div className="border-b border-[var(--hairline)] pb-3 flex items-center justify-between">
                    <h2 className="text-base font-bold text-[var(--brand-ink)]">
                      {isBn ? 'প্রোমো কোড, স্কলারশিপ ও বি২বি ভাউচার ইঞ্জিন' : 'Promo Codes, Scholarships & B2B Vouchers'}
                    </h2>
                    <span className="font-mono text-xs text-[var(--text)]">{promoList.length} codes</span>
                  </div>

                  {/* Upsert Form */}
                  <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4 space-y-3 text-xs">
                    <div className="font-bold text-[var(--brand-ink)]">
                      {isBn ? 'নতুন বা বিদ্যমান প্রোমো কোড সংরক্ষণ করুন' : 'Create or Update Promo / Scholarship Code'}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="CODE (e.g. BUET25)"
                        value={promoForm.code}
                        onChange={(e) => setPromoForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 font-mono uppercase font-bold"
                      />
                      <select
                        value={promoForm.discountType}
                        onChange={(e) =>
                          setPromoForm((p) => ({ ...p, discountType: e.target.value as 'percent' | 'fixed' }))
                        }
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2"
                      >
                        <option value="percent">{isBn ? 'শতাংশ (%)' : 'Percentage (%)'}</option>
                        <option value="fixed">{isBn ? 'নির্দিষ্ট অঙ্ক (BDT/USD)' : 'Fixed Amount (BDT/USD)'}</option>
                      </select>
                      <input
                        type="number"
                        placeholder="Value"
                        value={promoForm.value}
                        onChange={(e) => setPromoForm((p) => ({ ...p, value: e.target.value }))}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 font-mono font-bold"
                      />
                      <input
                        type="number"
                        placeholder="Max Redemptions"
                        value={promoForm.maxRedemptions}
                        onChange={(e) => setPromoForm((p) => ({ ...p, maxRedemptions: e.target.value }))}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 font-mono"
                      />
                      <input
                        type="date"
                        value={promoForm.expiresAt}
                        onChange={(e) => setPromoForm((p) => ({ ...p, expiresAt: e.target.value }))}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 font-mono"
                      />
                      <input
                        type="text"
                        placeholder="Label (EN)"
                        value={promoForm.labelEn}
                        onChange={(e) => setPromoForm((p) => ({ ...p, labelEn: e.target.value }))}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2"
                      />
                    </div>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            setPromoForm({
                              code: 'CORP50',
                              discountType: 'percent',
                              value: '50',
                              maxRedemptions: '50',
                              expiresAt: '2027-12-31',
                              labelEn: '50% Corporate Partner Voucher',
                              labelBn: '৫০% কর্পোরেট পার্টনার ভাউচার',
                              active: true,
                            })
                          }
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-1 text-[11px] font-mono cursor-pointer"
                        >
                          Preset: CORP50
                        </button>
                      </div>
                      <button
                        type="button"
                        disabled={saving || !promoForm.code.trim()}
                        onClick={() =>
                          void postAdminMutation(
                            {
                              action: 'UPSERT_PROMO',
                              code: promoForm.code,
                              discountType: promoForm.discountType,
                              value: Number(promoForm.value) || 10,
                              active: promoForm.active,
                              labelEn: promoForm.labelEn,
                              labelBn: promoForm.labelBn,
                              maxRedemptions: promoForm.maxRedemptions ? Number(promoForm.maxRedemptions) : null,
                              expiresAt: promoForm.expiresAt || null,
                            },
                            `Promo code ${promoForm.code} saved & live in /checkout.`,
                          )
                        }
                        className="rounded-[4px] bg-[var(--brand)] px-4 py-2 font-bold text-white hover:bg-[var(--link)] cursor-pointer disabled:opacity-50"
                      >
                        {isBn ? 'প্রোমো সংরক্ষণ করুন' : 'Save Promo Code'}
                      </button>
                    </div>
                  </div>

                  {/* Active Promo Codes Table */}
                  <div className="divide-y divide-[var(--hairline)] text-xs">
                    {promoList.map((promo) => (
                      <div key={promo.code} className="py-3 flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-extrabold text-[var(--brand-ink)]">{promo.code}</span>
                            <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[11px]">
                              {promo.discountType === 'percent' ? `${promo.value}% OFF` : `${promo.value} FIXED`}
                            </span>
                            <span
                              className={`rounded-[4px] border px-2 py-0.5 font-mono text-[11px] font-bold ${
                                promo.active
                                  ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                                  : 'border-[var(--hairline)] bg-[var(--bg)] text-[var(--text)]'
                              }`}
                            >
                              {promo.active ? 'ACTIVE' : 'PAUSED'}
                            </span>
                          </div>
                          <div className="mt-1 text-[11px] text-[var(--text)]">
                            {isBn ? promo.labelBn : promo.labelEn} • Uses: {promo.redemptionsCount}
                            {promo.maxRedemptions ? `/${promo.maxRedemptions}` : ''}
                            {promo.expiresAt ? ` • Exp: ${promo.expiresAt}` : ''}
                          </div>
                        </div>
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            void postAdminMutation(
                              { action: 'TOGGLE_PROMO', code: promo.code, active: !promo.active },
                              `Promo ${promo.code} ${!promo.active ? 'activated' : 'paused'}.`,
                            )
                          }
                          className="rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] px-3 py-1.5 text-[11px] font-bold text-[var(--brand-ink)] hover:border-[var(--brand)] cursor-pointer"
                        >
                          {promo.active ? (isBn ? 'বিরতি দিন' : 'Pause') : isBn ? 'সক্রিয় করুন' : 'Activate'}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Net Tuition Live Test Calculator */}
                <section className="lg:col-span-5 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                  <h2 className="text-base font-bold text-[var(--brand-ink)] border-b border-[var(--hairline)] pb-3">
                    {isBn ? 'নেট টিউশন টেস্ট ক্যালকুলেটর' : 'Net Tuition Live Test Calculator'}
                  </h2>

                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-[var(--brand-ink)]">Package</label>
                      <select
                        value={calcPlanId}
                        onChange={(e) => setCalcPlanId(e.target.value)}
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2"
                      >
                        {planList.map((p) => (
                          <option key={p.planId} value={p.planId}>
                            {p.nameEn} (৳{p.baseBdt} / ${p.baseUsd})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-[var(--brand-ink)]">Currency</label>
                        <select
                          value={calcCurrency}
                          onChange={(e) => setCalcCurrency(e.target.value as SupportedCurrency)}
                          className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2"
                        >
                          <option value="BDT">Bangladesh (BDT ৳)</option>
                          <option value="USD">International (USD $)</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-[var(--brand-ink)]">Split Mode</label>
                        <select
                          value={calcSplit}
                          onChange={(e) => setCalcSplit(e.target.value as SplitMode)}
                          className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2"
                        >
                          <option value="full">Full (0%)</option>
                          <option value="split-2">2-Part (+{(catalog.feeRates.split2Rate * 100).toFixed(2)}%)</option>
                          <option value="split-3">3-Part (+{(catalog.feeRates.split3Rate * 100).toFixed(2)}%)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block font-bold text-[var(--brand-ink)]">Promo Code</label>
                      <input
                        type="text"
                        value={calcPromo}
                        onChange={(e) => setCalcPromo(e.target.value.toUpperCase())}
                        placeholder="LUMEN10"
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 font-mono uppercase"
                      />
                    </div>
                  </div>

                  {calcPreview && (
                    <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4 space-y-2 text-xs font-mono">
                      <div className="flex justify-between">
                        <span>Base Price:</span>
                        <span>{calcCurrency === 'USD' ? `$${calcPreview.rawBase}` : `৳${calcPreview.rawBase}`}</span>
                      </div>
                      <div className="flex justify-between text-emerald-800">
                        <span>Discount {calcPreview.promoValid ? `(${calcPromo})` : '(None)'}:</span>
                        <span>-{calcCurrency === 'USD' ? `$${calcPreview.discount}` : `৳${calcPreview.discount}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clearing Fee (+{(calcPreview.feeRate * 100).toFixed(2)}%):</span>
                        <span>+{calcCurrency === 'USD' ? `$${calcPreview.fee}` : `৳${calcPreview.fee}`}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>BD VAT ({(catalog.feeRates.vatRateBdt * 100).toFixed(1)}%):</span>
                        <span>{calcCurrency === 'USD' ? '$0.00' : `৳${calcPreview.vat}`}</span>
                      </div>
                      <div className="flex justify-between border-t border-[var(--hairline)] pt-2 text-sm font-extrabold text-[var(--brand)]">
                        <span>Canonical Total:</span>
                        <span>{calcCurrency === 'USD' ? `$${calcPreview.total}` : `৳${calcPreview.total}`}</span>
                      </div>
                    </div>
                  )}
                </section>
              </div>
            )}

            {/* MODULE 3: Orders, Split-Pay Ledger & Mushak 6.3 */}
            {activeTab === 'orders' && (
              <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline)] pb-3">
                  <h2 className="text-base font-bold text-[var(--brand-ink)]">
                    {isBn ? 'অর্ডার, স্প্লিট-পে লেজার ও মূসক ৬.৩ ভ্যাট চালান' : 'BDT / USD Orders, Split-Pay Ledger & Mushak 6.3'}
                  </h2>
                  <span className="font-mono text-xs text-[var(--text)]">{catalog.orders.length} records</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--hairline)] text-[var(--text)]">
                        <th className="py-2.5 pr-3 font-semibold">Order ID</th>
                        <th className="py-2.5 pr-3 font-semibold">Scholar & Cohort</th>
                        <th className="py-2.5 pr-3 font-semibold">Plan & Rail</th>
                        <th className="py-2.5 pr-3 font-semibold">Amount</th>
                        <th className="py-2.5 pr-3 font-semibold">Status</th>
                        <th className="py-2.5 font-semibold">Operations</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--hairline)]">
                      {catalog.orders.map((order) => (
                        <tr key={order.id}>
                          <td className="py-3 pr-3 font-mono font-bold text-[var(--brand-ink)]">
                            <div>{order.id}</div>
                            <div className="text-[10px] font-normal text-[var(--text)]">{order.createdAt}</div>
                          </td>
                          <td className="py-3 pr-3">
                            <div className="font-bold text-[var(--brand-ink)]">{order.scholar}</div>
                            <div className="text-[11px] text-[var(--text)]">{order.cohort}</div>
                          </td>
                          <td className="py-3 pr-3">
                            <div className="font-semibold text-[var(--brand-ink)]">{order.planLabel}</div>
                            <div className="text-[11px] text-[var(--text)]">{order.paymentMethod}</div>
                          </td>
                          <td className="py-3 pr-3 font-mono font-bold text-[var(--brand-ink)]">
                            {order.currency === 'USD' ? `$${order.amount.toFixed(2)}` : `৳${order.amount.toLocaleString()}`}
                          </td>
                          <td className="py-3 pr-3">
                            <span className="inline-block rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[11px] font-semibold">
                              {order.splitStatus}
                            </span>
                            {order.mushakVerified && (
                              <div className="mt-1 font-mono text-[10px] text-emerald-800 font-bold">
                                {order.mushakChalanId}
                              </div>
                            )}
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1.5">
                              {order.splitStatus !== 'Paid in Full' && order.splitStatus !== 'Refunded' && (
                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() =>
                                    void postAdminMutation(
                                      { action: 'ORDER_ACTION', orderId: order.id, operation: 'mark_paid' },
                                      `Order ${order.id} marked Paid in Full.`,
                                    )
                                  }
                                  className="rounded-[4px] border border-emerald-700 bg-emerald-50 px-2 py-1 text-[11px] font-bold text-emerald-900 cursor-pointer"
                                >
                                  {isBn ? 'পেইড মার্ক' : 'Mark Paid'}
                                </button>
                              )}
                              {order.currency === 'BDT' && (
                                <>
                                  <input
                                    type="text"
                                    placeholder="BIN (optional)"
                                    value={binInputMap[order.id] ?? order.corporateBin ?? ''}
                                    onChange={(e) =>
                                      setBinInputMap((prev) => ({ ...prev, [order.id]: e.target.value }))
                                    }
                                    className="w-28 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-1 font-mono text-[11px]"
                                  />
                                  <button
                                    type="button"
                                    disabled={saving}
                                    onClick={() => {
                                      setSelectedMushakOrderId(order.id);
                                      void postAdminMutation(
                                        {
                                          action: 'ORDER_ACTION',
                                          orderId: order.id,
                                          operation: 'issue_mushak',
                                          corporateBin: binInputMap[order.id] ?? order.corporateBin ?? undefined,
                                        },
                                        `Mushak 6.3 Chalan generated for ${order.id}.`,
                                      );
                                    }}
                                    className="rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] px-2 py-1 text-[11px] font-bold text-[var(--brand-ink)] cursor-pointer"
                                  >
                                    {isBn ? 'মূসক ৬.৩ ইস্যু' : 'Mushak 6.3'}
                                  </button>
                                </>
                              )}
                              {order.splitStatus !== 'Refunded' && (
                                <button
                                  type="button"
                                  disabled={saving}
                                  onClick={() =>
                                    void postAdminMutation(
                                      { action: 'ORDER_ACTION', orderId: order.id, operation: 'refund' },
                                      `7-Day policy refund issued for ${order.id}.`,
                                    )
                                  }
                                  className="rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-2 py-1 text-[11px] font-bold text-[var(--brand)] cursor-pointer"
                                >
                                  {isBn ? 'রিফান্ড' : '7-Day Refund'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {selectedMushakOrderId && (() => {
                  const o = catalog.orders.find((row) => row.id === selectedMushakOrderId);
                  if (!o) return null;
                  const vatRate = catalog.feeRates.vatRateBdt;
                  const baseExVat = Math.round(o.amount / (1 + vatRate));
                  const vatAmt = o.amount - baseExVat;
                  return (
                    <div className="rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] p-4 text-xs space-y-2">
                      <div className="flex items-center justify-between font-mono font-bold text-[var(--brand-ink)]">
                        <span>GOVERNMENT OF BANGLADESH • NBR FORM MUSHAK-6.3 PREVIEW</span>
                        <span>{o.mushakChalanId ?? 'PENDING'}</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 font-mono">
                        <div>
                          <div className="text-[10px] text-[var(--text)]">Scholar / Org</div>
                          <div className="font-bold">{o.scholar}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[var(--text)]">Buyer NBR BIN</div>
                          <div className="font-bold">{o.corporateBin || 'Individual Scholar'}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[var(--text)]">Taxable Tuition</div>
                          <div className="font-bold">৳{baseExVat.toLocaleString()}</div>
                        </div>
                        <div>
                          <div className="text-[10px] text-[var(--text)]">15% VAT & Total</div>
                          <div className="font-bold text-[var(--brand)]">
                            ৳{vatAmt.toLocaleString()} / ৳{o.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </section>
            )}

            {/* MODULE 4: CMS, Banner & Content Moderation */}
            {activeTab === 'cms' && (
              <div className="space-y-6">
                {/* TopRibbon Announcement Editor */}
                <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
                    <h2 className="text-base font-bold text-[var(--brand-ink)]">
                      {isBn ? 'লাইভ টপ রিবন অ্যানাউন্সমেন্ট এডিটর' : 'Live TopRibbon Announcement Banner (EN / BN)'}
                    </h2>
                    <label className="flex items-center gap-2 text-xs font-bold">
                      <input
                        type="checkbox"
                        checked={ribbonDraft.enabled}
                        onChange={(e) => setRibbonDraft((r) => ({ ...r, enabled: e.target.checked }))}
                      />
                      <span>{isBn ? 'ব্যানার সক্রিয়' : 'Banner Enabled'}</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="block font-bold text-[var(--brand-ink)]">Announcement (EN)</label>
                      <input
                        type="text"
                        value={ribbonDraft.textEn}
                        onChange={(e) => setRibbonDraft((r) => ({ ...r, textEn: e.target.value }))}
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-[var(--brand-ink)]">Announcement (BN)</label>
                      <input
                        type="text"
                        value={ribbonDraft.textBn}
                        onChange={(e) => setRibbonDraft((r) => ({ ...r, textBn: e.target.value }))}
                        className="mt-1 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        void postAdminMutation(
                          {
                            action: 'CMS_UPDATE',
                            kind: 'top_ribbon',
                            ...ribbonDraft,
                          },
                          'TopRibbon banner CMS updated.',
                        )
                      }
                      className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white cursor-pointer"
                    >
                      {isBn ? 'ব্যানার সংরক্ষণ করুন' : 'Save Announcement Banner'}
                    </button>
                  </div>
                </section>

                {/* Flagged Submission Moderation */}
                <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                  <h2 className="text-base font-bold text-[var(--brand-ink)] border-b border-[var(--hairline)] pb-3">
                    {isBn ? 'রাইটিং, স্পিকিং ও ফোরাম মডারেশন কিউ' : 'Student Writing, Speaking & Forum Moderation Queue'}
                  </h2>
                  <div className="space-y-4">
                    {catalog.moderationQueue.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4 space-y-3 text-xs"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="font-bold text-[var(--brand-ink)]">
                            <span className="font-mono text-[var(--brand)]">{item.id}</span> • {item.scholar} • {item.task}
                          </div>
                          <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-1 font-mono font-bold">
                            {item.aiBandOrScore} • {item.status}
                          </span>
                        </div>
                        <p className="text-[var(--text)] italic">&ldquo;{item.excerpt}&rdquo;</p>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <input
                            type="text"
                            placeholder="Moderator feedback note..."
                            value={moderationNotes[item.id] ?? item.feedbackNote}
                            onChange={(e) =>
                              setModerationNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                            }
                            className="flex-1 min-w-[220px] rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-1.5"
                          />
                          <div className="flex gap-2">
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() =>
                                void postAdminMutation(
                                  {
                                    action: 'CMS_UPDATE',
                                    kind: 'moderate',
                                    submissionId: item.id,
                                    decision: 'approve',
                                    feedbackNote: moderationNotes[item.id] ?? item.feedbackNote,
                                  },
                                  `Submission ${item.id} approved.`,
                                )
                              }
                              className="rounded-[4px] bg-emerald-800 px-3 py-1.5 font-bold text-white cursor-pointer"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() =>
                                void postAdminMutation(
                                  {
                                    action: 'CMS_UPDATE',
                                    kind: 'moderate',
                                    submissionId: item.id,
                                    decision: 'revision',
                                    feedbackNote: moderationNotes[item.id] ?? item.feedbackNote,
                                  },
                                  `Revision requested for ${item.id}.`,
                                )
                              }
                              className="rounded-[4px] border border-[var(--brand-ink)] bg-[var(--surface-paper)] px-3 py-1.5 font-bold text-[var(--brand-ink)] cursor-pointer"
                            >
                              Request Revision
                            </button>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() =>
                                void postAdminMutation(
                                  {
                                    action: 'CMS_UPDATE',
                                    kind: 'moderate',
                                    submissionId: item.id,
                                    decision: 'remove',
                                    feedbackNote: moderationNotes[item.id] ?? item.feedbackNote,
                                  },
                                  `Submission ${item.id} removed.`,
                                )
                              }
                              className="rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-3 py-1.5 font-bold text-[var(--brand)] cursor-pointer"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>

                {/* Vocab / FAQ CMS */}
                <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4 text-xs">
                  <h2 className="text-base font-bold text-[var(--brand-ink)] border-b border-[var(--hairline)] pb-3">
                    {isBn ? 'ভোকাবুলারি ও এফএকিউ সিএমএস এন্ট্রি' : 'Vocabulary & FAQ CMS Entries'}
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {catalog.cmsItems.map((entry) => (
                      <div key={entry.id} className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3">
                        <div className="font-mono text-[10px] font-bold text-[var(--brand)] uppercase">
                          {entry.kind} • {entry.id}
                        </div>
                        <div className="mt-1 font-bold text-[var(--brand-ink)]">{entry.titleEn}</div>
                        <div className="text-[var(--text)] mt-0.5">{entry.bodyEn}</div>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-2 border-t border-[var(--hairline)]">
                    <select
                      value={cmsItemDraft.kind}
                      onChange={(e) =>
                        setCmsItemDraft((c) => ({ ...c, kind: e.target.value as 'vocab' | 'faq' }))
                      }
                      className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-2"
                    >
                      <option value="vocab">Vocab</option>
                      <option value="faq">FAQ</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Title (EN)"
                      value={cmsItemDraft.titleEn}
                      onChange={(e) => setCmsItemDraft((c) => ({ ...c, titleEn: e.target.value }))}
                      className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Title (BN)"
                      value={cmsItemDraft.titleBn}
                      onChange={(e) => setCmsItemDraft((c) => ({ ...c, titleBn: e.target.value }))}
                      className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-2"
                    />
                    <input
                      type="text"
                      placeholder="Body / Definition (EN)"
                      value={cmsItemDraft.bodyEn}
                      onChange={(e) => setCmsItemDraft((c) => ({ ...c, bodyEn: e.target.value }))}
                      className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-2"
                    />
                    <button
                      type="button"
                      disabled={saving || !cmsItemDraft.titleEn.trim() || !cmsItemDraft.bodyEn.trim()}
                      onClick={() => {
                        const newId = `CMS-${cmsItemDraft.kind.toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;
                        void postAdminMutation(
                          {
                            action: 'CMS_UPDATE',
                            kind: 'upsert_item',
                            item: {
                              id: newId,
                              kind: cmsItemDraft.kind,
                              titleEn: cmsItemDraft.titleEn,
                              titleBn: cmsItemDraft.titleBn || cmsItemDraft.titleEn,
                              bodyEn: cmsItemDraft.bodyEn,
                              bodyBn: cmsItemDraft.bodyBn || cmsItemDraft.bodyEn,
                              active: true,
                            },
                          },
                          `Added ${cmsItemDraft.kind} entry "${cmsItemDraft.titleEn}".`,
                        );
                        setCmsItemDraft({ kind: 'vocab', titleEn: '', titleBn: '', bodyEn: '', bodyBn: '' });
                      }}
                      className="rounded-[4px] bg-[var(--brand-deep)] px-3 py-2 font-bold text-white cursor-pointer disabled:opacity-50"
                    >
                      + Add CMS Item
                    </button>
                  </div>
                </section>
              </div>
            )}

            {/* MODULE 5: Scholars & Cohort CRM */}
            {activeTab === 'scholars' && (
              <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-3">
                  <h2 className="text-base font-bold text-[var(--brand-ink)]">
                    {isBn ? 'শিক্ষার্থী অনুসন্ধান, ক্রেডিট ও কোহর্ট সিআরএম' : 'Scholars Directory, AI Credits & Cohort CRM'}
                  </h2>
                  <div className="relative">
                    <Search className="h-3.5 w-3.5 text-[var(--text)] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={scholarSearch}
                      onChange={(e) => setScholarSearch(e.target.value)}
                      placeholder={isBn ? 'নাম, ইমেইল বা কোহর্ট খুঁজুন...' : 'Search scholar, email, cohort...'}
                      className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] pl-8 pr-3 py-1.5 text-xs w-64"
                    />
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[var(--hairline)] text-[var(--text)]">
                        <th className="py-2.5 pr-3 font-semibold">Scholar</th>
                        <th className="py-2.5 pr-3 font-semibold">Cohort Track</th>
                        <th className="py-2.5 pr-3 font-semibold">AI Credits</th>
                        <th className="py-2.5 pr-3 font-semibold">Expiry</th>
                        <th className="py-2.5 pr-3 font-semibold">Diagnostic</th>
                        <th className="py-2.5 font-semibold">CRM Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--hairline)]">
                      {filteredScholars.map((s) => (
                        <tr key={s.id}>
                          <td className="py-3 pr-3">
                            <div className="font-bold text-[var(--brand-ink)]">{s.name}</div>
                            <div className="font-mono text-[11px] text-[var(--text)]">{s.email}</div>
                          </td>
                          <td className="py-3 pr-3">
                            <select
                              value={s.cohort}
                              onChange={(e) =>
                                void postAdminMutation(
                                  {
                                    action: 'SCHOLAR_ACTION',
                                    scholarId: s.id,
                                    operation: 'switch_cohort',
                                    cohort: e.target.value,
                                  },
                                  `Moved ${s.name} to ${e.target.value}.`,
                                )
                              }
                              className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-1 text-xs"
                            >
                              {COHORT_OPTIONS.map((c) => (
                                <option key={c} value={c}>
                                  {c}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="py-3 pr-3 font-mono font-bold text-[var(--brand-ink)]">
                            {s.aiCreditsRemaining}
                          </td>
                          <td className="py-3 pr-3 font-mono text-[var(--text)]">{s.expiresAt}</td>
                          <td className="py-3 pr-3">
                            <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-0.5 font-mono text-[11px]">
                              {s.diagnosticStatus} ({s.bandEstimate})
                            </span>
                          </td>
                          <td className="py-3">
                            <div className="flex flex-wrap gap-1.5">
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                  void postAdminMutation(
                                    {
                                      action: 'SCHOLAR_ACTION',
                                      scholarId: s.id,
                                      operation: 'grant_ai_credits',
                                      credits: 5,
                                    },
                                    `Granted +5 AI credits to ${s.name}.`,
                                  )
                                }
                                className="rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] px-2.5 py-1 text-[11px] font-bold cursor-pointer"
                              >
                                +5 AI Credits
                              </button>
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                  void postAdminMutation(
                                    { action: 'SCHOLAR_ACTION', scholarId: s.id, operation: 'extend_30d' },
                                    `Extended access +30 days for ${s.name}.`,
                                  )
                                }
                                className="rounded-[4px] border border-emerald-700 bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-900 cursor-pointer"
                              >
                                +30 Days
                              </button>
                              <button
                                type="button"
                                disabled={saving}
                                onClick={() =>
                                  void postAdminMutation(
                                    { action: 'SCHOLAR_ACTION', scholarId: s.id, operation: 'reset_diagnostic' },
                                    `Diagnostic reset for ${s.name}.`,
                                  )
                                }
                                className="rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-2.5 py-1 text-[11px] font-bold text-[var(--brand)] cursor-pointer"
                              >
                                Reset Diagnostic
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* MODULE 6: AI Calibration, Psychometrics & Kill-Switches */}
            {activeTab === 'calibration' && (
              <div className="space-y-6">
                <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                  <h2 className="text-base font-bold text-[var(--brand-ink)] border-b border-[var(--hairline)] pb-3">
                    {isBn
                      ? 'সিস্টেম কিল-সুইচ ও রেট-লিমিট গার্ড'
                      : 'System Feature Flags, Kill-Switches & Rate-Limit Guards'}
                  </h2>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {(
                      [
                        {
                          key: 'translateBudgetGuard',
                          label: '/api/translate Budget Guard',
                          desc: 'Caps LLM translation volume per minute to prevent quota overrun.',
                        },
                        {
                          key: 'guestCheckoutEnabled',
                          label: 'Guest Checkout Enrollment',
                          desc: 'Allows guest scholars to purchase without pre-existing session.',
                        },
                        {
                          key: 'splitPayEnabled',
                          label: 'Split-Pay Availability (2-Part / 3-Part)',
                          desc: 'Enables fractional clearing-fee installment schedules in /checkout.',
                        },
                        {
                          key: 'maintenanceBanner',
                          label: 'Exam Maintenance Kill-Switch',
                          desc: 'Displays scheduled maintenance warning prior to new mock attempts.',
                        },
                      ] as const
                    ).map((item) => {
                      const active = catalog.featureFlags[item.key];
                      return (
                        <div
                          key={item.key}
                          className="flex items-center justify-between gap-3 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5"
                        >
                          <div>
                            <div className="font-bold text-[var(--brand-ink)]">{item.label}</div>
                            <div className="text-[11px] text-[var(--text)]">{item.desc}</div>
                          </div>
                          <button
                            type="button"
                            disabled={saving}
                            onClick={() =>
                              void postAdminMutation(
                                { action: 'TOGGLE_FLAG', flag: item.key, value: !active },
                                `Flag "${item.key}" toggled to ${String(!active)}.`,
                              )
                            }
                            className={`rounded-[4px] border px-3 py-1.5 font-mono text-[11px] font-bold cursor-pointer ${
                              active
                                ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                                : 'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand)]'
                            }`}
                          >
                            {active ? 'ENABLED' : 'DISABLED'}
                          </button>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5 text-xs">
                    <div>
                      <div className="font-bold text-[var(--brand-ink)]">Global AI Writing & Speaking Grading Strictness</div>
                      <div className="text-[11px] text-[var(--text)]">
                        Calibrates QWK alignment between automated rubric scoring and senior human graders.
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {(['lenient', 'standard', 'strict'] as RuntimeFeatureFlags['aiStrictnessLevel'][]).map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            void postAdminMutation(
                              { action: 'TOGGLE_FLAG', flag: 'aiStrictnessLevel', value: lvl },
                              `Global AI strictness set to "${lvl}".`,
                            )
                          }
                          className={`rounded-[4px] border px-3 py-1.5 font-mono text-[11px] font-bold uppercase cursor-pointer ${
                            catalog.featureFlags.aiStrictnessLevel === lvl
                              ? 'border-[var(--brand)] bg-[var(--brand-deep)] text-white'
                              : 'border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-ink)]'
                          }`}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                  <h2 className="text-base font-bold text-[var(--brand-ink)] border-b border-[var(--hairline)] pb-3">
                    {isBn ? '২পিএল আইআরটি ও আইটেম সাইকোমেট্রিক্স' : 'Item Difficulty (p-value), Discrimination Index & Trap Telemetry'}
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[var(--hairline)] text-[var(--text)]">
                          <th className="py-2.5 pr-4 font-semibold">Item Code</th>
                          <th className="py-2.5 pr-4 font-semibold">Domain</th>
                          <th className="py-2.5 pr-4 font-semibold">p-value / b-Param</th>
                          <th className="py-2.5 pr-4 font-semibold">Discrimination (a)</th>
                          <th className="py-2.5 pr-4 font-semibold">Trap Rate</th>
                          <th className="py-2.5 font-semibold">AI Calibration</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--hairline)]">
                        {catalog.psychometrics.map((item) => (
                          <tr key={item.id}>
                            <td className="py-3 pr-4 font-mono font-bold text-[var(--brand-ink)]">{item.itemCode}</td>
                            <td className="py-3 pr-4 text-[var(--brand-ink)]">{item.domain}</td>
                            <td className="py-3 pr-4 font-mono text-[var(--brand)] font-bold">
                              p={item.pValue.toFixed(2)} ({item.bParam})
                            </td>
                            <td className="py-3 pr-4 font-mono">{item.discriminationIndex.toFixed(2)}</td>
                            <td className="py-3 pr-4 font-mono">{item.trapRate}</td>
                            <td className="py-3">
                              <select
                                value={item.aiStrictness}
                                onChange={(e) =>
                                  void postAdminMutation(
                                    {
                                      action: 'PSYCHOMETRIC_UPDATE',
                                      itemId: item.id,
                                      aiStrictness: e.target.value as RuntimePsychometricItem['aiStrictness'],
                                    },
                                    `Item ${item.itemCode} strictness updated to ${e.target.value}.`,
                                  )
                                }
                                className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-1 font-mono text-xs"
                              >
                                <option value="Standard">Standard</option>
                                <option value="Calibrated">Calibrated</option>
                                <option value="Strict">Strict</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}

            {/* MODULE 7: Security Audit Log & JSON Backup */}
            {activeTab === 'audit' && (
              <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-3">
                  <div>
                    <h2 className="text-base font-bold text-[var(--brand-ink)]">
                      {isBn
                        ? 'অপরিবর্তনীয় অডিট লগ, জেএসওএন ব্যাকআপ ও ফ্যাক্টরি রিসেট'
                        : 'Immutable Security Audit Log & JSON Configuration Backup'}
                    </h2>
                    <div className="font-mono text-[11px] text-[var(--text)]">
                      Last synced: {catalog.updatedAtIso}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={handleExportJson}
                      className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] px-3.5 py-2 text-xs font-bold text-[var(--brand-ink)] hover:border-[var(--brand)] cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>{isBn ? 'JSON এক্সপোর্ট করুন' : 'Export Config JSON'}</span>
                    </button>
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        void postAdminMutation(
                          { action: 'RESET_DEFAULTS' },
                          'Restored canonical factory settings across /app/admin & /checkout.',
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-3.5 py-2 text-xs font-bold text-[var(--brand)] hover:bg-[var(--brand)] hover:text-white cursor-pointer"
                    >
                      <RotateCcw className="h-3.5 w-3.5" />
                      <span>{isBn ? 'ক্যানোনিকাল ডিফল্টে রিসেট' : 'Reset to Canonical Defaults'}</span>
                    </button>
                  </div>
                </div>

                <div className="divide-y divide-[var(--hairline)]">
                  {catalog.auditLogs.map((entry) => (
                    <div key={entry.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div>
                        <div className="font-mono text-[11px] text-[var(--text)]">
                          {entry.id} • {entry.timestamp} • {entry.actor}
                        </div>
                        <div className="mt-0.5 font-bold text-[var(--brand-ink)]">
                          {entry.action} — {entry.subsystem}
                        </div>
                        <div className="text-[var(--text)]">{entry.detail}</div>
                      </div>
                      <span className="rounded-[4px] border border-emerald-700 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-900">
                        {entry.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )
      )}
    </div>
  );
}
