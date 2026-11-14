/** @purpose Grievance Officer and Dispute Resolution policy per Bangladesh Digital Commerce Guidelines & PDPO 2025 */
import React from 'react';
import Link from 'next/link';
import { brand } from '@lumen/config';
import { ShieldCheck, Mail, Clock, AlertCircle, FileCheck2, ArrowRight } from 'lucide-react';

export const metadata = {
  title: `Grievance Officer & Dispute Resolution | ${brand.name}`,
  description: `Official statutory Grievance Redressal and Dispute Resolution framework for ${brand.name} in compliance with Bangladesh Digital Commerce Operation Guidelines and PDPO 2025.`,
};

export default function GrievanceOfficerPage() {
  return (
    <article className="prose prose-slate max-w-none text-slate-800">
      <header className="border-b border-slate-200 pb-6">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
          <ShieldCheck className="h-4 w-4" />
          <span>Statutory Compliance Notice</span>
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Grievance Officer & Dispute Resolution
        </h1>
        <p className="text-sm text-slate-500">
          In compliance with the Bangladesh Digital Commerce Operation Guidelines (2021/2023) and Personal Data Protection Ordinance (PDPO) 2025.
        </p>
      </header>

      {/* Designated Grievance Officer Card */}
      <section className="mt-8 rounded-xl border border-indigo-200 bg-indigo-50/60 p-6 not-prose space-y-4">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-indigo-600" />
          Designated Grievance Redressal Officer
        </h2>
        <p className="text-sm text-slate-700 leading-relaxed">
          Pursuant to national regulations governing digital commerce, consumer protection, and personal data privacy in Bangladesh, {brand.name} has appointed a designated officer to address learner grievances, billing discrepancies, access interruptions, and data rights requests.
        </p>

        <div className="grid gap-4 sm:grid-cols-2 pt-2 text-sm">
          <div className="rounded-lg bg-white p-4 border border-indigo-100 shadow-2xs space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Officer Designation</div>
            <div className="font-bold text-slate-900">Compliance & Grievance Redressal Officer</div>
            <div className="text-xs text-slate-600">Legal, Trust & Consumer Safeguards Division</div>
          </div>

          <div className="rounded-lg bg-white p-4 border border-indigo-100 shadow-2xs space-y-1">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-500">Direct Contact Channel</div>
            <div className="font-bold text-slate-900 flex items-center gap-1.5">
              <Mail className="h-4 w-4 text-indigo-600" />
              <a href={`mailto:${brand.supportEmail}`} className="text-indigo-600 hover:underline">
                {brand.supportEmail}
              </a>
            </div>
            <div className="text-xs text-slate-600">Subject Prefix: &ldquo;[GRIEVANCE ESCALATION]&rdquo;</div>
          </div>
        </div>
      </section>

      {/* Escalation Tiers & Response SLAs */}
      <section className="mt-10 space-y-6">
        <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          Escalation Tiers & Response SLAs
        </h2>
        <p className="text-slate-700 leading-relaxed text-sm">
          We maintain a structured three-tier dispute resolution mechanism to ensure every ticket receives rigorous, auditable attention:
        </p>

        <div className="grid gap-4 sm:grid-cols-3 not-prose">
          {/* Tier 1 */}
          <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-2">
            <div className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-bold text-slate-700">
              Tier 1: Frontline Support
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Standard Inquiries & Tech Issues</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Account access, video stream buffering, coupon redemptions, and mock test resumption requests.
            </p>
            <div className="pt-2 text-xs font-semibold text-indigo-600 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> SLA: Within 4 Business Hours
            </div>
          </div>

          {/* Tier 2 */}
          <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-5 shadow-xs space-y-2">
            <div className="inline-block rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-800">
              Tier 2: Grievance Officer
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Payment & Refund Escalations</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              bKash/Nagad double debits, SSLCommerz gateway timeouts, and refund eligibility appeals under our 7-day policy.
            </p>
            <div className="pt-2 text-xs font-semibold text-amber-700 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> SLA: Within 24 Business Hours
            </div>
          </div>

          {/* Tier 3 */}
          <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-5 shadow-xs space-y-2">
            <div className="inline-block rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-bold text-rose-800">
              Tier 3: Executive Review
            </div>
            <h3 className="font-bold text-slate-900 text-sm">PDPO Rights & Formal Disputes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Data deletion mandates, institutional contract disagreements, and unresolved consumer appeals.
            </p>
            <div className="pt-2 text-xs font-semibold text-rose-700 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" /> SLA: Final Verdict Within 72 Hours
            </div>
          </div>
        </div>
      </section>

      {/* Filing Procedure */}
      <section className="mt-10 space-y-4">
        <h2 className="text-xl font-bold text-slate-900">How to File a Formal Grievance</h2>
        <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700 leading-relaxed">
          <li>
            <strong>First Contact:</strong> Submit a ticket through our Help Center at{' '}
            <Link href="/help" className="text-indigo-600 font-semibold hover:underline">
              {brand.name} Help Center
            </Link>{' '}
            with your registered account email and order/attempt ID.
          </li>
          <li>
            <strong>Escalation:</strong> If your inquiry is unresolved after 24 hours, email{' '}
            <a href={`mailto:${brand.supportEmail}`} className="text-indigo-600 hover:underline">
              {brand.supportEmail}
            </a>{' '}
            with the subject line &ldquo;[GRIEVANCE ESCALATION] - Ticket #[ID]&rdquo;.
          </li>
          <li>
            <strong>Documentation:</strong> Attach transaction SMS screenshots (for bKash/Nagad transactions) or bank transaction reference numbers.
          </li>
          <li>
            <strong>Resolution & Appeals:</strong> You will receive a written investigation report and determination. If unsatisfied, you may request review by executive leadership.
          </li>
        </ol>
      </section>

      {/* Direct Link to Help Center Banner */}
      <section className="mt-10 rounded-xl border border-slate-200 bg-white p-6 not-prose flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="space-y-1 text-center sm:text-left">
          <h3 className="font-bold text-slate-900">Need Immediate Assistance?</h3>
          <p className="text-xs text-slate-600">
            Search our knowledge base, submit a ticket, or chat directly with support.
          </p>
        </div>
        <Link
          href="/help"
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-indigo-700 transition-colors shrink-0"
        >
          <span>Visit Help & Support Center</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    </article>
  );
}
