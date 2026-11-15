/** @purpose Legal & Policy Hub layout in the Claude Editorial Design Language */
import React from 'react';
import { LegalTabBar } from './_components/LegalChrome';

export default async function LegalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';

  return (
    <div className="bg-[var(--bg)] text-[var(--text-primary)]">
      <header className="bg-[var(--bg-warm)] border-b border-[var(--hairline)] py-10 md:py-14">
        <div className="max-w-[960px] mx-auto px-5 sm:px-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--brand-deep)] tracking-tight">
            {isBn
              ? 'আইনি নীতিমালা, গোপনীয়তা ও অভিযোগ প্রতিকার'
              : 'Legal, Privacy & Statutory Governance'}
          </h1>
          <p className="text-base text-[var(--text-secondary)] mt-2 max-w-[65ch]">
            {isBn
              ? 'বাংলাদেশ PDPO ২০২৫ তথ্য সুরক্ষা, ৭ দিনের রিফান্ড নিশ্চয়তা এবং বিধিবদ্ধ অভিযোগ নিষ্পত্তির প্রামাণ্য শর্তাবলি।'
              : 'Authoritative terms, Bangladesh PDPO 2025 data protections, 7-day refund guarantees, and statutory grievance resolution.'}
          </p>
          <LegalTabBar locale={locale} />
        </div>
      </header>

      <div className="max-w-[960px] mx-auto px-5 sm:px-8 py-10 md:py-14 bg-[var(--bg)]">
        {children}
      </div>
    </div>
  );
}
