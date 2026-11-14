'use client';

/** @purpose Interactive EN / বাংলা language switcher with NEXT_LOCALE cookie persistence (BUG-05) */
import React, { Suspense, useState } from 'react';
import { useLocale } from 'next-intl';
import { usePathname, useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';
import { withLocale } from './LocaleLink';

function LocaleSwitcherInner({ className = '' }: { className?: string }) {
  const locale = useLocale();
  const pathname = usePathname() || '/';
  const searchParams = useSearchParams();
  const [isPending, setIsPending] = useState(false);

  const switchLocale = (targetLocale: 'en' | 'bn') => {
    if (targetLocale === locale || isPending) return;
    setIsPending(true);

    // 1. Calculate target pathname preserving sub-routes (e.g. /sign-in, /exam/diagnostic, /courses)
    const targetPath = withLocale(targetLocale, pathname);

    // Preserve query parameters (e.g. ?plan=gre-core)
    const queryString = searchParams?.toString();
    const finalUrl = queryString ? `${targetPath}?${queryString}` : targetPath;

    // 2. Persist NEXT_LOCALE cookie for next-intl routing
    document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; SameSite=Lax`;

    // 3. Full navigation guarantees server components & middleware receive the updated cookie on every route
    window.location.assign(finalUrl);
  };

  return (
    <div
      className={`border-border bg-surface-2/60 text-fg-muted flex items-center gap-1 rounded-lg border p-1 text-xs font-medium backdrop-blur-xs transition-colors ${className}`}
      role="region"
      aria-label="Language selector"
    >
      <Globe className="text-fg-muted ml-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <button
        type="button"
        onClick={() => switchLocale('en')}
        disabled={isPending}
        className={`cursor-pointer rounded-md px-2 py-0.5 text-xs transition-all ${
          locale === 'en'
            ? 'bg-surface text-fg font-bold shadow-xs ring-1 ring-border/50'
            : 'text-fg-muted hover:text-fg hover:bg-surface/50'
        }`}
        aria-current={locale === 'en' ? 'true' : undefined}
        aria-label="Switch to English"
      >
        EN
      </button>
      <span className="text-border text-[10px] select-none" aria-hidden="true">
        /
      </span>
      <button
        type="button"
        onClick={() => switchLocale('bn')}
        disabled={isPending}
        className={`cursor-pointer rounded-md px-2 py-0.5 text-xs font-bengali transition-all ${
          locale === 'bn'
            ? 'bg-surface text-fg font-bold shadow-xs ring-1 ring-border/50'
            : 'text-fg-muted hover:text-fg hover:bg-surface/50'
        }`}
        aria-current={locale === 'bn' ? 'true' : undefined}
        aria-label="বাংলা ভাষায় পরিবর্তন করুন"
      >
        বাংলা
      </button>
    </div>
  );
}

function LocaleSwitcherSkeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`border-border bg-surface-2/40 text-fg-muted flex h-7 items-center gap-1 rounded-lg border px-2 py-1 text-xs ${className}`}
    >
      <Globe className="h-3.5 w-3.5 opacity-40" />
      <span className="px-1 text-[11px] opacity-40">EN / বাংলা</span>
    </div>
  );
}

export function LocaleSwitcher({ className = '' }: { className?: string }) {
  return (
    <Suspense fallback={<LocaleSwitcherSkeleton className={className} />}>
      <LocaleSwitcherInner className={className} />
    </Suspense>
  );
}
