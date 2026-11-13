/**
 * @purpose Legal center hub index with directory of all policy documents
 */

import React from 'react';
import Link from 'next/link';
import { brand } from '@lumen/config';
import { FileText, Lock, RefreshCw, ArrowRight } from 'lucide-react';

export default async function LegalIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const prefix = locale === 'bn' ? '/bn' : '';

  const sections = [
    {
      title: 'Terms of Service',
      description: 'Platform rules, account responsibilities, intellectual property, test practice disclaimers, and dispute resolution.',
      href: `${prefix}/legal/terms`,
      icon: FileText,
      badge: 'Updated Nov 2026',
    },
    {
      title: 'Privacy Policy & Bangladesh PDPO 2025',
      description: 'Strict minor safeguarding, parental guardian consent under 18, zero ad profiling of youth, and transparent data processing.',
      href: `${prefix}/legal/privacy`,
      icon: Lock,
      badge: 'PDPO Compliant',
    },
    {
      title: 'Refund & Cancellation Policy',
      description: '7-day guarantee, < 20% consumption ceiling, 1-mock limit, non-refundable AI credit deductions, and certificate revocations.',
      href: `${prefix}/legal/refund-policy`,
      icon: RefreshCw,
      badge: 'D12 C13b Authoritative',
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Welcome to the {brand.name} Legal Directory
        </h2>
        <p className="mt-2 text-slate-600">
          Review our binding legal frameworks, student rights, and privacy practices governing our education platform.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.href}
              href={s.href}
              className="flex flex-col justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:border-indigo-400 hover:bg-indigo-50/30 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="rounded-lg bg-indigo-100 p-2 text-indigo-700">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full bg-slate-200 px-2.5 py-0.5 text-xs font-semibold text-slate-700">
                    {s.badge}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{s.description}</p>
              </div>
              <div className="mt-6 flex items-center gap-1 text-sm font-semibold text-indigo-600">
                <span>Read document</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
