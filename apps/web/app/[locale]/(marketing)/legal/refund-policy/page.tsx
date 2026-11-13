/**
 * @purpose Refund and Cancellation Policy page enforcing exact D12 C13b and D5 rules
 */

import React from 'react';
import { brand } from '@lumen/config';

export default function RefundPolicyPage() {
  return (
    <article className="prose prose-slate max-w-none text-slate-800">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Refund & Cancellation Policy
        </h1>
        <p className="text-sm text-slate-500">
          Official Authoritative Policy • Governed by 00-DECISIONS.md D5 & D12 C13b • Effective Date: November 13, 2026
        </p>
      </header>

      <section className="mt-8 space-y-6">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <h2 className="text-base font-bold text-indigo-950">
            Our Transparent Refund Guarantee
          </h2>
          <p className="mt-1 text-sm text-indigo-900 leading-relaxed">
            {brand.name} provides an honest, automated, self-serve refund policy designed to protect serious students while preventing bad-faith exploitation of digital educational intellectual property and computationally expensive AI evaluation models.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">1. Eligibility Windows</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            To qualify for a refund, your request must be initiated within the applicable product time window:
          </p>
          <div className="mt-3 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 font-semibold text-slate-900">Product Category</th>
                  <th className="px-4 py-3 font-semibold text-slate-900">Refund Window</th>
                  <th className="px-4 py-3 font-semibold text-slate-900">Policy Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Comprehensive Courses & Bundles</td>
                  <td className="px-4 py-3 text-slate-600">7 calendar days from transaction time</td>
                  <td className="px-4 py-3 text-xs font-mono text-indigo-600">standard_7d</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">1-Month Short Passes</td>
                  <td className="px-4 py-3 text-slate-600">72 hours (3 calendar days)</td>
                  <td className="px-4 py-3 text-xs font-mono text-indigo-600">pass_1m_72h</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Live Cohort Batches (Zoom)</td>
                  <td className="px-4 py-3 text-slate-600">Prior to the start of Class 3</td>
                  <td className="px-4 py-3 text-xs font-mono text-indigo-600">before_class_3</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Express Crash Courses</td>
                  <td className="px-4 py-3 text-slate-600">Prior to the start of Class 2</td>
                  <td className="px-4 py-3 text-xs font-mono text-indigo-600">before_class_2</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-slate-900">Standalone AI Credit Packs</td>
                  <td className="px-4 py-3 text-slate-600">7 calendar days (unconsumed credits only)</td>
                  <td className="px-4 py-3 text-xs font-mono text-indigo-600">standalone_credits</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">2. Strict Consumption Ceilings (D12 C13b)</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            In addition to initiating the request within the permitted window, the account must satisfy both consumption limits:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-700">
            <li>
              <strong>Content Consumption Limit:</strong> Strictly less than 20% (&lt; 20%) of the total syllabus lessons, modules, and video content may be accessed or marked complete. Accessing 20% or more forfeits refund eligibility.
            </li>
            <li>
              <strong>Mock Exam Limit:</strong> At most one (&le; 1) full-length computer-based mock exam attempt may be taken. Taking two or more full mocks forfeits refund eligibility.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">3. Non-Refundable Consumed AI Credits (D5)</h2>
          <div className="rounded-xl border-l-4 border-amber-500 bg-amber-50/50 p-4 text-sm text-amber-950 leading-relaxed">
            <p className="font-bold">Authoritative Rule on Consumed Computational Credits:</p>
            <p className="mt-1">
              AI evaluations (including IELTS Speaking acoustic grading, Deepgram STT transcription, and GRE AWA essay scoring) incur non-recoverable third-party server compute costs. Consequently, <strong>consumed AI credits are strictly non-refundable</strong>.
            </p>
            <p className="mt-2">
              When an eligible course refund is processed, the minor-unit value of all consumed AI credits is deducted from the refund payout (valued at 100.00 BDT or $2.00 USD per consumed credit). If the consumed credit value exceeds or equals the gross purchase amount, the refund request is automatically rejected.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">4. Automatic Certificate Revocation</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Upon the approval and execution of a refund, all course completion certificates, digital diagnostic badges, and verified credential URLs associated with the refunded order are <strong>instantly and permanently revoked</strong> on the public verification ledger (<code className="rounded bg-slate-100 px-1 text-xs">/verify/[certId]</code>). Any subsequent third-party or university verification request will report the certificate as invalid.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">5. No Cash Score Guarantees (Progress Promise)</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            {brand.name} does not offer cash refunds or cash bounties tied to official ETS or IELTS exam band outcomes. Under our <strong>Mentor Tier Progress Promise</strong>, eligible students who fulfill all curriculum milestones and mock practice criteria but do not attain their target band score receive:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
            <li>Free repeat access to the course platform for an additional 6 months.</li>
            <li>Two (2) private diagnostic strategy sessions with a certified senior instructor.</li>
          </ul>
          <p className="mt-2 text-slate-700">
            The Progress Promise provides academic remediation and continued instructional support, not cash score payouts.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">6. VAT Reversals & Mushak 6.3 Credit Notes</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Every approved domestic refund includes a statutory integer-minor reversal of the 15% Bangladesh VAT. A formal Mushak 6.3 negative credit-note receipt is recorded in the learner&apos;s billing history and reported to the National Board of Revenue (NBR) in compliance with Bangladesh tax statutes.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">7. How to Initiate a 1-Click Self-Serve Refund</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Learners can initiate an automated refund evaluation at any time without emailing customer support:
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-700">
            <li>Log into your account and navigate to <strong>Settings &gt; Billing &amp; Orders</strong> (<code className="rounded bg-slate-100 px-1 text-xs">/app/settings</code> or <code className="rounded bg-slate-100 px-1 text-xs">/orders</code>).</li>
            <li>Locate the eligible purchase under your Order History.</li>
            <li>Click <strong>Request 1-Click Refund</strong>, select your reason, and confirm.</li>
            <li>The platform engine will evaluate your eligibility in real time and return funds to your original payment method (bKash/card) within 5–7 business days.</li>
          </ol>
        </div>
      </section>
    </article>
  );
}
