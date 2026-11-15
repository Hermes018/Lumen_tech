/** @purpose Privacy Policy page (Bangladesh PDPO 2025) in the Claude Editorial Design Language */
import React from 'react';
import { brand } from '@lumen/config';
import {
  WorkspaceDataTable,
  WorkspaceFocusSheet,
  type WorkspaceTableColumn,
  type WorkspaceTableRow,
} from '@/src/components/ui/WorkspacePrimitives';
import { LegalDocumentHeader } from '../_components/LegalChrome';

const DATA_COLUMNS: WorkspaceTableColumn[] = [
  { key: 'category', header: 'Data Category' },
  { key: 'purpose', header: 'Purpose of Processing' },
  { key: 'basis', header: 'PDPO 2025 Lawful Basis' },
  { key: 'retention', header: 'Retention & Erasure Rule' },
];

const DATA_ROWS: WorkspaceTableRow[] = [
  {
    id: 'identity',
    rowHeader: 'Identity & Contact',
    rowSubheader: 'Legal name, email, E.164 phone',
    cells: {
      purpose: 'Account provisioning, 2FA security alerts, and guardian consent verification.',
      basis: 'Contractual Necessity & Explicit Consent',
      retention: 'Active enrollment + 30-day DSAR erasure SLA upon request',
    },
  },
  {
    id: 'academic',
    rowHeader: 'Diagnostic & Academic Records',
    rowSubheader: 'Exam answers, speaking audio, essays',
    cells: {
      purpose: 'Adaptive difficulty calibration, Rasch scoring, and AI/human rubric grading.',
      basis: 'Legitimate Educational Interest & Consent',
      retention: 'Retained for active study plan; anonymized or purged on erasure',
    },
  },
  {
    id: 'transactional',
    rowHeader: 'Transactional & Tax Records',
    rowSubheader: 'SSLCommerz IDs, Mushak 6.3 VAT invoices',
    cells: {
      purpose: 'Order fulfillment, 1-click refund verification, and NBR VAT reporting.',
      basis: 'Statutory Tax Obligation (VAT Act 2012)',
      retention: 'Statutory tax retention period (no raw card numbers stored)',
    },
  },
  {
    id: 'telemetry',
    rowHeader: 'Security & Proctoring Telemetry',
    rowSubheader: 'IP address, OS, session timestamps',
    cells: {
      purpose: 'Fraud prevention, rate limiting, and exam attempt integrity.',
      basis: 'Legitimate Security Interest',
      retention: 'Rolling 90-day security log rotation; 15-day session expiry',
    },
  },
];

export default async function PrivacyPolicyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'bn' ? 'bn' : 'en';

  return (
    <article>
      <LegalDocumentHeader
        title="Privacy Policy"
        subtitle="Compliant with the Bangladesh Personal Data Protection Ordinance (PDPO) 2025, enforcing strict minor safeguarding and zero ad profiling."
        metaText="Effective Date: November 13, 2026 · PDPO 2025 Standard"
        locale={locale}
      />

      <WorkspaceFocusSheet
        title="Our Core Privacy & Minor Safeguarding Commitment"
        body={`At ${brand.name}, student learning data is sacred. We never sell personal information, we strictly prohibit behavioral ad profiling, and learners under 18 may only register with verifiable parental or legal guardian consent under Bangladesh PDPO 2025.`}
        meta="Parents and guardians retain the unencumbered right to inspect, correct, or demand immediate deletion of a minor's records."
        primaryAction={{
          label: 'Contact Grievance & Data Officer',
          href: '/legal/grievance',
        }}
        secondaryAction={{
          label: 'View Terms of Service',
          href: '/legal/terms',
        }}
      />

      <div className="mb-10">
        <h2 className="text-[var(--brand-deep)] font-bold text-lg mb-4">
          1. Data Categories, Lawful Basis &amp; Retention Schedule
        </h2>
        <WorkspaceDataTable
          columns={DATA_COLUMNS}
          rows={DATA_ROWS}
          caption="PDPO 2025 data categories, processing purpose, lawful basis, and retention schedule"
        />
      </div>

      <div className="divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            2. Minor Safeguarding &amp; Guardian Consent (PDPO 2025)
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            Under the Bangladesh Personal Data Protection Ordinance (PDPO) 2025, children under eighteen (18) years of age may only register and utilize {brand.name} with verified parental or legal guardian consent. We maintain a strict prohibition against behavioral profiling, automated advertising targeting, or commercial data monetization involving learners under 18 years of age.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            3. Lawful Basis &amp; Withdrawable Consent
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            We process your data strictly on the bases of contractual necessity (delivering purchased courses), legitimate educational interest (calibrating adaptive question difficulty and generating diagnostic band estimations), and explicit informed consent.
          </p>
          <p className="mt-3 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            You retain the statutory right to withdraw your consent at any time through your Account Settings or by submitting a written Data Subject Access Request (DSAR). Withdrawal of consent does not affect the lawfulness of processing conducted prior to withdrawal.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            4. Processing Subprocessors &amp; Infrastructure
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            <li>
              <strong>Neon Serverless Postgres:</strong> Primary relational database with encrypted storage at rest (AES-256).
            </li>
            <li>
              <strong>Upstash Redis:</strong> Ephemeral caching, rate-limiting, and distributed locking.
            </li>
            <li>
              <strong>Deepgram:</strong> Enterprise Speech-to-Text (STT) processing for audio speech analysis; audio transcripts are not retained for model training.
            </li>
            <li>
              <strong>Cloudflare R2 &amp; Bunny Stream:</strong> Encrypted object storage and geo-distributed token-authenticated video streaming.
            </li>
            <li>
              <strong>SSLCommerz:</strong> Bangladesh Bank-licensed payment processing gateway.
            </li>
          </ul>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            5. Your Data Subject Rights (DSAR)
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            <li>
              <strong>Right to Access &amp; Portability:</strong> Request a machine-readable JSON export of your profile, practice history, and test telemetry.
            </li>
            <li>
              <strong>Right to Erasure (&quot;Be Forgotten&quot;):</strong> Request permanent deletion of your account and personal records, processed within 30 days.
            </li>
            <li>
              <strong>Right to Rectification:</strong> Correct any inaccurate or incomplete personal information directly in your profile.
            </li>
            <li>
              <strong>Right to Human Review:</strong> Request a qualified human grader re-evaluation of any AI-evaluated writing or speaking submission.
            </li>
          </ul>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            6. Security Safeguards &amp; Data Protection Officer (DPO)
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            All network communication requires TLS 1.3 encryption, and sessions expire after fifteen (15) days of inactivity. To exercise your privacy rights or submit a DSAR, contact our Data Protection Officer at{' '}
            <strong>privacy@lumen.academy</strong> or via the Help Center.
          </p>
        </section>
      </div>
    </article>
  );
}
