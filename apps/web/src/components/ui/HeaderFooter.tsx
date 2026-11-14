/** @purpose 3-tier institutional header with interactive ETS/British Council mega-menus, mobile accordion drawer, and bilingual footer */
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronRight, Menu, PlusCircle, X } from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { LocaleSwitcher } from '@/app/[locale]/_components/LocaleSwitcher';
import { BangladeshPaymentTrustBar } from '@/app/[locale]/(marketing)/_components/BangladeshPaymentTrustBar';
import { LumenSparkMotif, PlaceholderImage } from '@/src/components/ui/primitives';
import { NAV_DATA, type NavLocale } from '@/src/content/nav';

type MegaMenuId = 'exams' | 'courses' | 'practice';

export interface InstitutionalHeaderProps {
  locale: NavLocale;
}

export function InstitutionalHeader({ locale }: InstitutionalHeaderProps) {
  const data = NAV_DATA[locale];
  const headerRef = useRef<HTMLElement | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [activeMenu, setActiveMenu] = useState<MegaMenuId | null>(null);
  const [activeGreTab, setActiveGreTab] = useState<string>(
    data.megaGreIelts.categories[0]?.id ?? 'gre-general',
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileAccordion, setMobileAccordion] = useState<MegaMenuId | null>('exams');

  const clearHoverTimer = () => {
    if (hoverTimerRef.current !== null) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }
  };

  const scheduleOpen = (menu: MegaMenuId) => {
    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => {
      setActiveMenu(menu);
    }, 150);
  };

  const scheduleClose = () => {
    clearHoverTimer();
    hoverTimerRef.current = setTimeout(() => {
      setActiveMenu(null);
    }, 150);
  };

  const toggleMenu = (menu: MegaMenuId) => {
    clearHoverTimer();
    setActiveMenu((prev) => (prev === menu ? null : menu));
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setActiveMenu(null);
        setMobileOpen(false);
      }
    };

    const handleMouseDown = (event: MouseEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);
    return () => {
      clearHoverTimer();
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleMouseDown);
    };
  }, []);

  const selectedGreCategory =
    data.megaGreIelts.categories.find((cat) => cat.id === activeGreTab) ??
    data.megaGreIelts.categories[0];

  const closeAll = () => {
    clearHoverTimer();
    setActiveMenu(null);
    setMobileOpen(false);
  };

  return (
    <header ref={headerRef} className="relative z-40 w-full">
      {/* Skip to main content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-[4px] focus:bg-[var(--accent)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--brand-ink)]"
      >
        {data.skipToContent}
      </a>

      {/* Tier 1: TopRibbon */}
      <div className="bg-[var(--accent)] text-[var(--brand-ink)] text-xs py-2 px-4">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-center font-medium">
          <span>{data.topRibbon.announcement}</span>
          <LocaleLink
            locale={locale}
            href={data.topRibbon.ctaHref}
            className="font-bold underline underline-offset-4 decoration-2 hover:opacity-80"
          >
            {data.topRibbon.ctaLabel}
          </LocaleLink>
        </div>
      </div>

      {/* Tier 2: UtilityBar (Desktop) */}
      <div className="hidden lg:block bg-[var(--bg)] border-b border-[var(--hairline)]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-11 flex items-center justify-between gap-4">
          <div className="flex items-center">
            <LocaleSwitcher />
          </div>
          <nav aria-label="Utility navigation" className="flex items-center gap-6 text-xs font-semibold text-[var(--text)]">
            {data.utilityLinks.map((item) => (
              <LocaleLink
                key={item.href}
                locale={locale}
                href={item.href}
                className="hover:text-[var(--brand)] underline-offset-4 hover:underline transition-colors"
              >
                {item.label}
              </LocaleLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Tier 3: MainNav */}
      <div
        className="bg-[var(--brand-deep)] text-white relative border-b-4 border-[var(--brand)]"
        onMouseLeave={scheduleClose}
      >
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          {/* Logo */}
          <LocaleLink
            locale={locale}
            href="/"
            onClick={closeAll}
            className="flex items-center gap-3 text-lg font-extrabold tracking-tight text-white shrink-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="pt-2" aria-hidden="true">
              <LumenSparkMotif inverse />
            </span>
            <span>{data.brandLabel}</span>
          </LocaleLink>

          {/* Desktop 4 Menu Triggers */}
          <nav aria-label="Primary navigation" className="hidden lg:flex items-center gap-2">
            <button
              type="button"
              aria-expanded={activeMenu === 'exams'}
              onMouseEnter={() => scheduleOpen('exams')}
              onClick={() => toggleMenu('exams')}
              className={`min-h-[44px] px-3 py-2 inline-flex items-center gap-1.5 text-sm font-semibold rounded-[4px] transition-colors cursor-pointer ${
                activeMenu === 'exams'
                  ? 'bg-white text-[var(--brand-ink)]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{data.triggers.exams}</span>
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-expanded={activeMenu === 'courses'}
              onMouseEnter={() => scheduleOpen('courses')}
              onClick={() => toggleMenu('courses')}
              className={`min-h-[44px] px-3 py-2 inline-flex items-center gap-1.5 text-sm font-semibold rounded-[4px] transition-colors cursor-pointer ${
                activeMenu === 'courses'
                  ? 'bg-white text-[var(--brand-ink)]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{data.triggers.courses}</span>
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>

            <button
              type="button"
              aria-expanded={activeMenu === 'practice'}
              onMouseEnter={() => scheduleOpen('practice')}
              onClick={() => toggleMenu('practice')}
              className={`min-h-[44px] px-3 py-2 inline-flex items-center gap-1.5 text-sm font-semibold rounded-[4px] transition-colors cursor-pointer ${
                activeMenu === 'practice'
                  ? 'bg-white text-[var(--brand-ink)]'
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <span>{data.triggers.practice}</span>
              <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
            </button>

            <LocaleLink
              locale={locale}
              href="/pricing"
              onMouseEnter={() => {
                clearHoverTimer();
                setActiveMenu(null);
              }}
              onClick={closeAll}
              className="min-h-[44px] px-3 py-2 inline-flex items-center text-sm font-semibold text-white hover:bg-white/10 rounded-[4px] transition-colors"
            >
              {data.triggers.pricing}
            </LocaleLink>
          </nav>

          {/* Desktop Soft-Lilac CTA */}
          <div className="hidden lg:flex items-center">
            <LocaleLink
              locale={locale}
              href={data.mainCta.href}
              onClick={closeAll}
              className="bg-[var(--soft-btn)] text-[var(--brand-ink)] font-semibold text-sm rounded-[4px] px-5 py-2.5 min-h-[44px] inline-flex items-center hover:opacity-90 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
            >
              {data.mainCta.label}
            </LocaleLink>
          </div>

          {/* Mobile Menu Toggle (< 1024px) */}
          <button
            type="button"
            className="lg:hidden min-h-[44px] min-w-[44px] inline-flex items-center justify-center rounded-[4px] text-white hover:bg-white/10 cursor-pointer"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? data.mobileMenu.closeLabel : data.mobileMenu.openLabel}
            onClick={() => setMobileOpen((prev) => !prev)}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Desktop Mega-Menu Panel */}
        {activeMenu !== null ? (
          <div
            onMouseEnter={clearHoverTimer}
            className="hidden lg:block absolute left-0 right-0 top-full bg-[var(--bg)] text-[var(--brand-ink)] border-t border-[var(--hairline)] shadow-[var(--shadow-hard)]"
          >
            {activeMenu === 'exams' && selectedGreCategory ? (
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-12 gap-8">
                  {/* Left Rail Tabs */}
                  <div
                    role="tablist"
                    aria-label={data.triggers.exams}
                    className="col-span-4 border-r border-[var(--hairline)] pr-6 space-y-1"
                  >
                    {data.megaGreIelts.categories.map((cat) => {
                      const isActive = cat.id === selectedGreCategory.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          role="tab"
                          aria-selected={isActive}
                          onMouseEnter={() => setActiveGreTab(cat.id)}
                          onClick={() => setActiveGreTab(cat.id)}
                          className={`w-full text-left px-4 py-3 text-sm font-bold flex items-center justify-between rounded-[4px] transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-[var(--bg-tint)] text-[var(--brand)] border-l-4 border-[var(--brand)]'
                              : 'text-[var(--text)] hover:bg-[var(--bg-tint)]/50'
                          }`}
                        >
                          <span>{cat.label}</span>
                          <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>

                  {/* Right 6-Link Grid */}
                  <div className="col-span-8 grid grid-cols-2 gap-x-8 gap-y-5 content-start">
                    {selectedGreCategory.links.map((item) => (
                      <LocaleLink
                        key={`${selectedGreCategory.id}-${item.title}`}
                        locale={locale}
                        href={item.href}
                        onClick={closeAll}
                        className="group block"
                      >
                        <div className="text-sm font-bold text-[var(--brand)] group-hover:text-[var(--link)] underline underline-offset-4 decoration-2">
                          {item.title}
                        </div>
                        <p className="text-xs text-[var(--text)] mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </LocaleLink>
                    ))}
                  </div>
                </div>

                {/* Bottom 2-Column Terracotta Conversion Strip */}
                <div className="mt-8 pt-6 border-t border-[var(--hairline)] grid grid-cols-2 gap-8">
                  {data.megaGreIelts.conversionStrip.map((action) => (
                    <div key={action.href} className="flex items-center gap-4">
                      <div
                        className="flex-1 flex items-center text-[var(--terracotta)]"
                        aria-hidden="true"
                      >
                        <span className="w-full border-t-2 border-dashed border-[var(--terracotta)]" />
                        <ChevronRight className="h-4 w-4 -ml-1.5 shrink-0" />
                      </div>
                      <LocaleLink
                        locale={locale}
                        href={action.href}
                        onClick={closeAll}
                        className="shrink-0 border border-[var(--brand-ink)] px-5 py-2.5 text-xs font-extrabold tracking-wide text-[var(--brand-ink)] hover:bg-[var(--bg-tint)] transition-colors min-h-[44px] inline-flex items-center"
                      >
                        {action.label}
                      </LocaleLink>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {activeMenu === 'courses' ? (
              <div>
                <div className="max-w-[1200px] mx-auto grid grid-cols-12">
                  {/* Col 1: Tint Overview */}
                  <div className="col-span-4 bg-[var(--bg-tint)] p-8">
                    <h3 className="lumen-h3 mb-3">{data.megaCourses.col1Title}</h3>
                    <p className="text-sm text-[var(--text)] leading-relaxed">
                      {data.megaCourses.col1Body}
                    </p>
                  </div>

                  {/* Col 2: Underlined Links with Chevrons */}
                  <div className="col-span-4 bg-[var(--bg)] p-8">
                    <h3 className="text-sm font-extrabold text-[var(--brand-ink)] underline underline-offset-4 decoration-2 mb-4">
                      {data.megaCourses.col2Heading}
                    </h3>
                    <ul className="space-y-3">
                      {data.megaCourses.col2Links.map((link) => (
                        <li key={link.href}>
                          <LocaleLink
                            locale={locale}
                            href={link.href}
                            onClick={closeAll}
                            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--brand)] hover:text-[var(--link)] underline underline-offset-4"
                          >
                            <span>{link.label}</span>
                            <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                          </LocaleLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Col 3: PlaceholderImage */}
                  <div className="col-span-4 bg-[var(--bg)] p-8 flex items-center">
                    <div className="w-full">
                      <PlaceholderImage slot="mega-courses" aspect="4:3" locale={locale} />
                    </div>
                  </div>
                </div>

                {/* Bottom Brand Ribbon */}
                <div className="bg-[var(--brand)] text-white">
                  <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-6">
                      <span className="text-xs font-bold text-white/80">
                        {data.megaCourses.ribbonLabel}
                      </span>
                      {data.megaCourses.ribbonLinks.map((item) => (
                        <LocaleLink
                          key={item.label}
                          locale={locale}
                          href={item.href}
                          onClick={closeAll}
                          className="inline-flex items-center gap-1.5 text-sm font-semibold text-white hover:text-[var(--accent)] transition-colors"
                        >
                          <span>{item.label}</span>
                          <PlusCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
                        </LocaleLink>
                      ))}
                    </div>
                    <LocaleLink
                      locale={locale}
                      href={data.megaCourses.ribbonCta.href}
                      onClick={closeAll}
                      className="shrink-0 bg-[var(--soft-btn)] text-[var(--brand-ink)] px-5 py-2.5 rounded-[4px] text-xs font-extrabold min-h-[44px] inline-flex items-center hover:opacity-90 transition-opacity"
                    >
                      {data.megaCourses.ribbonCta.label}
                    </LocaleLink>
                  </div>
                </div>
              </div>
            ) : null}

            {activeMenu === 'practice' ? (
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h3 className="lumen-h3 mb-5">{data.megaPractice.heading}</h3>
                <div className="grid grid-cols-4 gap-8">
                  {data.megaPractice.links.map((item) => (
                    <LocaleLink
                      key={item.title}
                      locale={locale}
                      href={item.href}
                      onClick={closeAll}
                      className="group block"
                    >
                      <div className="text-sm font-bold text-[var(--brand)] group-hover:text-[var(--link)] underline underline-offset-4 decoration-2">
                        {item.title}
                      </div>
                      <p className="text-xs text-[var(--text)] mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </LocaleLink>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {/* Mobile Accordion Drawer (< 1024px, Zero Photos) */}
      {mobileOpen ? (
        <div className="lg:hidden bg-[var(--bg)] text-[var(--brand-ink)] border-b border-[var(--hairline)] shadow-[var(--shadow-hard)]">
          <div className="px-4 py-4 space-y-4">
            {/* LocaleSwitcher at top */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--hairline)]">
              <span className="text-xs font-bold text-[var(--text)]">
                {data.mobileMenu.languageLabel}
              </span>
              <LocaleSwitcher />
            </div>

            {/* Single-open Accordion: Exams */}
            <div className="border-b border-[var(--hairline)] pb-2">
              <button
                type="button"
                aria-expanded={mobileAccordion === 'exams'}
                onClick={() =>
                  setMobileAccordion((prev) => (prev === 'exams' ? null : 'exams'))
                }
                className="w-full min-h-[44px] flex items-center justify-between text-left font-bold text-base text-[var(--brand-ink)] cursor-pointer"
              >
                <span>{data.triggers.exams}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileAccordion === 'exams' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {mobileAccordion === 'exams' ? (
                <div className="pt-2 pb-3 pl-2 space-y-4">
                  {data.megaGreIelts.categories.map((cat) => (
                    <div key={cat.id}>
                      <div className="text-xs font-extrabold text-[var(--brand)] mb-1.5">
                        {cat.label}
                      </div>
                      <ul className="space-y-1.5 pl-2">
                        {cat.links.slice(0, 3).map((link) => (
                          <li key={link.title}>
                            <LocaleLink
                              locale={locale}
                              href={link.href}
                              onClick={closeAll}
                              className="block py-1 text-sm font-medium text-[var(--text)] underline underline-offset-4"
                            >
                              {link.title}
                            </LocaleLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>

            {/* Single-open Accordion: Courses */}
            <div className="border-b border-[var(--hairline)] pb-2">
              <button
                type="button"
                aria-expanded={mobileAccordion === 'courses'}
                onClick={() =>
                  setMobileAccordion((prev) => (prev === 'courses' ? null : 'courses'))
                }
                className="w-full min-h-[44px] flex items-center justify-between text-left font-bold text-base text-[var(--brand-ink)] cursor-pointer"
              >
                <span>{data.triggers.courses}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileAccordion === 'courses' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {mobileAccordion === 'courses' ? (
                <ul className="pt-2 pb-3 pl-2 space-y-2">
                  {data.megaCourses.col2Links.map((link) => (
                    <li key={link.href}>
                      <LocaleLink
                        locale={locale}
                        href={link.href}
                        onClick={closeAll}
                        className="block py-1 text-sm font-medium text-[var(--text)] underline underline-offset-4"
                      >
                        {link.label}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Single-open Accordion: Practice */}
            <div className="border-b border-[var(--hairline)] pb-2">
              <button
                type="button"
                aria-expanded={mobileAccordion === 'practice'}
                onClick={() =>
                  setMobileAccordion((prev) => (prev === 'practice' ? null : 'practice'))
                }
                className="w-full min-h-[44px] flex items-center justify-between text-left font-bold text-base text-[var(--brand-ink)] cursor-pointer"
              >
                <span>{data.triggers.practice}</span>
                <ChevronDown
                  className={`h-5 w-5 transition-transform ${
                    mobileAccordion === 'practice' ? 'rotate-180' : ''
                  }`}
                  aria-hidden="true"
                />
              </button>
              {mobileAccordion === 'practice' ? (
                <ul className="pt-2 pb-3 pl-2 space-y-2">
                  {data.megaPractice.links.map((link) => (
                    <li key={link.title}>
                      <LocaleLink
                        locale={locale}
                        href={link.href}
                        onClick={closeAll}
                        className="block py-1 text-sm font-medium text-[var(--text)] underline underline-offset-4"
                      >
                        {link.title}
                      </LocaleLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            {/* Direct Link: Pricing */}
            <div className="border-b border-[var(--hairline)] pb-2">
              <LocaleLink
                locale={locale}
                href="/pricing"
                onClick={closeAll}
                className="min-h-[44px] flex items-center font-bold text-base text-[var(--brand-ink)]"
              >
                {data.triggers.pricing}
              </LocaleLink>
            </div>

            {/* Utility Links */}
            <div className="space-y-2 pt-1">
              {data.utilityLinks.map((item) => (
                <LocaleLink
                  key={item.href}
                  locale={locale}
                  href={item.href}
                  onClick={closeAll}
                  className="block py-1.5 text-sm font-semibold text-[var(--link)] underline underline-offset-4"
                >
                  {item.label}
                </LocaleLink>
              ))}
            </div>

            {/* Primary Mobile CTA */}
            <div className="pt-2">
              <LocaleLink
                locale={locale}
                href={data.mainCta.href}
                onClick={closeAll}
                className="w-full bg-[var(--brand)] text-white font-semibold text-sm rounded-[4px] px-5 py-3 min-h-[44px] inline-flex items-center justify-center"
              >
                {data.mainCta.label}
              </LocaleLink>
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}

export interface InstitutionalFooterProps {
  locale: NavLocale;
}

export function InstitutionalFooter({ locale }: InstitutionalFooterProps) {
  const data = NAV_DATA[locale].footer;

  return (
    <footer className="bg-[var(--brand-deep)] text-white border-t-4 border-[var(--accent)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        {/* Single Payment & Trust Bar */}
        <div className="mb-10">
          <BangladeshPaymentTrustBar variant="footer" locale={locale} />
        </div>

        {/* Mobile Collapsible Columns (< 768px) */}
        <div className="md:hidden divide-y divide-white/20 border-y border-white/20">
          {data.columns.map((col) => (
            <details key={col.heading} className="group py-3">
              <summary className="flex items-center justify-between cursor-pointer list-none font-bold text-sm text-white min-h-[44px]">
                <span>{col.heading}</span>
                <span aria-hidden="true" className="text-lg font-bold">
                  +
                </span>
              </summary>
              <ul className="pt-2 pb-3 space-y-2.5 text-sm text-white/85">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <LocaleLink
                        locale={locale}
                        href={link.href}
                        className="hover:text-white underline underline-offset-4"
                      >
                        {link.label}
                      </LocaleLink>
                    ) : link.isEmail ? (
                      <a
                        href={`mailto:${link.label}`}
                        className="hover:text-white underline underline-offset-4"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span>{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          ))}
        </div>

        {/* Desktop 4-Column Grid (>= 768px) */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-8">
          {data.columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-sm font-bold text-white mb-4">{col.heading}</h3>
              <ul className="space-y-2.5 text-sm text-white/85">
                {col.links.map((link) => (
                  <li key={link.label}>
                    {link.href ? (
                      <LocaleLink
                        locale={locale}
                        href={link.href}
                        className="hover:text-white underline underline-offset-4"
                      >
                        {link.label}
                      </LocaleLink>
                    ) : link.isEmail ? (
                      <a
                        href={`mailto:${link.label}`}
                        className="hover:text-white underline underline-offset-4"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <span>{link.label}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* ETS / British Council / IDP / Cambridge Non-Affiliation Notice */}
        <div className="mt-10 pt-8 border-t border-white/20 text-xs text-white/80 leading-relaxed space-y-2">
          <p>{data.disclaimerP1}</p>
          <p>{data.disclaimerP2}</p>
          <p className="pt-2 font-semibold text-white">{data.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
