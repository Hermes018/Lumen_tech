/** @purpose Marketing shell layout with frosted navbar and trademark disclaimer */
import type { ReactNode } from 'react';
import Link from 'next/link';
import { brand } from '@lumen/config';
import { Button } from '@lumen/ui';
import { Globe, GraduationCap } from 'lucide-react';

export default function MarketingLayout({ children }: { children: ReactNode }) {
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
                Courses
              </Link>
              <Link href="/gre" className="hover:text-fg transition-colors">
                GRE Prep
              </Link>
              <Link href="/ielts" className="hover:text-fg transition-colors">
                IELTS Prep
              </Link>
              <Link href="/pricing" className="hover:text-fg transition-colors">
                Pricing
              </Link>
              <Link href="/exam/diagnostic" className="hover:text-fg transition-colors">
                Free Diagnostic
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {/* Locale Switcher Stub */}
            <div className="border-control text-fg-muted hidden items-center gap-1 rounded-md border px-2 py-1 text-xs font-medium sm:flex">
              <Globe className="h-3.5 w-3.5" />
              <button type="button" className="text-fg font-semibold hover:underline">
                EN
              </button>
              <span>/</span>
              <button type="button" className="hover:text-fg hover:underline">
                বাংলা
              </button>
            </div>

            {/* Auth Actions */}
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="primary" size="sm">
                Get Started
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
              <h3 className="text-fg text-xs font-semibold tracking-wider uppercase">Curriculum</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/gre" className="hover:text-fg transition-colors">
                    GRE Prep (Adaptive CBT)
                  </Link>
                </li>
                <li>
                  <Link href="/ielts" className="hover:text-fg transition-colors">
                    IELTS Academic & General
                  </Link>
                </li>
                <li>
                  <Link href="/gre#vocab" className="hover:text-fg transition-colors">
                    FSRS Vocab Engine
                  </Link>
                </li>
                <li>
                  <Link href="/exam/diagnostic" className="hover:text-fg transition-colors">
                    Free Diagnostic Test
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-fg text-xs font-semibold tracking-wider uppercase">Platform</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/pricing" className="hover:text-fg transition-colors">
                    Pricing & Plans
                  </Link>
                </li>
                <li>
                  <Link href="/gre#pedagogy" className="hover:text-fg transition-colors">
                    Interactive Pedagogy
                  </Link>
                </li>
                <li>
                  <Link href="/for-institutions" className="hover:text-fg transition-colors">
                    For Universities & Schools
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-fg text-xs font-semibold tracking-wider uppercase">Legal</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <Link href="/legal/terms" className="hover:text-fg transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/legal/privacy" className="hover:text-fg transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/refund-policy" className="hover:text-fg transition-colors">
                    Refund Policy
                  </Link>
                </li>
                <li>
                  <Link href="/legal/grievance" className="hover:text-fg transition-colors">
                    Grievance Officer
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-fg text-xs font-semibold tracking-wider uppercase">Connect</h3>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <span className="block">Dhaka, Bangladesh</span>
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
                    bKash, Nagad, Cards & Global Checkout
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Trademark Disclaimer & Legal Mandatory Notice */}
          <div className="border-border text-fg-subtle mt-8 border-t pt-8 text-xs leading-relaxed">
            <p className="mb-2">
              GRE® is a registered trademark of Educational Testing Service (ETS). IELTS® is a
              registered trademark of Cambridge Assessment English, the British Council, and IDP
              Education.
            </p>
            <p className="mb-4">
              {brand.name} is an independent preparation service and is not affiliated with,
              approved, or endorsed by ETS, Cambridge Assessment English, the British Council, or
              IDP Education. All score benchmarks and percentiles are estimated diagnostic
              indicators.
            </p>
            <p>
              © 2026 {brand.name}. Built for high-ambition Bangladeshi & international scholars.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
