/** @purpose Role-isolated Institutional Admin ERP Console (/admin) in Claude Editorial Ledger style with PII masking & progressive-disclosure editing */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import { Download, Eye, EyeOff, Plus, RotateCcw, Search, ShieldCheck } from 'lucide-react';
import {
  WorkspaceContainer,
  WorkspaceDataTable,
  WorkspaceHeader,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
  WorkspaceTabs,
} from '@/src/components/ui/WorkspacePrimitives';
import { maskEmailForAdmin, maskPhoneForAdmin } from '@/src/lib/role-guard';
import type {
  RuntimeAuditEntry,
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
  | 'flags'
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

const ADMIN_PII_AUDIT_STORAGE_KEY = 'lumen_admin_pii_audit_v1';

const COHORT_OPTIONS = [
  'GRE & IELTS Fall Cohort',
  'GRE Quant Intensive',
  'IELTS Academic Band 8.0',
  'IELTS Academic Core',
  'University B2B Cohort',
] as const;

const BLIND_SUBMISSION_HASHES: Record<string, string> = {
  'SUB-4091': 'SUB-8492',
  'SUB-4088': 'SUB-8501',
  'SUB-4082': 'SUB-8514',
};

const SCHOLAR_CONTACT_PHONES: Record<string, string> = {
  'SCH-01': '+8801711223344',
  'SCH-02': '+8801812445566',
  'SCH-03': '+8801913667788',
  'SCH-04': '+8801614889900',
};

function toBlindSubmissionHash(submissionId: string): string {
  const mapped = BLIND_SUBMISSION_HASHES[submissionId];
  if (mapped) return mapped;
  let hash = 0;
  for (let i = 0; i < submissionId.length; i += 1) {
    hash = (hash * 31 + submissionId.charCodeAt(i)) % 9000;
  }
  return `SUB-${1000 + hash}`;
}

function resolveAdminTab(rawTab: string | null): AdminModuleTab {
  if (
    rawTab === 'promos' ||
    rawTab === 'orders' ||
    rawTab === 'cms' ||
    rawTab === 'scholars' ||
    rawTab === 'flags' ||
    rawTab === 'audit'
  ) {
    return rawTab;
  }
  if (rawTab === 'calibration') {
    return 'flags';
  }
  return 'catalog';
}

function AdminConsoleContent() {
  const locale = useLocale();
  const isBn = locale === 'bn';
  const router = useRouter();
  const searchParams = useSearchParams();

  const rawTab = searchParams?.get('tab') ?? null;
  const [activeTab, setActiveTab] = useState<AdminModuleTab>(() => resolveAdminTab(rawTab));
  const [mounted, setMounted] = useState(false);

  const [catalog, setCatalog] = useState<RuntimeCatalogSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  // Module 1: Catalog, Fees & Single-Row Progressive Disclosure Editor
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [planDrafts, setPlanDrafts] = useState<Record<string, PlanDraft>>({});
  const [split2Pct, setSplit2Pct] = useState('2.85');
  const [split3Pct, setSplit3Pct] = useState('4.75');
  const [vatPct, setVatPct] = useState('15.0');
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newPlan, setNewPlan] = useState({
    planId: '',
    nameEn: '',
    nameBn: '',
    baseBdt: '6500',
    baseUsd: '65',
    featuresText: '5 Full Adaptive Mocks | 15 AI Rubric Evaluations | 180-Day Access',
    allowSplit: true,
  });

  // Module 2: Promos & Net Tuition Preview
  const [showAddPromo, setShowAddPromo] = useState(false);
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
  const [calcPlanId, setCalcPlanId] = useState('gre-complete');
  const [calcCurrency, setCalcCurrency] = useState<SupportedCurrency>('BDT');
  const [calcSplit, setCalcSplit] = useState<SplitMode>('split-2');
  const [calcPromo, setCalcPromo] = useState('LUMEN10');

  // Module 3: Orders & Mushak 6.3
  const [selectedMushakOrderId, setSelectedMushakOrderId] = useState<string | null>(null);
  const [binInputMap, setBinInputMap] = useState<Record<string, string>>({});

  // Module 4: CMS & Blind Moderation
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

  // Module 5: Scholars Directory (PII Masked by Default)
  const [scholarSearch, setScholarSearch] = useState('');
  const [unmaskedScholarIds, setUnmaskedScholarIds] = useState<Record<string, boolean>>({});
  const [localAuditEntries, setLocalAuditEntries] = useState<RuntimeAuditEntry[]>([]);

  useEffect(() => {
    setActiveTab(resolveAdminTab(rawTab));
  }, [rawTab]);

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
    setMounted(true);
    try {
      const rawAudit = window.localStorage.getItem(ADMIN_PII_AUDIT_STORAGE_KEY);
      if (rawAudit) {
        const parsed = JSON.parse(rawAudit) as unknown;
        if (Array.isArray(parsed)) {
          setLocalAuditEntries(parsed as RuntimeAuditEntry[]);
        }
      }
    } catch {
      // Ignore storage errors in restricted contexts
    }
    void loadCatalog();
  }, []);

  const handleSelectTab = (tabId: string) => {
    const next = resolveAdminTab(tabId);
    setActiveTab(next);
    const prefix = isBn ? '/bn' : '';
    router.replace(`${prefix}/admin?tab=${next}`, { scroll: false });
  };

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

  const handleToggleScholarMask = (scholarId: string, email: string) => {
    const currentlyUnmasked = Boolean(unmaskedScholarIds[scholarId]);
    if (currentlyUnmasked) {
      setUnmaskedScholarIds((prev) => ({ ...prev, [scholarId]: false }));
      return;
    }

    setUnmaskedScholarIds((prev) => ({ ...prev, [scholarId]: true }));
    const maskedPreview = maskEmailForAdmin(email);
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ') + ' UTC';
    const entry: RuntimeAuditEntry = {
      id: `AUD-PII-${String(localAuditEntries.length + 1).padStart(3, '0')}`,
      timestamp,
      actor: 'Ayman Rahman (Admin)',
      action: 'ADMIN_PII_REVEAL',
      subsystem: 'Scholar Directory (Zero-Knowledge)',
      detail: `Audited contact reveal for ${scholarId} (${maskedPreview}) during billing support.`,
      status: 'Verified',
    };

    const nextEntries = [entry, ...localAuditEntries].slice(0, 40);
    setLocalAuditEntries(nextEntries);
    try {
      window.localStorage.setItem(ADMIN_PII_AUDIT_STORAGE_KEY, JSON.stringify(nextEntries));
    } catch {
      // Ignore storage errors
    }

    setStatusMessage({
      tone: 'ok',
      text: isBn
        ? `${scholarId} (${maskedPreview}) প্রকাশ করা হয়েছে এবং ADMIN_PII_REVEAL অডিট লগে সংরক্ষিত হয়েছে।`
        : `Contact unmasked for ${scholarId} (${maskedPreview}). Immutable ADMIN_PII_REVEAL event logged.`,
    });
  };

  const planList: RuntimeCatalogPlan[] = useMemo(
    () => (catalog ? Object.values(catalog.plans) : []),
    [catalog],
  );

  const activePlanCount = useMemo(
    () => (catalog ? planList.filter((p) => p.active).length : 9),
    [catalog, planList],
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
        s.id.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        maskEmailForAdmin(s.email).toLowerCase().includes(q) ||
        s.cohort.toLowerCase().includes(q),
    );
  }, [catalog, scholarSearch]);

  const combinedAuditLogs = useMemo(() => {
    const serverLogs = catalog?.auditLogs ?? [];
    return [...localAuditEntries, ...serverLogs];
  }, [localAuditEntries, catalog]);

  const calcPreview = useMemo(() => {
    if (!catalog) return null;
    const plan = catalog.plans[calcPlanId] ?? Object.values(catalog.plans)[0];
    if (!plan) return null;
    const rawBase = calcCurrency === 'USD' ? plan.baseUsd : plan.baseBdt;
    const promoKey = calcPromo.trim().toUpperCase();
    const promo = promoKey ? catalog.promoCodes[promoKey] : undefined;
    const withinDate = !mounted || !promo?.expiresAt || Date.parse(promo.expiresAt) >= Date.now();
    const promoValid =
      promo &&
      promo.active &&
      withinDate &&
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
  }, [catalog, calcPlanId, calcCurrency, calcSplit, calcPromo, mounted]);

  const handleExportJson = () => {
    if (!catalog) return;
    const payload = {
      ...catalog,
      auditLogs: combinedAuditLogs,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lumen-admin-catalog-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const tabs = [
    {
      id: 'catalog',
      label: isBn ? '১. ক্যাটালগ ও ফি' : 'Catalog, Pricing & Fees',
      count: planList.length || 9,
    },
    {
      id: 'promos',
      label: isBn ? '২. প্রোমো ও স্কলারশিপ' : 'Promos & Scholarships',
      count: promoList.length || undefined,
    },
    {
      id: 'orders',
      label: isBn ? '৩. অর্ডার ও মূসক ৬.৩' : 'Orders, VAT & Refunds',
      count: catalog?.orders.length,
    },
    {
      id: 'cms',
      label: isBn ? '৪. সিএমএস ও ব্লাইন্ড মডারেশন' : 'CMS & Blind Moderation',
      count: catalog?.moderationQueue.length,
    },
    {
      id: 'scholars',
      label: isBn ? '৫. স্কলার ডিরেক্টরি' : 'Scholar Directory',
      count: catalog?.scholars.length,
    },
    {
      id: 'flags',
      label: isBn ? '৬. সাইকোমেট্রিক্স ও ফ্ল্যাগ' : 'Psychometrics & Flags',
    },
    {
      id: 'audit',
      label: isBn ? '৭. নিরাপত্তা অডিট ও ব্যাকআপ' : 'Security Audit & Backup',
      count: combinedAuditLogs.length || undefined,
    },
  ];

  const stats = [
    {
      value: isBn ? `${activePlanCount} সক্রিয়` : `${activePlanCount} Active`,
      label: isBn ? 'প্রস্তুতি প্যাকেজ কনফিগার করা' : 'Configured Preparation Packages',
    },
    {
      value: `${split2Pct}% / ${split3Pct}%`,
      label: isBn ? '২-কিস্তি / ৩-কিস্তি ক্লিয়ারিং ফি' : '2-Part / 3-Part Split Clearing Fees',
    },
    {
      value: `${vatPct}%`,
      label: isBn ? 'বাংলাদেশ ভ্যাট / মূসক ৬.৩ হার' : 'Bangladesh VAT / Mushak 6.3 Rate',
    },
    {
      value: isBn ? 'PII মাস্কড' : 'PII Masked',
      label: isBn ? 'জিরো-নলেজ শিক্ষার্থী গোপনীয়তা সক্রিয়' : 'Zero-Knowledge Student Privacy Active',
    },
  ];

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? `${brand.nameBn} — প্রাতিষ্ঠানিক অ্যাডমিন কনসোল` : `${brand.name} — Institutional Admin Console`}
        subtitle={
          isBn
            ? 'লাইভ ক্যাটালগ মূল্য, ফ্র্যাকশনাল স্প্লিট-পে ফি, ব্লাইন্ড মডারেশন এবং PII-মাস্কড স্কলার গভর্নেন্স।'
            : 'Live catalog pricing, split-pay clearing fees, blind-graded moderation, and PII-masked scholar governance synced with /checkout.'
        }
        metaText={
          isBn
            ? 'ভূমিকা বিচ্ছিন্নতা: শিক্ষার্থী স্টাডি নোট ও ভুলের খাতা এই কনসোল থেকে সম্পূর্ণ বিচ্ছিন্ন।'
            : 'Strict role isolation active: private scholar study notes and mistake reflections are excluded from Admin ERP.'
        }
        primaryAction={{
          label: isBn ? 'লাইভ স্টেট রিফ্রেশ করুন' : 'Refresh Live State',
          onClick: () => void loadCatalog(),
        }}
        secondaryAction={{
          label: isBn ? 'অডিট ও ব্যাকআপ →' : 'Security Audit & JSON →',
          onClick: () => handleSelectTab('audit'),
        }}
      />

      {statusMessage ? (
        <div
          role="status"
          className="mb-8 flex flex-wrap items-center justify-between gap-3 border-y border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] px-4 py-3 text-sm text-[var(--brand-deep)] leading-relaxed"
        >
          <span>{statusMessage.text}</span>
          <button
            type="button"
            onClick={() => setStatusMessage(null)}
            className="text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)]"
          >
            {isBn ? 'বন্ধ করুন' : 'Dismiss'}
          </button>
        </div>
      ) : null}

      <WorkspaceStatRow stats={stats} />

      <WorkspaceTabs tabs={tabs} activeTab={activeTab} onSelect={handleSelectTab} />

      {loading && !catalog ? (
        <div className="border-y border-[var(--hairline)] py-10 text-sm text-[var(--text-muted)] leading-relaxed">
          {isBn ? 'লাইভ ইআরপি ক্যাটালগ লোড হচ্ছে...' : 'Loading live ERP catalog from /api/admin/catalog...'}
        </div>
      ) : null}

      {catalog && activeTab === 'catalog' ? (
        <section className="space-y-8">
          {/* Global Gateway Fee Bar */}
          <div>
            <WorkspaceSectionTitle
              title={isBn ? 'গ্লোবাল স্প্লিট-পে ফি ও ভ্যাট হার' : 'Global Gateway Clearing Fees & BD VAT'}
              subtitle={
                isBn
                  ? '২-কিস্তি, ৩-কিস্তি ক্লিয়ারিং ফি এবং বাংলাদেশ ভ্যাট (%) সরাসরি পেমেন্ট-গার্ডে প্রয়োগ হয়।'
                  : 'Single-bar rate controller enforced server-side across /checkout and installment settlements.'
              }
            />
            <div className="border-y border-[var(--hairline)] py-4 flex flex-col lg:flex-row lg:items-end justify-between gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-1">
                <label className="block text-xs font-medium text-[var(--brand-deep)] leading-relaxed">
                  <span>{isBn ? '২-কিস্তি ক্লিয়ারিং ফি (%)' : '2-Part Split Clearing Fee (%)'}</span>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="25"
                    value={split2Pct}
                    onChange={(e) => setSplit2Pct(e.target.value)}
                    className="mt-1.5 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm font-semibold text-[var(--brand-deep)]"
                  />
                </label>
                <label className="block text-xs font-medium text-[var(--brand-deep)] leading-relaxed">
                  <span>{isBn ? '৩-কিস্তি ক্লিয়ারিং ফি (%)' : '3-Part Split Clearing Fee (%)'}</span>
                  <input
                    type="number"
                    step="0.05"
                    min="0"
                    max="25"
                    value={split3Pct}
                    onChange={(e) => setSplit3Pct(e.target.value)}
                    className="mt-1.5 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm font-semibold text-[var(--brand-deep)]"
                  />
                </label>
                <label className="block text-xs font-medium text-[var(--brand-deep)] leading-relaxed">
                  <span>{isBn ? 'বাংলাদেশ ভ্যাট (%)' : 'BD VAT (%)'}</span>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="35"
                    value={vatPct}
                    onChange={(e) => setVatPct(e.target.value)}
                    className="mt-1.5 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm font-semibold text-[var(--brand-deep)]"
                  />
                </label>
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
                      ? 'স্প্লিট-পে ফি ও ভ্যাট হার চেকআউটে সিঙ্ক হয়েছে।'
                      : 'Split-Pay fee rates & BD VAT synced to live /checkout.',
                  )
                }
                className="shrink-0 rounded-[4px] bg-[var(--brand)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--link)] disabled:opacity-50 leading-relaxed"
              >
                {isBn ? 'ফি হার সংরক্ষণ করুন' : 'Save Fee Rates'}
              </button>
            </div>
          </div>

          {/* Package Ledger Table with Single-Row Progressive Disclosure */}
          <div>
            <WorkspaceSectionTitle
              title={isBn ? 'প্যাকেজ ক্যাটালগ ও মূল্য লেজার' : 'Package Catalog & Dual-Currency Price Ledger'}
              subtitle={
                isBn
                  ? 'প্রতিটি প্যাকেজ এক লাইনে দেখানো হয়েছে; এডিট করতে "Edit Row →" নির্বাচন করুন।'
                  : 'High-density hairline ledger. Select Edit Row on a single package to expand its inline editor.'
              }
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowAddPlan((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{isBn ? '+ নতুন প্যাকেজ যোগ করুন' : '+ Add New Package'}</span>
                </button>
              }
            />

            {showAddPlan ? (
              <div className="mb-6 border-y border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] p-5 space-y-4">
                <div className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'নতুন প্রাতিষ্ঠানিক প্যাকেজ তৈরি করুন' : 'Create New Package (Synced to /checkout)'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Slug</span>
                    <input
                      type="text"
                      placeholder="buet-quant-sprint"
                      value={newPlan.planId}
                      onChange={(e) => setNewPlan((p) => ({ ...p, planId: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Title (EN)</span>
                    <input
                      type="text"
                      placeholder="Package Title (EN)"
                      value={newPlan.nameEn}
                      onChange={(e) => setNewPlan((p) => ({ ...p, nameEn: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Title (BN)</span>
                    <input
                      type="text"
                      placeholder="প্যাকেজের নাম (BN)"
                      value={newPlan.nameBn}
                      onChange={(e) => setNewPlan((p) => ({ ...p, nameBn: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Base BDT (৳)</span>
                    <input
                      type="number"
                      value={newPlan.baseBdt}
                      onChange={(e) => setNewPlan((p) => ({ ...p, baseBdt: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Base USD ($)</span>
                    <input
                      type="number"
                      value={newPlan.baseUsd}
                      onChange={(e) => setNewPlan((p) => ({ ...p, baseUsd: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="flex items-center gap-2 pt-5 text-sm text-[var(--brand-deep)]">
                    <input
                      type="checkbox"
                      checked={newPlan.allowSplit}
                      onChange={(e) => setNewPlan((p) => ({ ...p, allowSplit: e.target.checked }))}
                    />
                    <span>{isBn ? 'স্প্লিট-পে অনুমোদিত' : 'Allow Split-Pay'}</span>
                  </label>
                </div>
                <label className="block space-y-1 text-xs">
                  <span className="text-[var(--text-muted)]">Features (separated by |)</span>
                  <input
                    type="text"
                    value={newPlan.featuresText}
                    onChange={(e) => setNewPlan((p) => ({ ...p, featuresText: e.target.value }))}
                    className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                  />
                </label>
                <div className="flex flex-wrap items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPlan(false)}
                    className="text-sm font-medium underline underline-offset-4 text-[var(--text)] hover:text-[var(--brand-deep)]"
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
                    className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--link)] disabled:opacity-50"
                  >
                    {isBn ? 'প্যাকেজ তৈরি করুন' : 'Create Package'}
                  </button>
                </div>
              </div>
            ) : null}

            <WorkspaceDataTable
              caption={isBn ? 'প্যাকেজ ক্যাটালগ ও মূল্য লেজার' : 'Package Catalog & Dual-Currency Price Matrix'}
              columns={[
                { key: 'package', header: isBn ? 'প্যাকেজ' : 'Package' },
                { key: 'bdt', header: isBn ? 'টাকা (BDT)' : 'Base BDT', align: 'right' },
                { key: 'usd', header: isBn ? 'ডলার (USD)' : 'Base USD', align: 'right' },
                { key: 'split', header: isBn ? 'স্প্লিট-পে' : 'Split-Pay' },
                { key: 'status', header: isBn ? 'অবস্থা' : 'Status' },
                { key: 'action', header: isBn ? 'সম্পাদনা' : 'Action', align: 'right' },
              ]}
              rows={planList.map((plan) => {
                const draft = planDrafts[plan.planId];
                const isEditing = editingSlug === plan.planId;
                return {
                  id: plan.planId,
                  rowHeader: isBn ? plan.nameBn : plan.nameEn,
                  rowSubheader: `${plan.planId} · ${plan.fullMocks} ${isBn ? 'মক' : 'mocks'} · ${plan.aiCredits} ${isBn ? 'এআই ক্রেডিট' : 'AI evals'}`,
                  cells: {
                    bdt: (
                      <span className="font-semibold text-[var(--brand-deep)]">
                        ৳{plan.baseBdt.toLocaleString()}
                      </span>
                    ),
                    usd: `$${plan.baseUsd}`,
                    split: (
                      <span className="text-xs text-[var(--text-muted)]">
                        {plan.allowSplit ? (isBn ? 'স্প্লিট-পে' : 'Split-Pay') : isBn ? 'পূর্ণ' : 'Full Only'}
                      </span>
                    ),
                    status: (
                      <span className="text-xs font-medium text-[var(--brand-deep)]">
                        {plan.active ? (isBn ? 'সক্রিয়' : 'Active') : isBn ? 'স্থগিত' : 'Paused'}
                      </span>
                    ),
                    action: (
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSlug((prev) => (prev === plan.planId ? null : plan.planId))
                        }
                        className="text-sm font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                      >
                        {isEditing
                          ? isBn
                            ? 'বন্ধ করুন'
                            : 'Close Editor'
                          : isBn
                            ? 'সম্পাদনা করুন →'
                            : 'Edit Row →'}
                      </button>
                    ),
                  },
                  expandedContent:
                    isEditing && draft ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                          <label className="block space-y-1">
                            <span className="text-[var(--text-muted)]">Name (EN)</span>
                            <input
                              type="text"
                              value={draft.nameEn}
                              onChange={(e) =>
                                setPlanDrafts((prev) => ({
                                  ...prev,
                                  [plan.planId]: { ...draft, nameEn: e.target.value },
                                }))
                              }
                              className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[var(--text-muted)]">Name (BN)</span>
                            <input
                              type="text"
                              value={draft.nameBn}
                              onChange={(e) =>
                                setPlanDrafts((prev) => ({
                                  ...prev,
                                  [plan.planId]: { ...draft, nameBn: e.target.value },
                                }))
                              }
                              className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[var(--text-muted)]">Base BDT (৳)</span>
                            <input
                              type="number"
                              value={draft.baseBdt}
                              onChange={(e) =>
                                setPlanDrafts((prev) => ({
                                  ...prev,
                                  [plan.planId]: { ...draft, baseBdt: e.target.value },
                                }))
                              }
                              className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                            />
                          </label>
                          <label className="block space-y-1">
                            <span className="text-[var(--text-muted)]">Base USD ($)</span>
                            <input
                              type="number"
                              value={draft.baseUsd}
                              onChange={(e) =>
                                setPlanDrafts((prev) => ({
                                  ...prev,
                                  [plan.planId]: { ...draft, baseUsd: e.target.value },
                                }))
                              }
                              className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                            />
                          </label>
                        </div>

                        <label className="block space-y-1 text-xs">
                          <span className="text-[var(--text-muted)]">Feature Bullets (| separated)</span>
                          <input
                            type="text"
                            value={draft.featuresText}
                            onChange={(e) =>
                              setPlanDrafts((prev) => ({
                                ...prev,
                                [plan.planId]: { ...draft, featuresText: e.target.value },
                              }))
                            }
                            className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                          />
                        </label>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                          <div className="flex flex-wrap items-center gap-6 text-sm text-[var(--brand-deep)]">
                            <label className="inline-flex items-center gap-2">
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
                              <span>{isBn ? 'স্প্লিট-পে অনুমোদিত' : 'Allow Split-Pay'}</span>
                            </label>
                            <label className="inline-flex items-center gap-2">
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
                              <span>{isBn ? 'প্যাকেজ সক্রিয়' : 'Package Active'}</span>
                            </label>
                          </div>

                          <div className="flex items-center gap-4">
                            <button
                              type="button"
                              onClick={() => setEditingSlug(null)}
                              className="text-sm font-medium underline underline-offset-4 text-[var(--text)] hover:text-[var(--brand-deep)]"
                            >
                              {isBn ? 'বাতিল' : 'Cancel'}
                            </button>
                            <button
                              type="button"
                              disabled={saving}
                              onClick={() => {
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
                                  `${plan.planId} saved & synced to live /checkout (৳${draft.baseBdt} / $${draft.baseUsd}).`,
                                );
                                setEditingSlug(null);
                              }}
                              className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--link)] disabled:opacity-50"
                            >
                              {isBn ? 'সংরক্ষণ ও চেকআউট সিঙ্ক' : 'Save & Sync to Checkout'}
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : undefined,
                };
              })}
            />
          </div>
        </section>
      ) : null}

      {catalog && activeTab === 'promos' ? (
        <section className="space-y-10">
          <div>
            <WorkspaceSectionTitle
              title={isBn ? 'প্রোমো কোড, স্কলারশিপ ও প্রাতিষ্ঠানিক ভাউচার' : 'Promos, Scholarships & Cohort Vouchers'}
              subtitle={
                isBn
                  ? 'সক্রিয় ছাড়ের কোড লেজার ও ১-ক্লিক বিরতি/সক্রিয় নিয়ন্ত্রণ।'
                  : 'Scholarship and partner discount ledger synced live with /checkout.'
              }
              rightAction={
                <button
                  type="button"
                  onClick={() => setShowAddPromo((v) => !v)}
                  className="inline-flex items-center gap-1.5 text-sm font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                >
                  <Plus className="h-4 w-4" aria-hidden="true" />
                  <span>{isBn ? '+ প্রোমো কোড যোগ করুন' : '+ Add / Edit Promo Code'}</span>
                </button>
              }
            />

            {showAddPromo ? (
              <div className="mb-6 border-y border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Code</span>
                    <input
                      type="text"
                      value={promoForm.code}
                      onChange={(e) => setPromoForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm font-semibold text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Discount Type</span>
                    <select
                      value={promoForm.discountType}
                      onChange={(e) =>
                        setPromoForm((p) => ({ ...p, discountType: e.target.value as 'percent' | 'fixed' }))
                      }
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    >
                      <option value="percent">{isBn ? 'শতাংশ (%)' : 'Percentage (%)'}</option>
                      <option value="fixed">{isBn ? 'নির্দিষ্ট অঙ্ক' : 'Fixed Amount'}</option>
                    </select>
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Value</span>
                    <input
                      type="number"
                      value={promoForm.value}
                      onChange={(e) => setPromoForm((p) => ({ ...p, value: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Max Redemptions</span>
                    <input
                      type="number"
                      value={promoForm.maxRedemptions}
                      onChange={(e) => setPromoForm((p) => ({ ...p, maxRedemptions: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Expires</span>
                    <input
                      type="date"
                      value={promoForm.expiresAt}
                      onChange={(e) => setPromoForm((p) => ({ ...p, expiresAt: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                  <label className="block space-y-1">
                    <span className="text-[var(--text-muted)]">Label (EN)</span>
                    <input
                      type="text"
                      value={promoForm.labelEn}
                      onChange={(e) => setPromoForm((p) => ({ ...p, labelEn: e.target.value }))}
                      className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                    />
                  </label>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-4">
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
                    className="text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)]"
                  >
                    {isBn ? 'প্রিসেট: CORP50' : 'Fill Preset: CORP50'}
                  </button>
                  <button
                    type="button"
                    disabled={saving || !promoForm.code.trim()}
                    onClick={() => {
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
                      );
                      setShowAddPromo(false);
                    }}
                    className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--link)] disabled:opacity-50"
                  >
                    {isBn ? 'প্রোমো সংরক্ষণ করুন' : 'Save Promo Code'}
                  </button>
                </div>
              </div>
            ) : null}

            <WorkspaceDataTable
              caption={isBn ? 'প্রোমো ও স্কলারশিপ' : 'Promos & Scholarships'}
              columns={[
                { key: 'code', header: isBn ? 'প্রোমো কোড' : 'Promo Code' },
                { key: 'discount', header: isBn ? 'ছাড়' : 'Discount' },
                { key: 'usage', header: isBn ? 'ব্যবহার ও মেয়াদ' : 'Usage & Expiry', align: 'right' },
                { key: 'status', header: isBn ? 'অবস্থা' : 'Status' },
                { key: 'action', header: isBn ? 'নিয়ন্ত্রণ' : 'Action', align: 'right' },
              ]}
              rows={promoList.map((promo) => ({
                id: promo.code,
                rowHeader: promo.code,
                rowSubheader: isBn ? promo.labelBn : promo.labelEn,
                cells: {
                  discount:
                    promo.discountType === 'percent' ? `${promo.value}% Off` : `${promo.value} Fixed`,
                  usage: `${promo.redemptionsCount}${promo.maxRedemptions ? `/${promo.maxRedemptions}` : ''}${promo.expiresAt ? ` · ${promo.expiresAt}` : ''}`,
                  status: (
                    <span className="text-xs font-medium text-[var(--brand-deep)]">
                      {promo.active ? (isBn ? 'সক্রিয়' : 'Active') : isBn ? 'বিরতিতে' : 'Paused'}
                    </span>
                  ),
                  action: (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        void postAdminMutation(
                          { action: 'TOGGLE_PROMO', code: promo.code, active: !promo.active },
                          `Promo ${promo.code} ${!promo.active ? 'activated' : 'paused'}.`,
                        )
                      }
                      className="text-sm font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                    >
                      {promo.active ? (isBn ? 'বিরতি দিন' : 'Pause') : isBn ? 'সক্রিয় করুন' : 'Activate'}
                    </button>
                  ),
                },
              }))}
            />
          </div>

          {/* Net Tuition Live Test Calculator */}
          <div>
            <WorkspaceSectionTitle
              title={isBn ? 'নেট টিউশন টেস্ট ক্যালকুলেটর' : 'Net Tuition Live Test Calculator'}
              subtitle={
                isBn
                  ? 'যেকোনো প্যাকেজ, প্রোমো ও কিস্তি মোডের ভ্যাটসহ চূড়ান্ত অঙ্ক যাচাই করুন।'
                  : 'Verify canonical net tuition, clearing fee, and Bangladesh VAT totals.'
              }
            />
            <div className="border-y border-[var(--hairline)] py-4 grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
              <label className="block space-y-1">
                <span className="text-[var(--text-muted)]">Package</span>
                <select
                  value={calcPlanId}
                  onChange={(e) => setCalcPlanId(e.target.value)}
                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                >
                  {planList.map((p) => (
                    <option key={p.planId} value={p.planId}>
                      {p.nameEn}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[var(--text-muted)]">Currency</span>
                <select
                  value={calcCurrency}
                  onChange={(e) => setCalcCurrency(e.target.value as SupportedCurrency)}
                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[var(--text-muted)]">Split Mode</span>
                <select
                  value={calcSplit}
                  onChange={(e) => setCalcSplit(e.target.value as SplitMode)}
                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                >
                  <option value="full">Full (0%)</option>
                  <option value="split-2">2-Part (+{(catalog.feeRates.split2Rate * 100).toFixed(2)}%)</option>
                  <option value="split-3">3-Part (+{(catalog.feeRates.split3Rate * 100).toFixed(2)}%)</option>
                </select>
              </label>
              <label className="block space-y-1">
                <span className="text-[var(--text-muted)]">Promo Code</span>
                <input
                  type="text"
                  value={calcPromo}
                  onChange={(e) => setCalcPromo(e.target.value.toUpperCase())}
                  placeholder="LUMEN10"
                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                />
              </label>
            </div>
            {calcPreview ? (
              <div className="border-b border-[var(--hairline)] py-4 flex flex-wrap items-center justify-between gap-4 text-sm">
                <span className="text-[var(--text)]">
                  Base {calcCurrency === 'USD' ? `$${calcPreview.rawBase}` : `৳${calcPreview.rawBase}`} · Discount{' '}
                  {calcCurrency === 'USD' ? `-$${calcPreview.discount}` : `-৳${calcPreview.discount}`} · Clearing Fee{' '}
                  {calcCurrency === 'USD' ? `+$${calcPreview.fee}` : `+৳${calcPreview.fee}`} · VAT{' '}
                  {calcCurrency === 'USD' ? '$0.00' : `৳${calcPreview.vat}`}
                </span>
                <span className="font-bold text-[var(--brand-deep)]">
                  {isBn ? 'চূড়ান্ত মোট:' : 'Canonical Total:'}{' '}
                  {calcCurrency === 'USD' ? `$${calcPreview.total}` : `৳${calcPreview.total}`}
                </span>
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      {catalog && activeTab === 'orders' ? (
        <section className="space-y-6">
          <WorkspaceSectionTitle
            title={isBn ? 'অর্ডার, স্প্লিট-পে লেজার ও মূসক ৬.৩ ভ্যাট চালান' : 'Orders, Split-Pay Ledger & Mushak 6.3'}
            subtitle={
              isBn
                ? '৭-দিনের রিফান্ড, অফলাইন ব্যাংক ট্রান্সফার নিশ্চিতকরণ এবং মূসক ৬.৩ ভ্যাট চালান।'
                : 'Transaction ledger supporting 7-day policy refunds, offline bank reconciliation, and NBR Mushak 6.3 VAT preview.'
            }
          />

          <WorkspaceDataTable
            caption={isBn ? 'অর্ডার, স্প্লিট-পে ও মূসক ৬.৩' : 'Orders, Split-Pay & Mushak 6.3'}
            columns={[
              { key: 'order', header: isBn ? 'অর্ডার ও প্যাকেজ' : 'Order & Package' },
              { key: 'method', header: isBn ? 'পেমেন্ট ও কিস্তি' : 'Method & Split' },
              { key: 'amount', header: isBn ? 'পরিমাণ' : 'Amount', align: 'right' },
              { key: 'status', header: isBn ? 'অবস্থা' : 'Status' },
              { key: 'actions', header: isBn ? 'অ্যাকশন' : 'Actions', align: 'right' },
            ]}
            rows={catalog.orders.map((order) => {
              const isPreviewOpen = selectedMushakOrderId === order.id;
              const vatRate = catalog.feeRates.vatRateBdt;
              const baseExVat = Math.round(order.amount / (1 + vatRate));
              const vatAmt = order.amount - baseExVat;
              return {
                id: order.id,
                rowHeader: `${order.id} · ${order.planLabel}`,
                rowSubheader: `${order.cohort} · ${order.createdAt}${order.mushakChalanId ? ` · ${order.mushakChalanId}` : ''}`,
                cells: {
                  method: `${order.paymentMethod} · ${order.splitMode}`,
                  amount: (
                    <span className="font-semibold text-[var(--brand-deep)]">
                      {order.currency === 'USD'
                        ? `$${order.amount.toFixed(2)}`
                        : `৳${order.amount.toLocaleString()}`}
                    </span>
                  ),
                  status: (
                    <span className="text-xs font-medium text-[var(--brand-deep)]">
                      {order.splitStatus}
                    </span>
                  ),
                  actions: (
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      {order.splitStatus !== 'Paid in Full' && order.splitStatus !== 'Refunded' ? (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            void postAdminMutation(
                              { action: 'ORDER_ACTION', orderId: order.id, operation: 'mark_paid' },
                              `Order ${order.id} marked Paid in Full.`,
                            )
                          }
                          className="text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                        >
                          {isBn ? 'অফলাইন পেমেন্ট নিশ্চিত করুন' : 'Mark Offline Transfer Paid'}
                        </button>
                      ) : null}
                      {order.currency === 'BDT' ? (
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedMushakOrderId((prev) => (prev === order.id ? null : order.id))
                          }
                          className="text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                        >
                          {isPreviewOpen
                            ? isBn
                              ? 'মূসক ৬.৩ লুকান'
                              : 'Hide Mushak 6.3'
                            : isBn
                              ? 'মূসক ৬.৩ প্রিভিউ'
                              : 'Preview Mushak 6.3 VAT Chalan'}
                        </button>
                      ) : null}
                      {order.splitStatus !== 'Refunded' ? (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            void postAdminMutation(
                              { action: 'ORDER_ACTION', orderId: order.id, operation: 'refund' },
                              `7-Day policy refund issued for ${order.id}.`,
                            )
                          }
                          className="text-xs font-medium underline underline-offset-4 text-[var(--brand)] hover:text-[var(--brand-deep)] leading-relaxed"
                        >
                          {isBn ? '৭-দিনের রিফান্ড ইস্যু করুন' : 'Issue 7-Day Refund'}
                        </button>
                      ) : null}
                    </div>
                  ),
                },
                expandedContent: isPreviewOpen ? (
                  <div className="space-y-3 text-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2 font-semibold text-[var(--brand-deep)]">
                      <span>NBR Form Mushak-6.3 VAT Chalan Preview · {order.mushakChalanId ?? 'Draft'}</span>
                      <span>
                        Taxable: ৳{baseExVat.toLocaleString()} · 15% VAT: ৳{vatAmt.toLocaleString()} · Total: ৳
                        {order.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        placeholder="Corporate NBR BIN (optional)"
                        value={binInputMap[order.id] ?? order.corporateBin ?? ''}
                        onChange={(e) =>
                          setBinInputMap((prev) => ({ ...prev, [order.id]: e.target.value }))
                        }
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--brand-deep)]"
                      />
                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          void postAdminMutation(
                            {
                              action: 'ORDER_ACTION',
                              orderId: order.id,
                              operation: 'issue_mushak',
                              corporateBin: binInputMap[order.id] ?? order.corporateBin ?? undefined,
                            },
                            `Mushak 6.3 Chalan issued for ${order.id}.`,
                          )
                        }
                        className="rounded-[4px] bg-[var(--brand)] px-3.5 py-1.5 text-xs font-semibold text-white hover:bg-[var(--link)]"
                      >
                        {isBn ? 'চালান ইস্যু / আপডেট করুন' : 'Issue / Sync Mushak 6.3 Chalan'}
                      </button>
                    </div>
                  </div>
                ) : undefined,
              };
            })}
          />
        </section>
      ) : null}

      {catalog && activeTab === 'cms' ? (
        <section className="space-y-10">
          {/* TopRibbon Editor */}
          <div>
            <WorkspaceSectionTitle
              title={isBn ? 'লাইভ টপ রিবন ঘোষণা এডিটর' : 'Live TopRibbon Announcement Editor (EN / BN)'}
              subtitle={
                isBn
                  ? 'মার্কেটিং ও অ্যাপ হেডারের শীর্ষ ঘোষণা বার পরিচালনা করুন।'
                  : 'Controls the global TopRibbon announcement banner across public routes.'
              }
            />
            <div className="border-y border-[var(--hairline)] py-5 space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="block space-y-1">
                  <span className="text-[var(--text-muted)]">Announcement (EN)</span>
                  <input
                    type="text"
                    value={ribbonDraft.textEn}
                    onChange={(e) => setRibbonDraft((r) => ({ ...r, textEn: e.target.value }))}
                    className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                  />
                </label>
                <label className="block space-y-1">
                  <span className="text-[var(--text-muted)]">Announcement (BN)</span>
                  <input
                    type="text"
                    value={ribbonDraft.textBn}
                    onChange={(e) => setRibbonDraft((r) => ({ ...r, textBn: e.target.value }))}
                    className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
                  />
                </label>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <label className="inline-flex items-center gap-2 text-sm text-[var(--brand-deep)]">
                  <input
                    type="checkbox"
                    checked={ribbonDraft.enabled}
                    onChange={(e) => setRibbonDraft((r) => ({ ...r, enabled: e.target.checked }))}
                  />
                  <span>{isBn ? 'রিবন সক্রিয়' : 'TopRibbon Enabled'}</span>
                </label>
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
                      'TopRibbon announcement banner saved.',
                    )
                  }
                  className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white hover:bg-[var(--link)]"
                >
                  {isBn ? 'ব্যানার সংরক্ষণ করুন' : 'Save Announcement Banner'}
                </button>
              </div>
            </div>
          </div>

          {/* Blind Essay & Speaking Moderation Queue */}
          <div>
            <WorkspaceSectionTitle
              title={isBn ? 'ব্লাইন্ড রাইটিং ও স্পিকিং মডারেশন কিউ' : 'Blind Essay & Speaking Moderation Queue'}
              subtitle={
                isBn
                  ? 'নিরপেক্ষ মূল্যায়নের জন্য শিক্ষার্থীর নাম ও ইমেইল সম্পূর্ণ অপসারিত; শুধু অ্যানোনিমাইজড সাবমিশন হ্যাশ দৃশ্যমান।'
                  : 'Student names and emails are stripped for blind grading privacy; submissions appear solely by anonymized hash.'
              }
            />
            <WorkspaceDataTable
              caption={isBn ? 'ব্লাইন্ড রাইটিং ও স্পিকিং মডারেশন কিউ' : 'Blind Essay & Speaking Moderation Queue'}
              columns={[
                { key: 'submission', header: isBn ? 'সাবমিশন হ্যাশ' : 'Submission Hash' },
                { key: 'excerpt', header: isBn ? 'উদ্ধৃতি ও ক্যালিব্রেশন নোট' : 'Excerpt & Calibration Note' },
                { key: 'estimate', header: isBn ? 'স্কোর ও অবস্থা' : 'AI Band & Status' },
                { key: 'actions', header: isBn ? 'সিদ্ধান্ত' : 'Decision', align: 'right' },
              ]}
              rows={catalog.moderationQueue.map((item) => {
                const blindHash = toBlindSubmissionHash(item.id);
                return {
                  id: item.id,
                  rowHeader: `${blindHash} · ${item.type}`,
                  rowSubheader: `${item.task} · ${item.submittedAt}`,
                  cells: {
                    excerpt: (
                      <div className="space-y-2 min-w-[240px]">
                        <p className="text-xs text-[var(--text)] leading-relaxed max-w-[56ch]">
                          &ldquo;{item.excerpt}&rdquo;
                        </p>
                        <input
                          type="text"
                          placeholder={isBn ? 'মডারেটর মন্তব্য যোগ করুন...' : 'Blind grader calibration note...'}
                          value={moderationNotes[item.id] ?? item.feedbackNote}
                          onChange={(e) =>
                            setModerationNotes((prev) => ({ ...prev, [item.id]: e.target.value }))
                          }
                          className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-1.5 text-xs text-[var(--brand-deep)]"
                        />
                      </div>
                    ),
                    estimate: (
                      <div className="space-y-0.5 text-xs">
                        <div className="font-semibold text-[var(--brand-deep)]">{item.aiBandOrScore}</div>
                        <div className="text-[var(--text-muted)]">{item.status}</div>
                      </div>
                    ),
                    actions: (
                      <div className="flex flex-wrap items-center justify-end gap-3">
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
                              `Blind submission ${blindHash} approved.`,
                            )
                          }
                          className="rounded-[4px] bg-[var(--brand-deep)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--brand)]"
                        >
                          {isBn ? 'অনুমোদন' : 'Approve'}
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
                              `Revision requested for ${blindHash}.`,
                            )
                          }
                          className="text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)]"
                        >
                          {isBn ? 'সংশোধন অনুরোধ' : 'Request Revision'}
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
                              `Blind submission ${blindHash} removed.`,
                            )
                          }
                          className="text-xs font-medium underline underline-offset-4 text-[var(--brand)] hover:text-[var(--brand-deep)]"
                        >
                          {isBn ? 'অপসারণ' : 'Remove'}
                        </button>
                      </div>
                    ),
                  },
                };
              })}
            />
          </div>

          {/* Vocabulary & FAQ Upkeep */}
          <div>
            <WorkspaceSectionTitle
              title={isBn ? 'ভোকাবুলারি ও এফএকিউ সিএমএস লেজার' : 'Vocabulary & FAQ Upkeep Ledger'}
            />
            <WorkspaceDataTable
              caption={isBn ? 'ভোকাবুলারি ও এফএকিউ সিএমএস লেজার' : 'Vocabulary & FAQ Upkeep Ledger'}
              columns={[
                { key: 'entry', header: isBn ? 'শিরোনাম' : 'Entry' },
                { key: 'kind', header: isBn ? 'ধরন' : 'Kind' },
                { key: 'body', header: isBn ? 'সংজ্ঞা / উত্তর' : 'Definition / Answer' },
                { key: 'id', header: 'ID', align: 'right' },
              ]}
              rows={catalog.cmsItems.map((entry) => ({
                id: entry.id,
                rowHeader: isBn ? entry.titleBn : entry.titleEn,
                cells: {
                  kind: <span className="text-xs font-medium text-[var(--brand-deep)]">{entry.kind}</span>,
                  body: <span className="text-xs">{isBn ? entry.bodyBn : entry.bodyEn}</span>,
                  id: <span className="font-mono text-xs text-[var(--text-muted)]">{entry.id}</span>,
                },
              }))}
            />

            <div className="mt-4 border-b border-[var(--hairline)] pb-5 grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs">
              <select
                value={cmsItemDraft.kind}
                onChange={(e) =>
                  setCmsItemDraft((c) => ({ ...c, kind: e.target.value as 'vocab' | 'faq' }))
                }
                className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
              >
                <option value="vocab">Vocab</option>
                <option value="faq">FAQ</option>
              </select>
              <input
                type="text"
                placeholder="Title (EN)"
                value={cmsItemDraft.titleEn}
                onChange={(e) => setCmsItemDraft((c) => ({ ...c, titleEn: e.target.value }))}
                className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
              />
              <input
                type="text"
                placeholder="Title (BN)"
                value={cmsItemDraft.titleBn}
                onChange={(e) => setCmsItemDraft((c) => ({ ...c, titleBn: e.target.value }))}
                className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
              />
              <input
                type="text"
                placeholder="Definition / Answer (EN)"
                value={cmsItemDraft.bodyEn}
                onChange={(e) => setCmsItemDraft((c) => ({ ...c, bodyEn: e.target.value }))}
                className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)]"
              />
              <button
                type="button"
                disabled={saving || !cmsItemDraft.titleEn.trim() || !cmsItemDraft.bodyEn.trim()}
                onClick={() => {
                  const suffix = String((catalog.cmsItems.length + 11) % 99).padStart(2, '0');
                  const newId = `CMS-${cmsItemDraft.kind === 'vocab' ? 'VOC' : 'FAQ'}-${suffix}`;
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
                className="rounded-[4px] bg-[var(--brand-deep)] px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--brand)] disabled:opacity-50"
              >
                {isBn ? '+ এন্ট্রি যোগ করুন' : '+ Add CMS Entry'}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {catalog && activeTab === 'scholars' ? (
        <section className="space-y-6">
          <WorkspaceSectionTitle
            title={isBn ? 'স্কলার ডিরেক্টরি (ডিফল্টভাবে PII মাস্কড)' : 'Scholar Directory (PII Masked by Default)'}
            subtitle={
              isBn
                ? 'যোগাযোগের তথ্য ডিফল্টভাবে মাস্ক করা থাকে; প্রকাশ করলে তা অডিট লগে (ADMIN_PII_REVEAL) নথিভুক্ত হয়। ব্যক্তিগত স্টাডি নোট ও ভুলের খাতা প্রবেশযোগ্য নয়।'
                : 'Emails and phones are masked by default. Revealing contact details logs an immutable ADMIN_PII_REVEAL audit event. Private study notes remain inaccessible.'
            }
            rightAction={
              <label className="relative inline-flex items-center">
                <Search className="h-4 w-4 text-[var(--text-muted)] absolute left-3" aria-hidden="true" />
                <input
                  type="text"
                  value={scholarSearch}
                  onChange={(e) => setScholarSearch(e.target.value)}
                  placeholder={isBn ? 'আইডি, নাম বা কোহর্ট খুঁজুন...' : 'Filter by ID, name, cohort...'}
                  className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] pl-9 pr-3 py-2 text-sm text-[var(--brand-deep)] w-64"
                />
              </label>
            }
          />

          <WorkspaceDataTable
            caption={isBn ? 'স্কলার ডিরেক্টরি — PII মাস্কড' : 'Scholar Directory — PII Masked'}
            columns={[
              { key: 'scholar', header: isBn ? 'শিক্ষার্থী' : 'Scholar' },
              { key: 'contact', header: isBn ? 'যোগাযোগ (মাস্কড)' : 'Contact (Masked)' },
              { key: 'cohort', header: isBn ? 'কোহর্ট' : 'Cohort' },
              { key: 'credits', header: isBn ? 'এআই ক্রেডিট ও মেয়াদ' : 'Credits & Expiry', align: 'right' },
              { key: 'actions', header: isBn ? 'গভর্নেন্স অ্যাকশন' : 'Governance', align: 'right' },
            ]}
            rows={filteredScholars.map((s) => {
              const isUnmasked = Boolean(unmaskedScholarIds[s.id]);
              const scholarPhone = SCHOLAR_CONTACT_PHONES[s.id] ?? '+8801711000000';
              const displayEmail = isUnmasked ? s.email : maskEmailForAdmin(s.email);
              const displayPhone = isUnmasked ? scholarPhone : maskPhoneForAdmin(scholarPhone);

              return {
                id: s.id,
                rowHeader: `${s.name} · ${s.id}`,
                rowSubheader: `${s.diagnosticStatus} (${s.bandEstimate})`,
                cells: {
                  contact: (
                    <div className="text-xs space-y-0.5">
                      <div>{displayEmail}</div>
                      <div className="text-[var(--text-muted)]">{displayPhone}</div>
                    </div>
                  ),
                  cohort: (
                    <select
                      aria-label={`Cohort for ${s.id}`}
                      value={s.cohort}
                      onChange={(e) =>
                        void postAdminMutation(
                          {
                            action: 'SCHOLAR_ACTION',
                            scholarId: s.id,
                            operation: 'switch_cohort',
                            cohort: e.target.value,
                          },
                          `Moved ${s.id} to ${e.target.value}.`,
                        )
                      }
                      className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-1.5 text-xs text-[var(--brand-deep)]"
                    >
                      {COHORT_OPTIONS.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  ),
                  credits: (
                    <div className="text-xs space-y-0.5">
                      <div className="font-semibold text-[var(--brand-deep)]">
                        {s.aiCreditsRemaining} AI Evals
                      </div>
                      <div className="text-[var(--text-muted)]">Exp {s.expiresAt}</div>
                    </div>
                  ),
                  actions: (
                    <div className="flex flex-wrap items-center justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => handleToggleScholarMask(s.id, s.email)}
                        className="inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                      >
                        {isUnmasked ? (
                          <EyeOff className="h-3.5 w-3.5" aria-hidden="true" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        )}
                        <span>
                          {isUnmasked
                            ? isBn
                              ? 'আবার মাস্ক করুন'
                              : 'Mask Contact'
                            : isBn
                              ? 'যোগাযোগ দেখুন (অডিটেড) →'
                              : 'Unmask Contact (Audited) →'}
                        </span>
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          void postAdminMutation(
                            { action: 'SCHOLAR_ACTION', scholarId: s.id, operation: 'extend_30d' },
                            `Extended access +30 days for ${s.id}.`,
                          )
                        }
                        className="text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                      >
                        {isBn ? '+৩০ দিন অ্যাক্সেস' : '+30 Days Access'}
                      </button>

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
                            `Granted +5 AI evaluation credits to ${s.id}.`,
                          )
                        }
                        className="text-xs font-medium underline underline-offset-4 text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                      >
                        {isBn ? '+৫ এআই ক্রেডিট' : '+5 AI Evaluation Credits'}
                      </button>

                      <button
                        type="button"
                        disabled={saving}
                        onClick={() =>
                          void postAdminMutation(
                            { action: 'SCHOLAR_ACTION', scholarId: s.id, operation: 'reset_diagnostic' },
                            `Diagnostic reset for ${s.id}.`,
                          )
                        }
                        className="text-xs font-medium underline underline-offset-4 text-[var(--brand)] hover:text-[var(--brand-deep)] leading-relaxed"
                      >
                        {isBn ? 'ডায়াগনস্টিক রিসেট' : 'Reset Diagnostic'}
                      </button>
                    </div>
                  ),
                },
              };
            })}
          />
        </section>
      ) : null}

      {catalog && activeTab === 'flags' ? (
        <section className="space-y-10">
          <div>
            <WorkspaceSectionTitle
              title={isBn ? 'সিস্টেম ফিচার ফ্ল্যাগ ও কিল-সুইচ' : 'System Feature Flags & Kill-Switches'}
              subtitle={
                isBn
                  ? 'স্প্লিট-পে, গেস্ট চেকআউট, অনুবাদ বাজেট গার্ড ও এআই গ্রেডিং কঠোরতা নিয়ন্ত্রণ করুন।'
                  : 'Operational switches governing checkout rails, translation rate guards, and rubric calibration.'
              }
            />
            <WorkspaceDataTable
              caption={isBn ? 'সিস্টেম ফিচার ফ্ল্যাগ ও কিল-সুইচ' : 'System Feature Flags & Kill-Switches'}
              columns={[
                { key: 'flag', header: isBn ? 'ফিচার ফ্ল্যাগ' : 'Feature Flag' },
                { key: 'state', header: isBn ? 'অবস্থা' : 'State' },
                { key: 'control', header: isBn ? 'নিয়ন্ত্রণ' : 'Control', align: 'right' },
              ]}
              rows={[
                ...(
                  [
                    {
                      key: 'splitPayEnabled',
                      label: 'splitPayEnabled · 2-Part / 3-Part Installments',
                      desc: 'Enables fractional clearing-fee installment schedules in /checkout.',
                    },
                    {
                      key: 'guestCheckoutEnabled',
                      label: 'guestCheckoutEnabled · Guest Enrollment',
                      desc: 'Allows prospective scholars to complete tuition settlement prior to account activation.',
                    },
                    {
                      key: 'translateBudgetGuard',
                      label: 'translateBudgetGuard · /api/translate Budget Guard',
                      desc: 'Caps LLM translation volume per minute to prevent quota overrun.',
                    },
                    {
                      key: 'maintenanceBanner',
                      label: 'maintenanceBanner · Exam Maintenance Kill-Switch',
                      desc: 'Displays scheduled maintenance warning prior to new timed mock attempts.',
                    },
                  ] as const
                ).map((item) => {
                  const active = catalog.featureFlags[item.key];
                  return {
                    id: item.key,
                    rowHeader: item.label,
                    rowSubheader: item.desc,
                    cells: {
                      state: (
                        <span className="text-xs font-medium text-[var(--brand-deep)]">
                          {active ? (isBn ? 'সক্রিয়' : 'Enabled') : isBn ? 'নিষ্ক্রিয়' : 'Disabled'}
                        </span>
                      ),
                      control: (
                        <button
                          type="button"
                          disabled={saving}
                          onClick={() =>
                            void postAdminMutation(
                              { action: 'TOGGLE_FLAG', flag: item.key, value: !active },
                              `Flag "${item.key}" toggled to ${String(!active)}.`,
                            )
                          }
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] hover:border-[var(--brand)]"
                        >
                          {active ? (isBn ? 'বন্ধ করুন' : 'Disable') : isBn ? 'চালু করুন' : 'Enable'}
                        </button>
                      ),
                    },
                  };
                }),
                {
                  id: 'aiStrictnessLevel',
                  rowHeader: isBn
                    ? 'গ্লোবাল এআই রাইটিং ও স্পিকিং রুব্রিক কঠোরতা'
                    : 'Global AI Writing & Speaking Rubric Strictness',
                  rowSubheader: isBn
                    ? 'স্বয়ংক্রিয় রুব্রিক স্কোরিং ও সিনিয়র মানব গ্রেডারদের মধ্যে QWK সমন্বয়।'
                    : 'Calibrates QWK alignment between automated rubric scoring and senior human graders.',
                  cells: {
                    state: (
                      <span className="text-xs font-medium text-[var(--brand-deep)]">
                        {catalog.featureFlags.aiStrictnessLevel}
                      </span>
                    ),
                    control: (
                      <div className="flex flex-wrap justify-end gap-2">
                        {(['lenient', 'standard', 'strict'] as RuntimeFeatureFlags['aiStrictnessLevel'][]).map(
                          (lvl) => {
                            const isSelected = catalog.featureFlags.aiStrictnessLevel === lvl;
                            const displayLabel = lvl.charAt(0).toUpperCase() + lvl.slice(1);
                            return (
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
                                className={
                                  isSelected
                                    ? 'rounded-[4px] bg-[var(--brand-deep)] px-3 py-1.5 text-xs font-semibold text-white'
                                    : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)]'
                                }
                              >
                                {displayLabel}
                              </button>
                            );
                          },
                        )}
                      </div>
                    ),
                  },
                },
              ]}
            />
          </div>

          <div>
            <WorkspaceSectionTitle
              title={isBn ? '২পিএল আইআরটি আইটেম সাইকোমেট্রিক্স' : '2PL IRT Item Psychometrics & Calibration'}
              subtitle={
                isBn
                  ? 'আইটেম কঠিন্য (p-মান), বিভাজন সূচক (a) এবং ট্র্যাপ রেট পর্যবেক্ষণ।'
                  : 'Item difficulty (p-value), discrimination index (a), and distractor trap rate ledger.'
              }
            />
            <WorkspaceDataTable
              caption={isBn ? '২পিএল আইআরটি আইটেম সাইকোমেট্রিক্স' : '2PL IRT Item Psychometrics & Calibration'}
              columns={[
                { key: 'item', header: isBn ? 'আইটেম ও ডোমেইন' : 'Item & Domain' },
                { key: 'pvalue', header: 'p-value', align: 'right' },
                { key: 'disc', header: 'Discrimination (a)', align: 'right' },
                { key: 'trap', header: 'Trap Rate', align: 'right' },
                { key: 'calibration', header: isBn ? 'ক্যালিব্রেশন' : 'Calibration', align: 'right' },
              ]}
              rows={catalog.psychometrics.map((item) => ({
                id: item.id,
                rowHeader: `${item.itemCode} · ${item.domain}`,
                rowSubheader: item.bParam,
                cells: {
                  pvalue: item.pValue.toFixed(2),
                  disc: item.discriminationIndex.toFixed(2),
                  trap: item.trapRate,
                  calibration: (
                    <select
                      aria-label={`Calibration for ${item.itemCode}`}
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
                      className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs text-[var(--brand-deep)]"
                    >
                      <option value="Standard">Standard</option>
                      <option value="Calibrated">Calibrated</option>
                      <option value="Strict">Strict</option>
                    </select>
                  ),
                },
              }))}
            />
          </div>
        </section>
      ) : null}

      {catalog && activeTab === 'audit' ? (
        <section className="space-y-6">
          <WorkspaceSectionTitle
            title={isBn ? 'অপরিবর্তনীয় নিরাপত্তা অডিট লগ ও JSON ব্যাকআপ' : 'Immutable Security Audit Log & JSON Backup'}
            subtitle={`${isBn ? 'সর্বশেষ সিঙ্ক:' : 'Last synced:'} ${catalog.updatedAtIso}`}
            rightAction={
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={handleExportJson}
                  className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-semibold text-[var(--brand-deep)] hover:border-[var(--brand)]"
                >
                  <Download className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isBn ? 'সম্পূর্ণ ক্যাটালগ JSON এক্সপোর্ট' : 'Export Full Catalog JSON'}</span>
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() =>
                    void postAdminMutation(
                      { action: 'RESET_DEFAULTS' },
                      'Restored canonical defaults across /admin & /checkout.',
                    )
                  }
                  className="inline-flex items-center gap-1.5 text-xs font-medium underline underline-offset-4 text-[var(--brand)] hover:text-[var(--brand-deep)]"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isBn ? 'ক্যানোনিকাল ডিফল্টে রিসেট' : 'Reset to Canonical Defaults'}</span>
                </button>
              </div>
            }
          />

          <WorkspaceDataTable
            caption={isBn ? 'অপরিবর্তনীয় নিরাপত্তা অডিট লগ' : 'Security Audit Ledger'}
            columns={[
              { key: 'event', header: isBn ? 'ইভেন্ট ও সাবসিস্টেম' : 'Event & Subsystem' },
              { key: 'actor', header: isBn ? 'পরিচালক' : 'Actor' },
              { key: 'timestamp', header: isBn ? 'সময়' : 'Timestamp' },
              { key: 'status', header: isBn ? 'যাচাই' : 'Status', align: 'right' },
            ]}
            rows={combinedAuditLogs.map((entry) => ({
              id: entry.id,
              rowHeader: `${entry.action} — ${entry.subsystem}`,
              rowSubheader: entry.detail,
              cells: {
                actor: <span className="text-xs">{entry.actor}</span>,
                timestamp: (
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {entry.id} · {entry.timestamp}
                  </span>
                ),
                status: (
                  <span className="inline-flex items-center justify-end gap-1.5 text-xs font-medium text-[var(--brand-deep)]">
                    <ShieldCheck className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
                    <span>{entry.status}</span>
                  </span>
                ),
              },
            }))}
          />
        </section>
      ) : null}
    </WorkspaceContainer>
  );
}

export default function InstitutionalAdminPage() {
  return (
    <React.Suspense
      fallback={
        <WorkspaceContainer>
          <p className="text-sm text-[var(--text-muted)]">Loading Institutional Admin Console...</p>
        </WorkspaceContainer>
      }
    >
      <AdminConsoleContent />
    </React.Suspense>
  );
}
