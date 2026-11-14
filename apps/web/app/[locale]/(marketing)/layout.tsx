/** @purpose Marketing shell layout with frosted navbar, LocaleSwitcher, and translated chrome */
import type { ReactNode } from 'react';
import { brand } from '@lumen/config';
import { Button } from '@lumen/ui';
import { GraduationCap } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/routing';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

export default async function MarketingLayout({ children }: { children: ReactNode }) {
  const tCommon = await getTranslations('common');
  const tFooter = await getTranslations('footer');

  return (
    <div className="marketing-shell bg-canvas text-fg flex min-h-screen flex-col">
      {/* Skip to main content link for accessibility */}
      <a
        href="#main-content"
        className="focus:bg-accent focus:text-accent-fg sr-only shadow-md focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
      >
        Skip to main content
      </a>

      {/* Sticky Frosted Translucent Navbar */}
      <header className="border-border bg-surface/80 sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight">
              <span className="bg-accent text-accent-fg flex h-8 w-8 items-center justify-center rounded-lg">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span>{brand.name}</span>
            </Link>
            <nav className="text-fg-muted hidden items-center gap-6 text-sm font-medium md:flex">
              <Link href="/courses" className="hover:text-fg transition-colors">
                {tCommon('courses')}
              </Link>
              <Link href="/gre" className="hover:text-fg transition-colors">
                {tCommon('grePrep')}
              </Link>
              <Link href="/ielts" className="hover:text-fg transition-colors">
                {tCommon('ieltsPrep')}
              </Link>
              <Link href="/pricing" className="hover:text-fg transition-colors">
                {tCommon('pricing')}
              </Link>
              <Link href="/exam/diagnostic" className="hover:text-fg transition-colors">
                {tCommon('diagnostic')}
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Interactive EN / বাংলা Language Switcher */}
            <LocaleSwitcher />

            {/* Auth Actions */}
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                {tCommon('signIn')}
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="primary" size="sm">
                {tCommon('getStarted')}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main id="main-content" className="flex-1">
        {children}
      </main>

      {/* Marketing Footer */}
      <footer className="border-border bg-surface text-fg-muted border-t">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <h3 className="text-fg text-xs font-semibold tracking-wider uppercase">
                {tFooter('curriculum')}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/gre" className="hover:text-fg transition-colors">
                    {tFooter('greCbt')}
                  </Link>
                </li>
                <li>
                  <Link href="/ielts" className="hover:text-fg transition-colors">
                    {tFooter('ieltsAg')}
                  </Link>
                </li>
                <li>
                  <Link href="/gre#vocab" className="hover:text-fg transition-colors">
                    {tFooter('fsrsVocab')}
                  </Link>
                </li>
                <li>
                  <Link href="/exam/diagnostic" className="hover:text-fg transition-colors">
                    {tFooter('freeDiag')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-fg text-xs font-semibold tracking-wider uppercase">
                {tFooter('platform')}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/pricing" className="hover:text-fg transition-colors">
                    {tFooter('pricingPlans')}
                  </Link>
                </li>
                <li>
                  <Link href="/gre#pedagogy" className="hover:text-fg transition-colors">
                    {tFooter('pedagogy')}
                  </Link>
                </li>
                <li>
                  <Link href="/for-institutions" className="hover:text-fg transition-colors">
                    {tFooter('forInstitutions')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-fg text-xs font-semibold tracking-wider uppercase">
                {tFooter('legal')}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/legal/terms" className="hover:text-fg transition-colors">
                    {tFooter('terms')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-fg transition-colors">
                    {tFooter('privacy')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/refund-policy" className="hover:text-fg transition-colors">
                    {tFooter('refundPolicy')}
                  </Link>
                </li>
                <li>
                  <Link href="/legal/grievance" className="hover:text-fg transition-colors">
                    {tFooter('grievance')}
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-fg text-xs font-semibold tracking-wider uppercase">
                {tFooter('connect')}
              </h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <span className="block">{tFooter('dhaka')}</span>
                </li>
                <li>
                  <a
                    href={`mailto:${brand.supportEmail}`}
                    className="hover:text-fg transition-colors"
                  >
                    {brand.supportEmail}
                  </a>
                </li>
                <li>
                  <span className="text-fg-subtle text-xs">
                    {tFooter('paymentMethods')}
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Trademark Disclaimer & Legal Mandatory Notice */}
          <div className="border-border text-fg-subtle mt-8 border-t pt-8 text-xs leading-relaxed">
            <p className="mb-2">
              {tFooter('disclaimerP1')}
            </p>
            <p className="mb-4">
              {tFooter('disclaimerP2', { appName: brand.name })}
            </p>
            <p>
              {tFooter('copyright', { appName: brand.name })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
