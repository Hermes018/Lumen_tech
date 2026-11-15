/** @purpose Closed vocabulary of 17 institutional UI primitives for marketing pages */
'use client';

import React, { useId, useState, type ReactNode } from 'react';
import {
  Banknote,
  Calendar,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
} from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { MEDIA_SLOTS, type MediaSlotId } from '@/src/content/media';

/* 1. LumenSparkMotif */
export interface LumenSparkMotifProps {
  inverse?: boolean;
}

export function LumenSparkMotif({ inverse = false }: LumenSparkMotifProps) {
  return (
    <svg
      width="28"
      height="16"
      viewBox="0 0 28 16"
      fill="none"
      aria-hidden="true"
      className="mb-3 block shrink-0"
    >
      <line
        x1="2"
        y1="14"
        x2="10"
        y2="2"
        stroke={inverse ? 'var(--accent)' : 'var(--brand)'}
        strokeWidth="3"
        strokeLinecap="square"
      />
      <line
        x1="14"
        y1="14"
        x2="14"
        y2="1"
        stroke="var(--accent)"
        strokeWidth="3"
        strokeLinecap="square"
      />
      <line
        x1="26"
        y1="14"
        x2="18"
        y2="2"
        stroke={inverse ? 'currentColor' : 'var(--brand)'}
        strokeWidth="3"
        strokeLinecap="square"
      />
    </svg>
  );
}

/* 2. Section */
export interface SectionProps {
  tone?: 'white' | 'tint' | 'warm' | 'brand';
  id?: string;
  children: ReactNode;
}

const SECTION_TONE_CLASSES: Record<NonNullable<SectionProps['tone']>, string> = {
  white: 'bg-[var(--bg)] text-[var(--text)]',
  tint: 'bg-[var(--bg-tint)] text-[var(--text)]',
  warm: 'bg-[var(--bg-warm)] text-[var(--text)]',
  brand: 'bg-[var(--brand)] text-white lumen-hero-inverse',
};

export function Section({ tone = 'white', id, children }: SectionProps) {
  return (
    <section id={id} className={`${SECTION_TONE_CLASSES[tone]} py-14 md:py-20 lg:py-28`}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/* 3. Heading */
export interface HeadingProps {
  level: 1 | 2 | 3;
  children: string;
  showMotif?: boolean;
  inverse?: boolean;
}

export function Heading({ level, children, showMotif = true, inverse = false }: HeadingProps) {
  if (level === 1) {
    return (
      <h1 className={inverse ? 'lumen-h1 text-white' : 'lumen-h1'}>{children}</h1>
    );
  }
  if (level === 3) {
    return (
      <h3 className={inverse ? 'lumen-h3 text-white' : 'lumen-h3'}>{children}</h3>
    );
  }
  return (
    <div>
      {showMotif ? <LumenSparkMotif inverse={inverse} /> : null}
      <h2 className={inverse ? 'lumen-h2 text-white' : 'lumen-h2'}>{children}</h2>
    </div>
  );
}

/* 4. Button */
export interface ButtonProps {
  href: string;
  locale: string;
  variant?: 'filled' | 'soft' | 'outline' | 'link';
  children: ReactNode;
}

const BUTTON_VARIANT_CLASSES: Record<NonNullable<ButtonProps['variant']>, string> = {
  filled:
    'bg-[var(--brand)] text-white px-6 py-2.5 hover:opacity-90',
  soft:
    'bg-[var(--soft-btn)] text-[var(--brand-ink)] px-6 py-2.5 hover:opacity-90',
  outline:
    'border-2 border-[var(--brand)] text-[var(--brand)] px-6 py-2.5 hover:bg-[var(--bg-tint)]',
  link:
    'text-[var(--link)] underline underline-offset-4 decoration-2 hover:text-[var(--brand)] px-1',
};

export function Button({ href, locale, variant = 'filled', children }: ButtonProps) {
  return (
    <LocaleLink
      locale={locale}
      href={href}
      className={`rounded-[4px] font-semibold min-h-[44px] inline-flex items-center transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)] ${BUTTON_VARIANT_CLASSES[variant]}`}
    >
      {children}
    </LocaleLink>
  );
}

/* 5. PlaceholderImage */
export interface PlaceholderImageProps {
  slot: MediaSlotId;
  aspect?: '16:10' | '4:3';
  locale?: string;
}

export function PlaceholderImage({ slot, aspect = '16:10', locale = 'en' }: PlaceholderImageProps) {
  const gradId = useId();
  const entry = MEDIA_SLOTS[slot];
  const aspectClass = aspect === '4:3' ? 'aspect-[4/3]' : 'aspect-[16/10]';
  const alt = locale === 'bn' ? entry.altBn : entry.altEn;

  return (
    <div
      className={`rounded-none ${aspectClass} relative overflow-hidden bg-[var(--bg-tint)] w-full`}
    >
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--bg-warm)" />
            <stop offset="55%" stopColor="var(--bg-tint)" />
            <stop offset="100%" stopColor="var(--soft-btn)" />
          </linearGradient>
        </defs>
        <rect width="800" height="500" fill={`url(#${gradId})`} />
        <circle cx="660" cy="110" r="140" fill="var(--accent)" fillOpacity="0.14" />
        <circle cx="140" cy="410" r="170" fill="var(--crimson)" fillOpacity="0.1" />
        <rect
          x="48"
          y="48"
          width="704"
          height="404"
          fill="none"
          stroke="var(--brand)"
          strokeWidth="2"
          strokeOpacity="0.15"
        />
        <rect x="48" y="48" width="96" height="8" fill="var(--accent)" fillOpacity="0.7" />
        <rect x="656" y="444" width="96" height="8" fill="var(--brand)" fillOpacity="0.7" />
      </svg>
      <img
        src={entry.src}
        alt={alt}
        className="relative z-10 h-full w-full object-cover block"
        loading="lazy"
      />
    </div>
  );
}

/* 6. HeroBand */
export interface HeroBandProps {
  locale: string;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  secondaryLinkLabel?: string;
  secondaryLinkHref?: string;
  photoSlot: MediaSlotId;
  frame?: 'blocks' | 'petal';
  tone?: 'warm' | 'brand' | 'crimson';
}

const HERO_TONE_CLASSES: Record<NonNullable<HeroBandProps['tone']>, string> = {
  warm: 'relative overflow-hidden bg-[var(--bg-warm)] text-[var(--brand-ink)]',
  brand: 'relative overflow-hidden bg-[var(--brand)] text-white lumen-hero-inverse',
  crimson: 'relative overflow-hidden bg-[var(--crimson)] text-white lumen-hero-inverse',
};

export function HeroBand({
  locale,
  title,
  body,
  ctaLabel,
  ctaHref,
  secondaryLinkLabel,
  secondaryLinkHref,
  photoSlot,
  frame = 'blocks',
  tone = 'warm',
}: HeroBandProps) {
  const heroId = useId();
  const isDark = tone === 'brand' || tone === 'crimson';

  return (
    <section className={HERO_TONE_CLASSES[tone]}>
      {tone === 'warm' ? (
        <svg
          aria-hidden="true"
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          className="pointer-events-none absolute inset-0 h-full w-full"
        >
          <defs>
            <radialGradient id={`${heroId}-crimson`} cx="18%" cy="25%" r="55%">
              <stop offset="0%" stopColor="var(--crimson)" stopOpacity="0.06" />
              <stop offset="100%" stopColor="var(--crimson)" stopOpacity="0" />
            </radialGradient>
            <radialGradient id={`${heroId}-accent`} cx="85%" cy="75%" r="55%">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </radialGradient>
          </defs>
          <rect width="1200" height="600" fill={`url(#${heroId}-crimson)`} />
          <rect width="1200" height="600" fill={`url(#${heroId}-accent)`} />
        </svg>
      ) : null}

      <div className="relative z-10 max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-6 space-y-5">
            <Heading level={1} inverse={isDark}>
              {title}
            </Heading>
            <p className={isDark ? 'lumen-body text-white/90' : 'lumen-body'}>{body}</p>
            <div className="flex flex-wrap items-center gap-6 pt-2">
              <Button href={ctaHref} locale={locale} variant={isDark ? 'soft' : 'filled'}>
                {ctaLabel}
              </Button>
              {secondaryLinkLabel && secondaryLinkHref ? (
                <LocaleLink
                  locale={locale}
                  href={secondaryLinkHref}
                  className={
                    isDark
                      ? 'font-semibold underline underline-offset-4 decoration-2 text-white hover:opacity-85 min-h-[44px] inline-flex items-center'
                      : 'font-semibold underline underline-offset-4 decoration-2 text-[var(--link)] hover:text-[var(--brand)] min-h-[44px] inline-flex items-center'
                  }
                >
                  {secondaryLinkLabel}
                </LocaleLink>
              ) : null}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative px-4 pt-3 pb-4">
              {frame === 'blocks' ? (
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute top-0 left-8 right-0 bottom-4 bg-[var(--accent)]/12"
                />
              ) : null}
              <div className="relative z-10">
                <PlaceholderImage slot={photoSlot} aspect="16:10" locale={locale} />
              </div>
              {frame === 'blocks' ? (
                <div aria-hidden="true" className="pointer-events-none">
                  {/* Bottom-left Sunset Orange L-bar */}
                  <span className="absolute bottom-0 left-0 z-20 w-16 h-4 bg-[var(--accent)]" />
                  <span className="absolute bottom-0 left-0 z-20 w-4 h-16 bg-[var(--accent)]" />
                  {/* Bottom-right Warm Crimson L-bar */}
                  <span
                    className={`absolute bottom-0 right-0 z-20 w-16 h-4 ${
                      isDark ? 'bg-white' : 'bg-[var(--brand)]'
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 right-0 z-20 w-4 h-16 ${
                      isDark ? 'bg-white' : 'bg-[var(--brand)]'
                    }`}
                  />
                  {/* Upper-right 4 translucent crimson/orange circles */}
                  <div className="absolute -top-1 right-0 z-20 grid grid-cols-2 gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[var(--accent)]/70" />
                    <span className="w-3 h-3 rounded-full bg-[var(--crimson)]/60" />
                    <span className="w-3 h-3 rounded-full bg-[var(--crimson)]/60" />
                    <span className="w-3 h-3 rounded-full bg-[var(--accent)]/70" />
                  </div>
                </div>
              ) : (
                <div aria-hidden="true" className="pointer-events-none">
                  <span className="absolute bottom-0 left-0 z-20 w-20 h-4 bg-[var(--crimson)]" />
                  <span className="absolute bottom-0 left-0 z-20 w-4 h-20 bg-[var(--crimson)]" />
                  <span className="absolute top-0 right-0 z-20 w-12 h-4 bg-[var(--accent)]" />
                  <span className="absolute top-0 right-0 z-20 w-4 h-12 bg-[var(--accent)]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* 7. SubBar */
export interface SubBarProps {
  locale: string;
  items: Array<{ label: string; href: string; active?: boolean }>;
}

export function SubBar({ locale, items }: SubBarProps) {
  const visibleItems = items.slice(0, 3);
  return (
    <nav
      aria-label="Section navigation"
      className="w-full bg-[var(--brand-deep)] text-white border-b-2 border-[var(--brand)]"
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2 py-2">
        {visibleItems.map((item) => (
          <LocaleLink
            key={item.href}
            locale={locale}
            href={item.href}
            aria-current={item.active ? 'page' : undefined}
            className={
              item.active
                ? 'bg-[var(--brand)] text-white font-bold px-4 py-2 rounded-[4px] min-h-[44px] inline-flex items-center'
                : 'text-white/90 hover:text-white hover:underline underline-offset-4 px-4 py-2 min-h-[44px] inline-flex items-center'
            }
          >
            {item.label}
          </LocaleLink>
        ))}
      </div>
    </nav>
  );
}

/* 8. StatRow */
export interface StatRowProps {
  stats: Array<{ value: string; caption: string; verified: true }>;
}

export function StatRow({ stats }: StatRowProps) {
  const colClass =
    stats.length === 3
      ? 'grid grid-cols-1 sm:grid-cols-3 gap-8'
      : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8';

  return (
    <div>
      <div className={colClass}>
        {stats.map((stat) => (
          <div key={stat.value}>
            <div className="text-4xl lg:text-5xl font-extrabold text-[var(--brand)]">
              {stat.value}
            </div>
            <p className="text-sm text-[var(--text)] mt-2">{stat.caption}</p>
          </div>
        ))}
      </div>
      <div className="relative flex items-center justify-center mt-12">
        <div className="w-full h-px bg-[var(--hairline)]" />
        <div className="bg-[var(--bg)] px-4 absolute">
          <LumenSparkMotif />
        </div>
      </div>
    </div>
  );
}

/* 9. StepRow */
export interface StepRowProps {
  title: string;
  intro?: string;
  locale: string;
  steps: Array<{
    num: '1' | '2' | '3' | '4';
    title: string;
    body: string;
    linkLabel?: string;
    linkHref?: string;
  }>;
}

export function StepRow({ title, intro, locale, steps }: StepRowProps) {
  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <Heading level={2}>{title}</Heading>
        {intro ? <p className="lumen-body">{intro}</p> : null}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
        {steps.map((step, idx) => (
          <div key={step.num} className="flex flex-col">
            <div className="flex items-center gap-4">
              <div className="w-[60px] h-[60px] bg-[var(--crimson)] text-white text-3xl font-extrabold flex items-center justify-center shrink-0">
                {step.num}
              </div>
              {idx < steps.length - 1 ? (
                <span
                  aria-hidden="true"
                  className="hidden lg:inline-block text-3xl font-bold text-[var(--crimson)] opacity-45 select-none"
                >
                  ❯
                </span>
              ) : null}
            </div>

            <h3 className="lumen-h3 mt-5">{step.title}</h3>
            <p className="lumen-body mt-2 text-sm">{step.body}</p>

            {step.linkLabel && step.linkHref ? (
              <div className="mt-4">
                <LocaleLink
                  locale={locale}
                  href={step.linkHref}
                  className="text-[var(--link)] underline underline-offset-4 decoration-2 font-semibold hover:text-[var(--brand)] inline-flex items-center min-h-[44px]"
                >
                  {step.linkLabel}
                </LocaleLink>
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}

/* 10. MediaColumns */
export interface MediaColumnsItem {
  photoSlot?: MediaSlotId;
  accentColor?: string;
  title: string;
  href: string;
  meta?: string;
  body: string;
  links?: Array<{ label: string; href: string }>;
  disclosureTitle?: string;
  disclosureItems?: string[];
}

export interface MediaColumnsProps {
  title: string;
  intro?: string;
  columns: 2 | 3 | 4;
  locale: string;
  items: MediaColumnsItem[];
}

const GRID_COL_CLASSES: Record<MediaColumnsProps['columns'], string> = {
  2: 'grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10',
  3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10',
  4: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10',
};

const ACCENT_BAR_CLASSES: Record<string, string> = {
  brand: 'bg-[var(--brand)]',
  crimson: 'bg-[var(--crimson)]',
  terracotta: 'bg-[var(--terracotta)]',
  accent: 'bg-[var(--accent)]',
};

export function MediaColumns({ title, intro, columns, locale, items }: MediaColumnsProps) {
  return (
    <div className="space-y-10">
      <div className="max-w-3xl space-y-3">
        <Heading level={2}>{title}</Heading>
        {intro ? <p className="lumen-body">{intro}</p> : null}
      </div>

      <div className={GRID_COL_CLASSES[columns]}>
        {items.map((item) => {
          const barClass =
            (item.accentColor && ACCENT_BAR_CLASSES[item.accentColor]) ?? 'bg-[var(--brand)]';

          return (
            <article key={item.title} className="flex flex-col">
              {item.photoSlot ? (
                <PlaceholderImage slot={item.photoSlot} aspect="4:3" locale={locale} />
              ) : (
                <div className={`h-2 w-full ${barClass}`} aria-hidden="true" />
              )}

              <LocaleLink
                locale={locale}
                href={item.href}
                className="lumen-h3 block mt-4 text-[var(--brand)] hover:text-[var(--link)] underline underline-offset-4 decoration-2"
              >
                {item.title}
              </LocaleLink>

              {item.meta ? (
                <p className="text-sm font-bold text-[var(--brand-ink)] mt-2">{item.meta}</p>
              ) : null}

              <p className="lumen-body mt-2 text-sm">{item.body}</p>

              {item.links && item.links.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-4">
                  {item.links.map((lnk) => (
                    <LocaleLink
                      key={lnk.href + lnk.label}
                      locale={locale}
                      href={lnk.href}
                      className="text-sm font-semibold text-[var(--link)] underline underline-offset-4 decoration-2 hover:text-[var(--brand)] min-h-[44px] inline-flex items-center"
                    >
                      {lnk.label}
                    </LocaleLink>
                  ))}
                </div>
              ) : null}

              {item.disclosureTitle && item.disclosureItems && item.disclosureItems.length > 0 ? (
                <div className="mt-4">
                  <Disclosure summary={item.disclosureTitle}>
                    <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text)]">
                      {item.disclosureItems.map((entry) => (
                        <li key={entry}>{entry}</li>
                      ))}
                    </ul>
                  </Disclosure>
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* 11. SplitFeature */
export interface SplitFeatureProps {
  photoSlot: MediaSlotId;
  photoSide?: 'left' | 'right';
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  locale: string;
}

export function SplitFeature({
  photoSlot,
  photoSide = 'left',
  title,
  body,
  ctaLabel,
  ctaHref,
  locale,
}: SplitFeatureProps) {
  const imageOrder = photoSide === 'right' ? 'lg:order-2' : 'lg:order-1';
  const textOrder = photoSide === 'right' ? 'lg:order-1' : 'lg:order-2';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      <div className={`lg:col-span-6 ${imageOrder}`}>
        <PlaceholderImage slot={photoSlot} aspect="16:10" locale={locale} />
      </div>
      <div className={`lg:col-span-6 space-y-5 ${textOrder}`}>
        <Heading level={2}>{title}</Heading>
        <p className="lumen-body">{body}</p>
        <div className="pt-1">
          <Button href={ctaHref} locale={locale} variant="filled">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}

/* 12. SideHeadingBlocks */
export type SideHeadingIcon = 'calendar' | 'currency' | 'location' | 'shield' | 'clock' | 'check';

export interface SideHeadingBlocksProps {
  title: string;
  intro: string;
  ctaLabel?: string;
  ctaHref?: string;
  locale: string;
  blocks: Array<{
    icon: SideHeadingIcon;
    title: string;
    body: string;
    linkLabel?: string;
    linkHref?: string;
  }>;
}

function renderSideIcon(icon: SideHeadingIcon) {
  const iconClass = 'w-8 h-8 text-[var(--crimson)] shrink-0 mt-0.5';
  switch (icon) {
    case 'calendar':
      return <Calendar className={iconClass} aria-hidden="true" />;
    case 'currency':
      return <Banknote className={iconClass} aria-hidden="true" />;
    case 'location':
      return <MapPin className={iconClass} aria-hidden="true" />;
    case 'shield':
      return <ShieldCheck className={iconClass} aria-hidden="true" />;
    case 'clock':
      return <Clock className={iconClass} aria-hidden="true" />;
    case 'check':
      return <CheckCircle2 className={iconClass} aria-hidden="true" />;
  }
}

export function SideHeadingBlocks({
  title,
  intro,
  ctaLabel,
  ctaHref,
  locale,
  blocks,
}: SideHeadingBlocksProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
      <div className="lg:col-span-4 space-y-4">
        <Heading level={2}>{title}</Heading>
        <p className="lumen-body text-sm">{intro}</p>
        {ctaLabel && ctaHref ? (
          <div className="pt-2">
            <Button href={ctaHref} locale={locale} variant="outline">
              {ctaLabel}
            </Button>
          </div>
        ) : null}
      </div>

      <div className="lg:col-span-8 space-y-8">
        {blocks.map((block) => (
          <div key={block.title} className="flex items-start gap-5">
            {renderSideIcon(block.icon)}
            <div className="space-y-1.5">
              <h3 className="lumen-h3">{block.title}</h3>
              <p className="lumen-body text-sm">{block.body}</p>
              {block.linkLabel && block.linkHref ? (
                <LocaleLink
                  locale={locale}
                  href={block.linkHref}
                  className="text-sm font-semibold text-[var(--link)] underline underline-offset-4 decoration-2 hover:text-[var(--brand)] inline-flex items-center min-h-[44px]"
                >
                  {block.linkLabel}
                </LocaleLink>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 13. Disclosure */
export interface DisclosureProps {
  summary: string;
  children: ReactNode;
}

export function Disclosure({ summary, children }: DisclosureProps) {
  return (
    <details className="group border-b border-[var(--hairline)] py-4">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-[var(--brand-ink)] min-h-[44px]">
        <span>{summary}</span>
        <span aria-hidden="true" className="text-xl font-bold text-[var(--brand)] shrink-0">
          <span className="group-open:hidden">+</span>
          <span className="hidden group-open:inline">−</span>
        </span>
      </summary>
      <div className="pt-3 pb-1 text-[var(--text)]">{children}</div>
    </details>
  );
}

/* 14. Tabs */
export interface TabSectionPanelDisclosure {
  summary: string;
  detail: string;
}

export interface TabSectionPanelProps {
  locale: string;
  title: string;
  body: string;
  bullets?: string[];
  disclosures?: TabSectionPanelDisclosure[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function TabSectionPanel({
  locale,
  title,
  body,
  bullets,
  disclosures,
  ctaLabel,
  ctaHref,
}: TabSectionPanelProps) {
  return (
    <div className="space-y-4">
      <h3 className="lumen-h3 text-[var(--brand-ink)]">{title}</h3>
      <p className="lumen-body">{body}</p>
      {bullets && bullets.length > 0 ? (
        <ul className="list-disc pl-5 space-y-2 text-[var(--text)]">
          {bullets.map((bullet) => (
            <li key={bullet}>{bullet}</li>
          ))}
        </ul>
      ) : null}
      {disclosures && disclosures.length > 0 ? (
        <div className="pt-2">
          {disclosures.map((item) => (
            <Disclosure key={item.summary} summary={item.summary}>
              <p className="lumen-body">{item.detail}</p>
            </Disclosure>
          ))}
        </div>
      ) : null}
      {ctaLabel && ctaHref ? (
        <div className="pt-2">
          <Button href={ctaHref} locale={locale} variant="link">
            {ctaLabel}
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export interface TabsProps {
  title?: string;
  intro?: string;
  tabs: Array<{ id: string; label: string; content: ReactNode }>;
}

export function Tabs({ title, intro, tabs }: TabsProps) {
  const baseId = useId();
  const [activeIndex, setActiveIndex] = useState(0);

  if (tabs.length === 0) return null;

  const safeIndex = activeIndex < tabs.length ? activeIndex : 0;
  const activeTab = tabs[safeIndex];

  function handleKeyDown(e: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      setActiveIndex((index + 1) % tabs.length);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      setActiveIndex((index - 1 + tabs.length) % tabs.length);
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActiveIndex(tabs.length - 1);
    }
  }

  return (
    <div className="space-y-8">
      {title ? (
        <div className="max-w-3xl space-y-3">
          <Heading level={2}>{title}</Heading>
          {intro ? <p className="lumen-body">{intro}</p> : null}
        </div>
      ) : null}

      <div>
        <div role="tablist" className="flex flex-wrap border-b border-[var(--hairline)] gap-2">
          {tabs.map((tab, idx) => {
            const selected = idx === safeIndex;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`${baseId}-tab-${tab.id}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveIndex(idx)}
                onKeyDown={(e) => handleKeyDown(e, idx)}
                className={
                  selected
                    ? 'px-5 py-3 min-h-[44px] border-b-4 border-[var(--brand)] text-[var(--brand-ink)] font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]'
                    : 'px-5 py-3 min-h-[44px] border-b-4 border-transparent text-[var(--text)] hover:text-[var(--brand-ink)] font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--focus)]'
                }
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab ? (
          <div
            role="tabpanel"
            id={`${baseId}-panel-${activeTab.id}`}
            aria-labelledby={`${baseId}-tab-${activeTab.id}`}
            className="pt-6"
          >
            {activeTab.content}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/* 15. CalloutNotice */
export interface CalloutNoticeProps {
  title: string;
  body: string;
  linkLabel?: string;
  linkHref?: string;
  locale: string;
}

export function CalloutNotice({
  title,
  body,
  linkLabel,
  linkHref,
  locale,
}: CalloutNoticeProps) {
  return (
    <div className="bg-[var(--bg-tint)] p-6 md:p-8 max-w-4xl space-y-2">
      <h3 className="lumen-h3">{title}</h3>
      <p className="lumen-body text-sm">{body}</p>
      {linkLabel && linkHref ? (
        <div className="pt-1">
          <LocaleLink
            locale={locale}
            href={linkHref}
            className="text-sm font-semibold text-[var(--link)] underline underline-offset-4 decoration-2 hover:text-[var(--brand)] min-h-[44px] inline-flex items-center"
          >
            {linkLabel}
          </LocaleLink>
        </div>
      ) : null}
    </div>
  );
}

/* 16. CtaBand */
export interface CtaBandProps {
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  locale: string;
}

export function CtaBand({ title, body, ctaLabel, ctaHref, locale }: CtaBandProps) {
  return (
    <section className="bg-[var(--brand)] py-16 px-4 sm:px-6 lg:px-8">
      <div className="bg-[var(--surface-paper)] p-8 md:p-12 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-8 space-y-3">
          <Heading level={2} showMotif={false}>
            {title}
          </Heading>
          <p className="lumen-body">{body}</p>
        </div>
        <div className="md:col-span-4 md:flex md:justify-end">
          <Button href={ctaHref} locale={locale} variant="filled">
            {ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}

/* 17. Breadcrumb */
export interface BreadcrumbProps {
  locale: string;
  items: Array<{ label: string; href?: string }>;
}

export function Breadcrumb({ locale, items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="bg-[var(--bg-tint)] py-2.5 text-xs text-[var(--text)]">
      <ol className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center gap-2">
        {items.map((item, idx) => (
          <li key={item.label} className="inline-flex items-center gap-2">
            {idx > 0 ? <span aria-hidden="true">/</span> : null}
            {item.href ? (
              <LocaleLink
                locale={locale}
                href={item.href}
                className="underline underline-offset-2 hover:text-[var(--brand)]"
              >
                {item.label}
              </LocaleLink>
            ) : (
              <span aria-current="page" className="font-semibold text-[var(--brand-ink)]">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/* 18. PricingSwitcherSection */
export interface PricingPlanItem {
  id: string;
  title: string;
  price: string;
  period: string;
  body: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface PricingSwitcherSectionProps {
  locale: string;
  fullCoursesLabel: string;
  passesLabel: string;
  fullCourses: PricingPlanItem[];
  passes: PricingPlanItem[];
}

function PricingPlanGrid({ plans, locale }: { plans: PricingPlanItem[]; locale: string }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
      {plans.map((plan) => (
        <div key={plan.id} className="flex flex-col justify-between">
          <div>
            <div className="h-[3px] w-full bg-[var(--brand)] mb-4" aria-hidden="true" />
            <h3 className="text-xl font-bold text-[var(--brand-ink)]">{plan.title}</h3>
            <p className="mt-2">
              <span className="text-2xl font-bold text-[var(--brand)]">{plan.price}</span>
              <span className="text-sm text-[var(--muted)] ml-1">{plan.period}</span>
            </p>
            <p className="lumen-body mt-3">{plan.body}</p>
            <ul className="mt-4 space-y-2 text-sm text-[var(--text)]">
              {plan.bullets.map((bullet) => (
                <li key={bullet} className="flex items-start gap-2">
                  <span className="text-[var(--brand)] font-bold" aria-hidden="true">
                    •
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mt-6">
            <Button href={plan.ctaHref} locale={locale} variant="filled">
              {plan.ctaLabel}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PricingSwitcherSection({
  locale,
  fullCoursesLabel,
  passesLabel,
  fullCourses,
  passes,
}: PricingSwitcherSectionProps) {
  return (
    <Tabs
      tabs={[
        {
          id: 'full-courses',
          label: fullCoursesLabel,
          content: <PricingPlanGrid plans={fullCourses} locale={locale} />,
        },
        {
          id: 'passes',
          label: passesLabel,
          content: <PricingPlanGrid plans={passes} locale={locale} />,
        },
      ]}
    />
  );
}

/* 19. FaqDisclosureList */
export interface FaqDisclosureItem {
  question: string;
  answer: string;
}

export interface FaqDisclosureListProps {
  title: string;
  items: FaqDisclosureItem[];
}

export function FaqDisclosureList({ title, items }: FaqDisclosureListProps) {
  return (
    <div>
      <Heading level={2}>{title}</Heading>
      <div className="mt-8 space-y-4">
        {items.map((item) => (
          <Disclosure key={item.question} summary={item.question}>
            <p className="lumen-body">{item.answer}</p>
          </Disclosure>
        ))}
      </div>
    </div>
  );
}
