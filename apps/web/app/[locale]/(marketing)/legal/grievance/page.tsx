/** @purpose Grievance Officer and Dispute Resolution page in the Claude Editorial Design Language */
import React from 'react';
import { brand } from '@lumen/config';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import {
  WorkspaceDataTable,
  WorkspaceFocusSheet,
  type WorkspaceTableColumn,
  type WorkspaceTableRow,
} from '@/src/components/ui/WorkspacePrimitives';
import { LegalDocumentHeader } from '../_components/LegalChrome';

export const metadata = {
  title: `Grievance Officer & Dispute Resolution | ${brand.name}`,
  description: `Official statutory Grievance Redressal and Dispute Resolution framework for ${brand.name} in compliance with Bangladesh Digital Commerce Operation Guidelines and PDPO 2025.`,
};

const ESCALATION_COLUMNS: WorkspaceTableColumn[] = [
  { key: 'tier', header: 'Escalation Tier' },
  { key: 'scope', header: 'Scope of Dispute' },
  { key: 'officer', header: 'Responsible Officer' },
  { key: 'sla', header: 'Binding SLA Target' },
];

const ESCALATION_ROWS: WorkspaceTableRow[] = [
  {
    id: 'tier-1',
    rowHeader: 'Tier 1: Frontline Support',
    cells: {
      scope: 'Account access, video stream buffering, coupon redemptions, and mock test resumption requests.',
      officer: 'Learner Support Desk',
      sla: 'Within 4 Business Hours',
    },
  },
  {
    id: 'tier-2',
    rowHeader: 'Tier 2: Grievance Officer',
    cells: {
      scope: 'bKash/Nagad double debits, SSLCommerz gateway timeouts, and refund eligibility appeals under our 7-day policy.',
      officer: 'Compliance & Grievance Redressal Officer',
      sla: 'Within 24 Business Hours',
    },
  },
  {
    id: 'tier-3',
    rowHeader: 'Tier 3: Executive Review',
    cells: {
      scope: 'PDPO 2025 data deletion mandates, institutional contract disagreements, and unresolved consumer appeals.',
      officer: 'Executive Trust & Legal Committee',
      sla: 'Final Verdict Within 72 Hours',
    },
  },
];

export default async function GrievanceOfficerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'bn' ? 'bn' : 'en';

  return (
    <article>
      <LegalDocumentHeader
        title="Grievance Officer & Dispute Resolution"
        subtitle="In compliance with the Bangladesh Digital Commerce Operation Guidelines (2021/2023) and Personal Data Protection Ordinance (PDPO) 2025."
        metaText="Effective Date: November 13, 2026 · Statutory Redressal Standard"
        locale={locale}
      />

      <WorkspaceFocusSheet
        title="Designated Grievance Redressal Officer"
        body={`Pursuant to national regulations governing digital commerce, consumer protection, and personal data privacy in Bangladesh, ${brand.name} has appointed a Compliance & Grievance Redressal Officer (Legal, Trust & Consumer Safeguards Division) to address learner grievances, billing discrepancies, access interruptions, and data rights requests.`}
        meta={`Direct Contact: ${brand.supportEmail} · Subject Prefix: "[GRIEVANCE ESCALATION]"`}
        primaryAction={{
          label: 'Open Help Center',
          href: '/help',
        }}
        secondaryAction={{
          label: 'Review Refund Policy',
          href: '/legal/refund-policy',
        }}
      />

      <div className="mb-10">
        <h2 className="text-[var(--brand-deep)] font-bold text-lg mb-4">
          1. Three-Tier Escalation &amp; Response SLA Matrix
        </h2>
        <WorkspaceDataTable
          columns={ESCALATION_COLUMNS}
          rows={ESCALATION_ROWS}
          caption="Three-tier dispute escalation matrix with responsible officers and binding SLA targets"
        />
      </div>

      <div className="divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            2. How to File a Formal Grievance
          </h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            <li>
              <strong>First Contact:</strong> Submit a ticket through our{' '}
              <LocaleLink
                locale={locale}
                href="/help"
                className="font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
              >
                {brand.name} Help Center
              </LocaleLink>{' '}
              with your registered account email and order or attempt ID.
            </li>
            <li>
              <strong>Escalation:</strong> If your inquiry is unresolved after 24 hours, email{' '}
              <a
                href={`mailto:${brand.supportEmail}`}
                className="font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
              >
                {brand.supportEmail}
              </a>{' '}
              with the subject line &ldquo;[GRIEVANCE ESCALATION] - Ticket #[ID]&rdquo;.
            </li>
            <li>
              <strong>Documentation:</strong> Attach transaction SMS screenshots (for bKash/Nagad transactions) or bank transaction reference numbers.
            </li>
            <li>
              <strong>Resolution &amp; Appeals:</strong> You will receive a written investigation report and determination. If unsatisfied, you may request review by executive leadership under Tier 3.
            </li>
          </ol>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            3. Statutory Consumer &amp; Data Protection Rights
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            Nothing in this policy limits your statutory rights under the Consumers&apos; Right Protection Act, 2009 or the Bangladesh Personal Data Protection Ordinance (PDPO) 2025. All grievance logs are retained in our audit trail for statutory inspection.
          </p>
        </section>
      </div>
    </article>
  );
}
