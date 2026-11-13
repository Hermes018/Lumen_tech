/**
 * @purpose Privacy Policy page with full Bangladesh PDPO 2025 compliance based on docs/26-LEGAL-AND-POLICY-DRAFTS.md
 */

import React from 'react';
import { brand } from '@lumen/config';

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-slate max-w-none text-slate-800">
      <header className="border-b border-slate-200 pb-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-500">
          Compliant with Bangladesh Personal Data Protection Ordinance (PDPO) 2025 • Effective Date: November 13, 2026
        </p>
      </header>

      <section className="mt-8 space-y-6">
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-5">
          <h2 className="text-base font-bold text-indigo-950">
            Our Core Privacy Commitment
          </h2>
          <p className="mt-1 text-sm text-indigo-900">
            At {brand.name}, we believe student learning data is sacred. We do not sell personal information, we do not permit behavioral ad tracking, and we enforce strict statutory protections for minors under Bangladesh PDPO 2025.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">1. Information We Collect</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            We collect only the minimum personal data necessary to provide personalized education, algorithmic diagnostics, and authentic test simulations:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
            <li><strong>Identity & Contact:</strong> Full legal name, email address, E.164 phone number, and account credentials.</li>
            <li><strong>Diagnostic & Academic Records:</strong> Practice exam answers, timing latency per question, audio recordings for IELTS Speaking AI evaluations, and written essays for GRE AWA scoring.</li>
            <li><strong>Transactional Records:</strong> Payment gateway reference IDs, Mushak 6.3 VAT invoices, and active course entitlements (we do not store full payment card numbers; all payments are processed securely via SSLCommerz).</li>
            <li><strong>Technical Telemetry:</strong> IP address, device operating system, browser user agent, and session timestamps used solely for fraud prevention and exam proctoring integrity.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">2. Minor Safeguarding & Guardian Consent (PDPO 2025)</h2>
          <div className="rounded-xl border-l-4 border-rose-500 bg-rose-50/50 p-4 text-sm text-rose-950">
            <p className="font-bold">Statutory Protection for Minors Under 18:</p>
            <p className="mt-1">
              Under the Bangladesh Personal Data Protection Ordinance (PDPO) 2025, children under eighteen (18) years of age may only register and utilize {brand.name} with verified parental or legal guardian consent.
            </p>
            <ul className="mt-2 list-disc pl-5 space-y-1">
              <li><strong>Zero Ad Profiling:</strong> We maintain a strict prohibition against behavioral profiling, automated advertising targeting, or commercial data monetization involving learners under 18 years of age.</li>
              <li><strong>Guardian Super-Rights:</strong> Parents and guardians retain the unencumbered right to inspect, review, correct, or demand the immediate deletion of their child&apos;s personal records.</li>
            </ul>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">3. Lawful Basis & Withdrawable Consent</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            We process your data strictly on the bases of contractual necessity (delivering purchased courses), legitimate educational interest (calibrating adaptive question difficulty and generating diagnostic band estimations), and explicit informed consent.
          </p>
          <p className="mt-2 text-slate-700 leading-relaxed">
            You retain the statutory right to withdraw your consent at any time through your Account Settings or by submitting a written Data Subject Access Request (DSAR). Withdrawal of consent does not affect the lawfulness of processing conducted prior to withdrawal.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">4. Processing Subprocessors & Infrastructure</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            To ensure low-latency performance and high reliability, {brand.name} partners with specialized enterprise data processors:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
            <li><strong>Neon Serverless Postgres:</strong> Primary relational database with encrypted storage at rest (AES-256).</li>
            <li><strong>Upstash Redis:</strong> Ephemeral caching, rate-limiting, and distributed locking.</li>
            <li><strong>Deepgram:</strong> Enterprise Speech-to-Text (STT) processing for audio speech analysis; audio transcripts are not retained for model training.</li>
            <li><strong>Cloudflare R2 & Bunny Stream:</strong> Encrypted object storage and geo-distributed token-authenticated video streaming.</li>
            <li><strong>SSLCommerz:</strong> Bangladesh Bank-licensed payment processing gateway.</li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">5. Your Data Subject Rights (DSAR)</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            Under PDPO 2025, you possess comprehensive rights regarding your personal information:
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="font-semibold text-slate-900">Right to Access & Portability</span>
              <p className="mt-1 text-xs text-slate-600">Request a full machine-readable JSON export of your profile, practice history, and test telemetry.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="font-semibold text-slate-900">Right to Erasure (&quot;Be Forgotten&quot;)</span>
              <p className="mt-1 text-xs text-slate-600">Request the permanent deletion of your account and personal records, processed within 30 days.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="font-semibold text-slate-900">Right to Rectification</span>
              <p className="mt-1 text-xs text-slate-600">Correct any inaccurate or incomplete personal information directly in your profile.</p>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <span className="font-semibold text-slate-900">Right to Human Review</span>
              <p className="mt-1 text-xs text-slate-600">Request a qualified human grader re-evaluation of any AI-evaluated writing or speaking submission.</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">6. Security Safeguards & Data Retention</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            All network communication requires TLS 1.3 encryption. Sessions expire after fifteen (15) days of inactivity under platform session rules. We retain personal data for the duration of your active educational enrollment plus statutory tax periods required under Bangladesh financial legislation.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-slate-900">7. Data Protection Officer (DPO) Contact</h2>
          <p className="mt-2 text-slate-700 leading-relaxed">
            To exercise your privacy rights, submit a DSAR, or inquire about data practices at {brand.name}, contact our Data Protection Officer at <strong>privacy@lumen.academy</strong> or reach our support center at <strong>/support</strong>.
          </p>
        </div>
      </section>
    </article>
  );
}
