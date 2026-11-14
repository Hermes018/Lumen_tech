/** @purpose Marketing shell layout mounting the 3-tier InstitutionalHeader and InstitutionalFooter */
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import {
  InstitutionalFooter,
  InstitutionalHeader,
} from '@/src/components/ui/HeaderFooter';

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const rawLocale = await getLocale();
  const locale = rawLocale === 'bn' ? 'bn' : 'en';

  return (
    <div className="marketing-shell bg-[var(--bg)] text-[var(--text)] flex min-h-screen flex-col overflow-x-hidden">
      <InstitutionalHeader locale={locale} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <InstitutionalFooter locale={locale} />
    </div>
  );
}
