/** @purpose Refund and Cancellation Policy page (D12 C13b & D5) in the Claude Editorial Design Language */
import React from 'react';
import { brand } from '@lumen/config';
import {
  WorkspaceDataTable,
  WorkspaceFocusSheet,
  type WorkspaceTableColumn,
  type WorkspaceTableRow,
} from '@/src/components/ui/WorkspacePrimitives';
import { LegalDocumentHeader } from '../_components/LegalChrome';

const REFUND_COLUMNS: WorkspaceTableColumn[] = [
  { key: 'category', header: 'Product Category' },
  { key: 'window', header: 'Statutory Refund Window' },
  { key: 'ceiling', header: 'Consumption Ceiling' },
  { key: 'code', header: 'Policy Code' },
];

const REFUND_ROWS: WorkspaceTableRow[] = [
  {
    id: 'standard_7d',
    rowHeader: 'Comprehensive Courses & Bundles',
    cells: {
      window: '7 calendar days from transaction time',
      ceiling: '< 20% lessons & <= 1 full mock',
      code: <code className="font-mono text-xs text-[var(--brand-deep)]">standard_7d</code>,
    },
  },
  {
    id: 'pass_1m_72h',
    rowHeader: '1-Month Short Passes',
    cells: {
      window: '72 hours (3 calendar days)',
      ceiling: '< 20% lessons & <= 1 full mock',
      code: <code className="font-mono text-xs text-[var(--brand-deep)]">pass_1m_72h</code>,
    },
  },
  {
    id: 'before_class_3',
    rowHeader: 'Live Cohort Batches (Zoom)',
    cells: {
      window: 'Prior to the start of Class 3',
      ceiling: 'Attendance <= 2 live classes',
      code: <code className="font-mono text-xs text-[var(--brand-deep)]">before_class_3</code>,
    },
  },
  {
    id: 'before_class_2',
    rowHeader: 'Express Crash Courses',
    cells: {
      window: 'Prior to the start of Class 2',
      ceiling: 'Attendance <= 1 live class',
      code: <code className="font-mono text-xs text-[var(--brand-deep)]">before_class_2</code>,
    },
  },
  {
    id: 'standalone_credits',
    rowHeader: 'Standalone AI Credit Packs',
    cells: {
      window: '7 calendar days',
      ceiling: 'Unconsumed credits only',
      code: <code className="font-mono text-xs text-[var(--brand-deep)]">standalone_credits</code>,
    },
  },
];

export default async function RefundPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'bn' ? 'bn' : 'en';

  return (
    <article>
      <LegalDocumentHeader
        title="Refund & Cancellation Policy"
        subtitle="Official authoritative policy governed by D5 & D12 C13b: automated 1-click evaluation, strict consumption ceilings, and Mushak 6.3 VAT reversals."
        metaText="Effective Date: November 13, 2026 · D12 C13b Authoritative"
        locale={locale}
      />

      <WorkspaceFocusSheet
        title="Our Transparent Refund Guarantee"
        body={`${brand.name} provides an honest, automated, self-serve refund policy designed to protect serious students while preventing bad-faith exploitation of digital educational intellectual property and third-party AI evaluation compute.`}
        meta="Consumed AI credits are deducted at 100.00 BDT or $2.00 USD per credit. Approved refunds return to your original payment method within 5–7 business days."
        primaryAction={{
          label: 'Manage Orders & 1-Click Refund',
          href: '/orders',
        }}
        secondaryAction={{
          label: 'Escalate a Billing Issue',
          href: '/legal/grievance',
        }}
      />

      <div className="mb-10">
        <h2 className="text-[var(--brand-deep)] font-bold text-lg mb-4">
          1. Eligibility Windows &amp; Consumption Ceilings
        </h2>
        <WorkspaceDataTable
          columns={REFUND_COLUMNS}
          rows={REFUND_ROWS}
          caption="Product categories, statutory refund windows, consumption ceilings, and policy codes"
        />
      </div>

      <div className="divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            2. Strict Consumption Ceilings (D12 C13b)
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            In addition to initiating the request within the permitted window, the account must satisfy both consumption limits:
          </p>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            <li>
              <strong>Content Consumption Limit:</strong> Strictly less than 20% (&lt; 20%) of the total syllabus lessons, modules, and video content may be accessed or marked complete. Accessing 20% or more forfeits refund eligibility.
            </li>
            <li>
              <strong>Mock Exam Limit:</strong> At most one (&le; 1) full-length computer-based mock exam attempt may be taken. Taking two or more full mocks forfeits refund eligibility.
            </li>
          </ul>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            3. Non-Refundable Consumed AI Credits (D5)
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            AI evaluations (including IELTS Speaking acoustic grading, Deepgram STT transcription, and GRE AWA essay scoring) incur non-recoverable third-party server compute costs. Consequently, <strong>consumed AI credits are strictly non-refundable</strong>.
          </p>
          <p className="mt-3 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            When an eligible course refund is processed, the minor-unit value of all consumed AI credits is deducted from the refund payout (valued at 100.00 BDT or $2.00 USD per consumed credit). If the consumed credit value exceeds or equals the gross purchase amount, the refund request is automatically rejected.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            4. Automatic Certificate Revocation
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            Upon the approval and execution of a refund, all course completion certificates, digital diagnostic badges, and verified credential URLs associated with the refunded order are <strong>instantly and permanently revoked</strong> on the public verification ledger (<code className="font-mono text-xs">/verify/[certId]</code>).
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            5. No Cash Score Guarantees (Progress Promise)
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            {brand.name} does not offer cash refunds or cash bounties tied to official ETS or IELTS exam outcomes. Under our <strong>Mentor Tier Progress Promise</strong>, eligible students who fulfill all curriculum milestones and mock practice criteria but do not attain their target band score receive free repeat access for an additional 6 months and two (2) private diagnostic strategy sessions with a senior instructor.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            6. VAT Reversals &amp; Mushak 6.3 Credit Notes
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            Every approved domestic refund includes a statutory integer-minor reversal of the 15% Bangladesh VAT. A formal Mushak 6.3 negative credit-note receipt is recorded in the learner&apos;s billing history and reported to the National Board of Revenue (NBR) in compliance with Bangladesh tax statutes.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            7. How to Initiate a 1-Click Self-Serve Refund
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            <li>
              Log into your account and navigate to <strong>Settings &gt; Billing &amp; Orders</strong> (<code className="font-mono text-xs">/app/settings</code> or <code className="font-mono text-xs">/orders</code>).
            </li>
            <li>Locate the eligible purchase under your Order History.</li>
            <li>
              Click <strong>Request 1-Click Refund</strong>, select your reason, and confirm.
            </li>
            <li>
              The platform engine evaluates eligibility in real time and returns funds to your original payment method (bKash/card) within 5–7 business days.
            </li>
          </ol>
        </section>
      </div>
    </article>
  );
}
