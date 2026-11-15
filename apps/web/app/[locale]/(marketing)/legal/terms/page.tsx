/** @purpose Terms of Service page in the Claude Editorial Design Language */
import React from 'react';
import { brand } from '@lumen/config';
import { WorkspaceFocusSheet } from '@/src/components/ui/WorkspacePrimitives';
import { LegalDocumentHeader } from '../_components/LegalChrome';

export default async function TermsOfServicePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'bn' ? 'bn' : 'en';

  return (
    <article>
      <LegalDocumentHeader
        title="Terms of Service"
        subtitle={`Binding terms governing access to ${brand.name} courses, diagnostic simulators, and Mushak 6.3 VAT-compliant transactions.`}
        metaText="Effective Date: November 13, 2026 · Last Updated: November 13, 2026"
        locale={locale}
      />

      <WorkspaceFocusSheet
        title="Independent Preparation Provider Notice"
        body={`GRE® is a registered trademark of Educational Testing Service (ETS). IELTS™ is a registered trademark of the University of Cambridge, the British Council, and IDP Education Australia. ${brand.name} is an independent test-preparation platform and is not affiliated with, approved, or endorsed by ETS, Cambridge, IDP, or the British Council.`}
        meta="All diagnostic band estimations, Rasch model scores, scaled GRE percentiles, and AI rubric evaluations represent pedagogical estimates only."
        primaryAction={{
          label: 'Review Refund Policy',
          href: '/legal/refund-policy',
        }}
        secondaryAction={{
          label: 'Contact Support',
          href: '/help',
        }}
      />

      <div className="divide-y divide-[var(--hairline)] border-t border-[var(--hairline)]">
        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">1. Acceptance of Terms</h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            By creating an account, making a purchase, or using any services provided by {brand.name} (&quot;the Platform&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;), you agree to be bound by these Terms of Service. If you are accessing our services on behalf of an educational institution, corporation, or other legal entity, you represent and warrant that you possess the full legal authority to bind that entity to these Terms.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            2. Eligibility &amp; Minor Consent (Bangladesh PDPO 2025)
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            Users must be at least 18 years of age to enter into legally binding contracts. In compliance with the Bangladesh Personal Data Protection Ordinance (PDPO) 2025, individuals under 18 years of age may only access the Platform with the verifiable consent and active supervision of a parent or legal guardian. The parent or guardian assumes full legal responsibility for all activity conducted through the minor&apos;s account.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            3. Account Security &amp; Two-Factor Authentication
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            You are responsible for maintaining the confidentiality of your login credentials. Platform staff, instructors, graders, and organization administrators are subject to mandatory Two-Factor Authentication (2FA) via Passkey or Time-Based One-Time Password (TOTP) under platform security rules. You must immediately notify us of any unauthorized use or security breach concerning your account.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            4. Educational Content &amp; Academic Integrity
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            All curriculum, video lessons, algorithmic question banks, diagnostic tools, and software code provided on {brand.name} are the proprietary intellectual property of {brand.name} and its licensors. Your subscription or course purchase grants a limited, revocable, personal, non-transferable, and non-exclusive license.
          </p>
          <p className="mt-3 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            You agree not to copy, record, decompile, scrape, reverse-engineer, redistribute, or publicly broadcast any platform materials. Automated data harvesting, bot traffic, or commercial exploitation of our content is strictly prohibited and subject to immediate account termination and legal action.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            5. Test Prep Disclaimers &amp; Estimated Scoring
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            All diagnostic band estimations, Rasch model scores, scaled GRE percentiles, and AI rubric evaluations generated by the Platform represent pedagogical estimates only. They do not constitute official test results or guarantees of admission to any academic institution.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            6. Payments, Taxes &amp; Mushak 6.3 Compliance
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            Prices for digital courses, test packs, and live cohorts are quoted in Bangladeshi Taka (BDT) for domestic customers and US Dollars (USD) for international learners. All domestic transactions processed via SSLCommerz (including bKash, Nagad, Rocket, and domestic credit cards) include the statutory 15% Bangladesh Value Added Tax (VAT) in accordance with the Value Added Tax and Supplementary Duty Act, 2012. An official Mushak 6.3 tax invoice is generated for every completed purchase.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            7. Code of Conduct &amp; Live Class Safeguarding
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            Students participating in live webinars, mentor workshops, or interactive forums must maintain courteous and professional demeanor. Harassment, hate speech, abusive language, spamming, recording without consent, or sharing inappropriate media will result in immediate expulsion from live sessions without entitlement to refund.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">8. Limitation of Liability</h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            To the maximum extent permitted by applicable law, {brand.name} and its officers, directors, and employees shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising out of your access to or inability to use the Platform. In no event shall our total aggregate liability exceed the total amount actually paid by you to {brand.name} during the three (3) months preceding the claim.
          </p>
        </section>

        <section className="py-6">
          <h2 className="text-[var(--brand-deep)] font-bold text-lg">
            9. Governing Law &amp; Dispute Resolution
          </h2>
          <p className="mt-2 text-[var(--text-primary)] leading-relaxed max-w-[72ch]">
            These Terms shall be governed by, construed, and enforced in accordance with the substantive laws of the People&apos;s Republic of Bangladesh. Any dispute, controversy, or claim arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the competent civil courts situated in Dhaka, Bangladesh.
          </p>
        </section>
      </div>
    </article>
  );
}
