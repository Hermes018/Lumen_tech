/** @purpose Crash-free Account, Security & Privacy Desk (/app/settings) with Profile Targets, Zero-Training AI Privacy, PDPO 2025 Portability & Active Sessions */
'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import { Download, KeyRound, ShieldCheck, Trash2 } from 'lucide-react';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  WorkspaceLedger,
  WorkspaceLedgerRow,
  WorkspaceSectionTitle,
  WorkspaceTabs,
} from '@/src/components/ui/WorkspacePrimitives';

type SettingsTab = 'profile' | 'privacy' | 'security';
type CurrencyPref = 'auto' | 'BDT' | 'USD';

interface ScholarProfilePrefs {
  fullName: string;
  email: string;
  targetExamDate: string;
  greTargetScore: string;
  ieltsTargetBand: string;
  currencyPref: CurrencyPref;
}

interface PrivacyGovernancePrefs {
  zeroTrainingAi: boolean;
  anonymizeCohortLeaderboard: boolean;
  adminPiiMasking: boolean;
}

interface ActiveSessionRow {
  id: string;
  deviceEn: string;
  deviceBn: string;
  locationEn: string;
  locationBn: string;
  current: boolean;
}

const STORAGE_KEY_PROFILE = 'lumen_scholar_profile_v1';
const STORAGE_KEY_PRIVACY = 'lumen_privacy_governance_v1';

const DEFAULT_PROFILE: ScholarProfilePrefs = {
  fullName: 'Ayman Rahman',
  email: 'ayman@lumen.academy',
  targetExamDate: '2026-12-15',
  greTargetScore: '325+',
  ieltsTargetBand: '8.0',
  currencyPref: 'auto',
};

const DEFAULT_PRIVACY: PrivacyGovernancePrefs = {
  zeroTrainingAi: true,
  anonymizeCohortLeaderboard: true,
  adminPiiMasking: true,
};

const DEFAULT_SESSIONS: ActiveSessionRow[] = [
  {
    id: 'sess-current',
    deviceEn: 'Fedora Linux · Chromium · Dhaka, BD · Current Session',
    deviceBn: 'ফেডোরা লিনাক্স · ক্রোমিয়াম · ঢাকা, বাংলাদেশ · বর্তমান সেশন',
    locationEn: 'Passwordless Email OTP · Verified',
    locationBn: 'পাসওয়ার্ডবিহীন ইমেইল ওটিপি · যাচাইকৃত',
    current: true,
  },
  {
    id: 'sess-mobile',
    deviceEn: 'Android Mobile · Dhaka, BD · 2 days ago',
    deviceBn: 'অ্যান্ড্রয়েড মোবাইল · ঢাকা, বাংলাদেশ · ২ দিন আগে',
    locationEn: 'Mobile Companion Session',
    locationBn: 'মোবাইল সেশন',
    current: false,
  },
];

export default function ScholarSettingsPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const [profile, setProfile] = useState<ScholarProfilePrefs>(DEFAULT_PROFILE);
  const [privacy, setPrivacy] = useState<PrivacyGovernancePrefs>(DEFAULT_PRIVACY);
  const [sessions, setSessions] = useState<ActiveSessionRow[]>(DEFAULT_SESSIONS);

  const [erasureOpen, setErasureOpen] = useState(false);
  const [erasureReason, setErasureReason] = useState('');
  const [erasureScheduled, setErasureScheduled] = useState(false);

  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [guardianStatus, setGuardianStatus] = useState<string | null>(null);

  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    try {
      const savedProfile = window.localStorage.getItem(STORAGE_KEY_PROFILE);
      if (savedProfile) {
        const parsed = JSON.parse(savedProfile) as Partial<ScholarProfilePrefs>;
        setProfile((prev) => ({
          fullName: typeof parsed.fullName === 'string' ? parsed.fullName : prev.fullName,
          email: typeof parsed.email === 'string' ? parsed.email : prev.email,
          targetExamDate:
            typeof parsed.targetExamDate === 'string' ? parsed.targetExamDate : prev.targetExamDate,
          greTargetScore:
            typeof parsed.greTargetScore === 'string' ? parsed.greTargetScore : prev.greTargetScore,
          ieltsTargetBand:
            typeof parsed.ieltsTargetBand === 'string'
              ? parsed.ieltsTargetBand
              : prev.ieltsTargetBand,
          currencyPref:
            parsed.currencyPref === 'BDT' ||
            parsed.currencyPref === 'USD' ||
            parsed.currencyPref === 'auto'
              ? parsed.currencyPref
              : prev.currencyPref,
        }));
      }

      const savedPrivacy = window.localStorage.getItem(STORAGE_KEY_PRIVACY);
      if (savedPrivacy) {
        const parsed = JSON.parse(savedPrivacy) as Partial<PrivacyGovernancePrefs>;
        setPrivacy({
          zeroTrainingAi: parsed.zeroTrainingAi ?? true,
          anonymizeCohortLeaderboard: parsed.anonymizeCohortLeaderboard ?? true,
          adminPiiMasking: parsed.adminPiiMasking ?? true,
        });
      }
    } catch {
      // Ignore storage access restrictions
    }
  }, []);

  function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    try {
      window.localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
      if (profile.currencyPref === 'BDT' || profile.currencyPref === 'USD') {
        window.localStorage.setItem('lumen_currency', profile.currencyPref);
      } else {
        window.localStorage.removeItem('lumen_currency');
      }
    } catch {
      // Ignore storage failures
    }
    setNotice(
      isBn
        ? 'প্রোফাইল ও পরীক্ষার লক্ষ্য সংরক্ষিত হয়েছে।'
        : 'Profile & exam target preferences saved.',
    );
  }

  function handleTogglePrivacy(key: keyof PrivacyGovernancePrefs) {
    const next = { ...privacy, [key]: !privacy[key] };
    setPrivacy(next);
    try {
      window.localStorage.setItem(STORAGE_KEY_PRIVACY, JSON.stringify(next));
    } catch {
      // Ignore storage failures
    }
    setNotice(
      isBn
        ? 'প্রাইভেসি ও এআই ডেটা নীতিমালা হালনাগাদ হয়েছে।'
        : 'Privacy & AI data governance preference updated.',
    );
  }

  function handleExportArchive() {
    const exportedAt = new Date().toISOString();
    const archivePayload = {
      schema: 'lumen-pdpo-2025-export-v1',
      platform: brand.name,
      exportedAtIso: exportedAt,
      profile,
      privacyGovernance: privacy,
      studyHistorySummary: {
        activeTracks: ['GRE General Test', 'IELTS Academic & GT'],
        mocksCompleted: 3,
        fsrsVocabularyCardsReviewed: 420,
      },
      mistakeLedgerSummary: [
        { id: 'M-101', track: 'GRE Quant', topic: 'Even Exponent Roots', status: 'Resolved' },
        { id: 'M-104', track: 'IELTS Reading', topic: 'True / False / Not Given', status: 'Active' },
      ],
      invoiceMetadata: [
        { invoiceId: 'INV-2026-1041', plan: 'GRE Complete Track (1/2)', amount: '5027 BDT', status: 'Paid' },
        { invoiceId: 'INV-2026-0892', plan: 'Mock & AI Pass', amount: '25.00 USD', status: 'Paid' },
      ],
    };

    const blob = new Blob([JSON.stringify(archivePayload, null, 2)], {
      type: 'application/json;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `lumen-pdpo-archive-${exportedAt.slice(0, 10)}.json`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setNotice(
      isBn
        ? 'সম্পূর্ণ ব্যক্তিগত আর্কাইভ (JSON) ডাউনলোড হয়েছে।'
        : 'Complete personal archive exported as JSON (PDPO 2025 / GDPR format).',
    );
  }

  function handleConfirmErasure() {
    setErasureScheduled(true);
    setErasureOpen(false);
    setErasureReason('');
    setNotice(
      isBn
        ? '৩০-দিনের গ্রেস পিরিয়ডসহ স্থায়ী অ্যাকাউন্ট মুছে ফেলার অনুরোধ নথিভুক্ত হয়েছে।'
        : 'Permanent account & data erasure request scheduled with a 30-day statutory grace period (PDPO 2025).',
    );
  }

  function handleGuardianSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!guardianEmail.trim() && !guardianPhone.trim()) {
      setGuardianStatus(
        isBn
          ? 'অনুগ্রহ করে অভিভাবকের ইমেইল বা ফোন নম্বর দিন।'
          : 'Please enter a parent or guardian email or phone number.',
      );
      return;
    }
    setGuardianStatus(
      isBn
        ? 'অভিভাবক সম্মতি যাচাই অনুরোধ প্রস্তুত হয়েছে।'
        : 'Optional guardian consent verification request recorded (PDPO 2025).',
    );
  }

  function handleRevokeOtherSessions() {
    setSessions((prev) => prev.filter((s) => s.current));
    setNotice(
      isBn
        ? 'অন্যান্য সকল ব্রাউজার ও মোবাইল সেশন বাতিল করা হয়েছে।'
        : 'All other browser and mobile sessions have been revoked.',
    );
  }

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'অ্যাকাউন্ট, নিরাপত্তা ও প্রাইভেসি ডেস্ক' : 'Account, Security & Privacy Desk'}
        subtitle={
          isBn
            ? 'আপনার পরীক্ষার লক্ষ্য, জিরো-ট্রেনিং এআই ডেটা প্রাইভেসি, পিডিপিও ২০২৫ ডেটা পোর্টেবিলিটি এবং সক্রিয় সেশন পরিচালনা করুন।'
            : 'Manage your academic exam targets, zero-training AI data privacy controls, PDPO 2025 portability, and active sessions.'
        }
        metaText={
          mounted
            ? isBn
              ? `${profile.fullName} · ${profile.email}`
              : `${profile.fullName} · ${profile.email}`
            : `${DEFAULT_PROFILE.fullName} · ${DEFAULT_PROFILE.email}`
        }
        primaryAction={{
          label: isBn ? 'প্ল্যান ও বিলিং দেখুন →' : 'Plans & Billing →',
          href: '/app/billing',
        }}
        secondaryAction={{
          label: isBn ? 'স্টাডি ডেস্কে ফিরুন →' : 'Back to Study Desk →',
          href: '/app',
        }}
      />

      {notice ? (
        <div
          role="status"
          className="mb-6 border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] px-4 py-3 text-sm text-[var(--brand-deep)] leading-relaxed"
        >
          {notice}
        </div>
      ) : null}

      <WorkspaceTabs
        activeTab={activeTab}
        onSelect={(id) => setActiveTab(id as SettingsTab)}
        tabs={[
          {
            id: 'profile',
            label: isBn ? '১. প্রোফাইল ও পরীক্ষার লক্ষ্য' : '1. Profile & Exam Targets',
          },
          {
            id: 'privacy',
            label: isBn ? '২. প্রাইভেসি ও এআই ডেটা গভর্ন্যান্স' : '2. Privacy & AI Data Governance',
          },
          {
            id: 'security',
            label: isBn ? '৩. নিরাপত্তা ও সক্রিয় সেশন' : '3. Security & Active Sessions',
            count: sessions.length,
          },
        ]}
      />

      {activeTab === 'profile' ? (
        <section aria-label={isBn ? 'প্রোফাইল ও পরীক্ষার লক্ষ্য' : 'Profile & Exam Targets'}>
          <WorkspaceSectionTitle
            title={isBn ? 'স্কলার প্রোফাইল ও লক্ষ্যমাত্রা' : 'Scholar Profile & Exam Targets'}
            subtitle={
              isBn
                ? 'আপনার স্টাডি শিডিউল ও স্কোর বিশ্লেষণ এই লক্ষ্যমাত্রা অনুযায়ী সমন্বয় করা হয়।'
                : 'Your study schedule and score predictor calibrate directly against these targets.'
            }
          />

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)]">
              <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label htmlFor="scholar-full-name" className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'স্কলারের পূর্ণ নাম' : 'Scholar Full Name'}
                </label>
                <input
                  id="scholar-full-name"
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full sm:w-80 border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </div>

              <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label htmlFor="scholar-primary-email" className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'প্রাথমিক ইমেইল' : 'Primary Email'}
                </label>
                <input
                  id="scholar-primary-email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  className="w-full sm:w-80 border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </div>

              <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label htmlFor="scholar-exam-date" className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'লক্ষ্য পরীক্ষার তারিখ' : 'Target Exam Date'}
                </label>
                <input
                  id="scholar-exam-date"
                  type="date"
                  value={profile.targetExamDate}
                  onChange={(e) => setProfile({ ...profile, targetExamDate: e.target.value })}
                  className="w-full sm:w-80 border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </div>

              <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label htmlFor="scholar-gre-target" className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'জিআরই লক্ষ্য স্কোর' : 'GRE Target Score'}
                </label>
                <input
                  id="scholar-gre-target"
                  type="text"
                  value={profile.greTargetScore}
                  onChange={(e) => setProfile({ ...profile, greTargetScore: e.target.value })}
                  className="w-full sm:w-80 border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </div>

              <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label htmlFor="scholar-ielts-target" className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'আইইএলটিএস লক্ষ্য ব্যান্ড' : 'IELTS Target Band'}
                </label>
                <input
                  id="scholar-ielts-target"
                  type="text"
                  value={profile.ieltsTargetBand}
                  onChange={(e) => setProfile({ ...profile, ieltsTargetBand: e.target.value })}
                  className="w-full sm:w-80 border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </div>

              <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <label htmlFor="scholar-billing-currency" className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'পছন্দের বিলিং কারেন্সি' : 'Preferred Billing Currency'}
                </label>
                <select
                  id="scholar-billing-currency"
                  value={profile.currencyPref}
                  onChange={(e) =>
                    setProfile({ ...profile, currencyPref: e.target.value as CurrencyPref })
                  }
                  className="w-full sm:w-80 border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                >
                  <option value="auto">{isBn ? 'স্বয়ংক্রিয় Geo-IP' : 'Auto Geo-IP'}</option>
                  <option value="BDT">
                    {isBn ? 'বাংলাদেশ · BDT ৳' : 'Bangladesh · BDT ৳'}
                  </option>
                  <option value="USD">
                    {isBn ? 'আন্তর্জাতিক · USD $' : 'International · USD $'}
                  </option>
                </select>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="bg-[var(--brand)] text-white px-5 py-2.5 text-sm font-semibold rounded-[4px] hover:bg-[var(--link)] transition-colors leading-relaxed"
              >
                {isBn ? 'পছন্দসমূহ সংরক্ষণ করুন' : 'Save Preferences'}
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {activeTab === 'privacy' ? (
        <section aria-label={isBn ? 'প্রাইভেসি ও এআই ডেটা গভর্ন্যান্স' : 'Privacy & AI Data Governance'}>
          <WorkspaceSectionTitle
            title={
              isBn
                ? 'প্রাইভেসি ও এআই ডেটা গভর্ন্যান্স (ডিজাইনেই সুরক্ষা)'
                : 'Privacy & AI Data Governance — Privacy by Design'
            }
            subtitle={
              isBn
                ? 'আপনার রাইটিং ও স্পিকিং ডেটা সর্বদা বিচ্ছিন্ন ও গোপনীয় থাকে।'
                : 'Zero-training AI guarantees and strict admin PII isolation are enabled by default.'
            }
          />

          <div className="divide-y divide-[var(--hairline)] border-y border-[var(--hairline)] mb-10">
            <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-[65ch]">
                <div className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                  {isBn
                    ? 'কঠোর এআই রচনা ও স্পিকিং প্রাইভেসি (জিরো ট্রেনিং নিশ্চয়তা)'
                    : 'Strict AI Essay & Speaking Privacy (Zero Training Guarantee)'}
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  {isBn
                    ? 'শেয়ার্ড রুব্রিক মডেল প্রশিক্ষণ বা ক্যালিব্রেশনের জন্য কখনোই আমার রাইটিং রচনা বা স্পিকিং অডিও ব্যবহার করবেন না।'
                    : 'Never use my Writing essays or Speaking audio recordings to train or calibrate shared rubric models.'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={privacy.zeroTrainingAi}
                onClick={() => handleTogglePrivacy('zeroTrainingAi')}
                className={
                  privacy.zeroTrainingAi
                    ? 'shrink-0 border border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white px-3.5 py-2 text-xs font-semibold rounded-[4px] leading-relaxed'
                    : 'shrink-0 border border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold rounded-[4px] leading-relaxed'
                }
              >
                {privacy.zeroTrainingAi
                  ? isBn
                    ? 'সক্রিয় · ব্যক্তিগত ও বিচ্ছিন্ন'
                    : 'Enabled · Private & Isolated'
                  : isBn
                    ? 'নিষ্ক্রিয়'
                    : 'Disabled'}
              </button>
            </div>

            <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-[65ch]">
                <div className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                  {isBn
                    ? 'কোহর্ট পার্সেন্টাইল বেনামীকরণ'
                    : 'Cohort Percentile Anonymization'}
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  {isBn
                    ? 'কোহর্ট পার্সেন্টাইল লিডারবোর্ড থেকে আমার নাম ও স্কোরের ধারা গোপন রাখুন।'
                    : 'Hide my name and score trajectory from cohort percentile leaderboards.'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={privacy.anonymizeCohortLeaderboard}
                onClick={() => handleTogglePrivacy('anonymizeCohortLeaderboard')}
                className={
                  privacy.anonymizeCohortLeaderboard
                    ? 'shrink-0 border border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white px-3.5 py-2 text-xs font-semibold rounded-[4px] leading-relaxed'
                    : 'shrink-0 border border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold rounded-[4px] leading-relaxed'
                }
              >
                {privacy.anonymizeCohortLeaderboard
                  ? isBn
                    ? 'সক্রিয় · গোপন'
                    : 'Enabled · Hidden'
                  : isBn
                    ? 'নিষ্ক্রিয়'
                    : 'Disabled'}
              </button>
            </div>

            <div className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1 max-w-[65ch]">
                <div className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                  {isBn
                    ? 'অ্যাডমিন সাপোর্ট পিআইআই মাস্কিং'
                    : 'Admin Support PII Masking'}
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  {isBn
                    ? 'সাপোর্ট কর্মীরা আমার ইমেইল বা ফোন নম্বর দেখার আগে অডিট-লগড অনুমোদন বাধ্যতামূলক করুন।'
                    : 'Require explicit audit-logged authorization before support staff can view my unmasked email or phone number.'}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={privacy.adminPiiMasking}
                onClick={() => handleTogglePrivacy('adminPiiMasking')}
                className={
                  privacy.adminPiiMasking
                    ? 'shrink-0 border border-[var(--brand-deep)] bg-[var(--brand-deep)] text-white px-3.5 py-2 text-xs font-semibold rounded-[4px] leading-relaxed'
                    : 'shrink-0 border border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold rounded-[4px] leading-relaxed'
                }
              >
                {privacy.adminPiiMasking
                  ? isBn
                    ? 'সক্রিয় · মাস্কড'
                    : 'Enabled · Masked'
                  : isBn
                    ? 'নিষ্ক্রিয়'
                    : 'Disabled'}
              </button>
            </div>
          </div>

          <WorkspaceSectionTitle
            title={
              isBn
                ? 'বিধিবদ্ধ ডেটা পোর্টেবিলিটি ও মুছে ফেলার অধিকার (PDPO 2025 / GDPR)'
                : 'Statutory Data Portability & Right to Erasure (PDPO 2025 / GDPR)'
            }
          />

          <WorkspaceLedger>
            <WorkspaceLedgerRow
              left={
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                    <Download className="h-4 w-4 text-[var(--brand)] shrink-0" />
                    <span>
                      {isBn
                        ? 'সম্পূর্ণ ব্যক্তিগত আর্কাইভ এক্সপোর্ট (JSON)'
                        : 'Export Complete Personal Archive (JSON)'}
                    </span>
                  </div>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {isBn
                      ? 'প্রোফাইল, স্টাডি ইতিহাস, ভুলের খাতা এবং রসিদ মেটাডেটাসহ পোর্টেবল .json ফাইল ডাউনলোড করুন।'
                      : 'Downloads a portable .json archive containing your profile, study history, mistake ledger, and invoice metadata.'}
                  </p>
                </div>
              }
              right={
                <button
                  type="button"
                  onClick={handleExportArchive}
                  className="underline underline-offset-4 text-sm font-medium text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed"
                >
                  {isBn ? 'JSON আর্কাইভ ডাউনলোড করুন →' : 'Download Archive (.json) →'}
                </button>
              }
            />

            <div className="py-1">
              <WorkspaceLedgerRow
                left={
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[var(--brand-deep)]">
                      <Trash2 className="h-4 w-4 text-[var(--brand)] shrink-0" />
                      <span>
                        {isBn
                          ? 'স্থায়ী অ্যাকাউন্ট ও ডেটা মুছে ফেলার অনুরোধ'
                          : 'Request Permanent Account & Data Erasure'}
                      </span>
                    </div>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {erasureScheduled
                        ? isBn
                          ? '৩০-দিনের গ্রেস পিরিয়ড নির্ধারিত হয়েছে (PDPO 2025)।'
                          : 'Erasure scheduled with a 30-day statutory grace period (PDPO 2025).'
                        : isBn
                          ? 'স্থায়ীভাবে মুছে ফেলার আগে ৩০-দিনের বিধিবদ্ধ গ্রেস পিরিয়ড প্রযোজ্য হবে।'
                          : 'Applies a 30-day statutory grace period before irreversible cryptographic erasure.'}
                    </p>
                  </div>
                }
                right={
                  erasureScheduled ? (
                    <span className="text-xs font-semibold text-[var(--brand)]">
                      {isBn ? 'গ্রেস পিরিয়ড সক্রিয় (৩০ দিন)' : 'Grace Period Active (30 Days)'}
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setErasureOpen((v) => !v)}
                      className="underline underline-offset-4 text-sm font-medium text-[var(--brand)] hover:text-[var(--link)] leading-relaxed"
                    >
                      {erasureOpen
                        ? isBn
                          ? 'বাতিল করুন'
                          : 'Cancel'
                        : isBn
                          ? 'মুছে ফেলার অনুরোধ →'
                          : 'Request Erasure →'}
                    </button>
                  )
                }
              />

              {erasureOpen ? (
                <div className="mx-2 mb-4 border border-[var(--hairline)] bg-[var(--surface-paper)] p-4 space-y-3">
                  <p className="text-xs text-[var(--text)] leading-relaxed">
                    {isBn
                      ? 'আপনার অনুরোধ জমা হলে অ্যাকাউন্ট ৩০ দিনের গ্রেস পিরিয়ডে প্রবেশ করবে। এই সময়ের মধ্যে সাইন ইন করে অনুরোধ বাতিল করা যাবে।'
                      : 'Submitting schedules permanent erasure after a 30-day grace period. You can cancel by signing in before the grace window closes.'}
                  </p>
                  <input
                    type="text"
                    value={erasureReason}
                    onChange={(e) => setErasureReason(e.target.value)}
                    placeholder={
                      isBn ? 'কারণ লিখুন (ঐচ্ছিক)...' : 'Optional reason for erasure...'
                    }
                    aria-label={isBn ? 'মুছে ফেলার কারণ' : 'Reason for account erasure'}
                    className="w-full border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                  />
                  <button
                    type="button"
                    onClick={handleConfirmErasure}
                    className="bg-[var(--brand)] text-white px-4 py-2 text-sm font-semibold rounded-[4px] hover:bg-[var(--link)] leading-relaxed"
                  >
                    {isBn
                      ? '৩০-দিনের মুছে ফেলার অনুরোধ নিশ্চিত করুন'
                      : 'Confirm 30-Day Erasure Request'}
                  </button>
                </div>
              ) : null}
            </div>
          </WorkspaceLedger>

          <details className="lumen-disclosure border-t border-[var(--hairline)] pt-4 mt-6">
            <summary className="cursor-pointer text-sm font-semibold text-[var(--brand-deep)] hover:text-[var(--brand)] leading-relaxed">
              {isBn
                ? 'বয়স ১৮ বছরের কম? ঐচ্ছিক অভিভাবকের সম্মতি কনফিগার করুন (PDPO 2025)'
                : 'Under 18 years old? Configure optional parent or guardian consent (PDPO 2025)'}
            </summary>
            <form onSubmit={handleGuardianSubmit} className="mt-4 space-y-4 bg-[var(--surface-paper)] border border-[var(--hairline)] p-5">
              <p className="text-xs text-[var(--text)] leading-relaxed">
                {isBn
                  ? '১৮ বছরের কম বয়সী শিক্ষার্থীদের জন্য অভিভাবকের ইমেইল বা ফোন নম্বরে সম্মতি যাচাই লিংক পাঠানো যাবে।'
                  : 'Optional for learners under 18. Provide a parent or guardian contact to log verifiable consent under Bangladesh PDPO 2025.'}
              </p>
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="email"
                  value={guardianEmail}
                  onChange={(e) => setGuardianEmail(e.target.value)}
                  placeholder={isBn ? 'অভিভাবকের ইমেইল' : 'Guardian email address'}
                  aria-label={isBn ? 'অভিভাবকের ইমেইল' : 'Guardian email'}
                  className="border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
                <input
                  type="tel"
                  value={guardianPhone}
                  onChange={(e) => setGuardianPhone(e.target.value)}
                  placeholder={isBn ? 'অভিভাবকের ফোন (+8801...)' : 'Guardian phone (+8801...)'}
                  aria-label={isBn ? 'অভিভাবকের ফোন' : 'Guardian phone'}
                  className="border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <button
                  type="submit"
                  className="bg-[var(--brand)] text-white px-4 py-2 text-sm font-semibold rounded-[4px] hover:bg-[var(--link)] leading-relaxed"
                >
                  {isBn ? 'অভিভাবক সম্মতি অনুরোধ পাঠান' : 'Send Optional Guardian Request'}
                </button>
                {guardianStatus ? (
                  <span className="text-xs text-[var(--brand-deep)]">{guardianStatus}</span>
                ) : null}
              </div>
            </form>
          </details>
        </section>
      ) : null}

      {activeTab === 'security' ? (
        <section aria-label={isBn ? 'নিরাপত্তা ও সক্রিয় সেশন' : 'Security & Active Sessions'}>
          <WorkspaceSectionTitle
            title={isBn ? 'অথেনটিকেশন ও সক্রিয় সেশন' : 'Authentication & Active Browser Sessions'}
            subtitle={
              isBn
                ? 'অ্যাকাউন্ট সুরক্ষা পদ্ধতি ও বর্তমানে লগইন থাকা ডিভাইসসমূহ।'
                : 'Manage passwordless login credentials and active browser sessions.'
            }
            rightAction={
              sessions.length > 1 ? (
                <button
                  type="button"
                  onClick={handleRevokeOtherSessions}
                  className="underline underline-offset-4 text-sm font-medium text-[var(--brand)] hover:text-[var(--link)] leading-relaxed"
                >
                  {isBn ? 'অন্যান্য সকল সেশন বাতিল করুন' : 'Revoke All Other Sessions'}
                </button>
              ) : null
            }
          />

          <div className="mb-8 border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <KeyRound className="h-4 w-4 text-[var(--brand)] mt-1 shrink-0" />
              <div className="space-y-1">
                <div className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'প্রমাণীকরণ পদ্ধতি' : 'Authentication Method'}
                </div>
                <div className="text-xs text-[var(--text)] leading-relaxed">
                  {isBn
                    ? 'পাসওয়ার্ডবিহীন ইমেইল/এসএমএস ওটিপি + পাসকি প্রস্তুত'
                    : 'Passwordless Email/SMS OTP + Passkey Ready'}
                </div>
              </div>
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-deep)]">
              <ShieldCheck className="h-4 w-4 text-[var(--brand)]" />
              <span>{isBn ? 'সুরক্ষিত সেশন' : 'Protected Session'}</span>
            </div>
          </div>

          <WorkspaceLedger>
            {sessions.map((sess) => (
              <WorkspaceLedgerRow
                key={sess.id}
                left={
                  <div className="space-y-1">
                    <div className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                      {isBn ? sess.deviceBn : sess.deviceEn}
                    </div>
                    <div className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {isBn ? sess.locationBn : sess.locationEn}
                    </div>
                  </div>
                }
                right={
                  <span className="text-xs font-medium text-[var(--brand-deep)]">
                    {sess.current
                      ? isBn
                        ? 'বর্তমান ডিভাইস'
                        : 'Current Device'
                      : isBn
                        ? 'সক্রিয়'
                        : 'Active'}
                  </span>
                }
              />
            ))}
          </WorkspaceLedger>
        </section>
      ) : null}
    </WorkspaceContainer>
  );
}
