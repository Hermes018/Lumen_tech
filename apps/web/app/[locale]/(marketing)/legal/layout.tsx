/**
 * @purpose Legal and policy layout with centralized navigation, compliance notices, and brand tokens
 */

import React from 'react';
import Link from 'next/link';
import { brand } from '@lumen/config';
import { ShieldCheck, FileText, RefreshCw, Lock } from 'lucide-react';

export default async function LegalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const prefix = locale === 'bn' ? '/bn' : '';

  const navLinks = [
    { href: `${prefix}/legal/terms`, label: 'Terms of Service', icon: FileText },
    { href: `${prefix}/legal/privacy`, label: 'Privacy Policy (PDPO 2025)', icon: Lock },
    { href: `${prefix}/legal/refund-policy`, label: 'Refund & Cancellation', icon: RefreshCw },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white shadow-xs">
        <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <ShieldCheck className="h-4 w-4" />
            <span>Compliance & Legal Trust Center</span>
          </div>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {brand.name} Legal & Policy Hub
          </h1>
          <p className="mt-2 text-base text-slate-600">
            Official agreements, privacy protections under Bangladesh PDPO 2025, and transparent refund standards.
          </p>
          <nav className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-xs hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Icon className="h-4 w-4 text-slate-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xs sm:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}
