/** @purpose Vocab Decks overview page (/app/vocab) with Pearl/Bone stationery mode grid & deck progress */
import { getLocale } from 'next-intl/server';
import { ProgressBar } from '@lumen/ui';
import { Brain, Play, ArrowRight } from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { fetchVocabCards } from '@/app/actions/practice';

export const dynamic = 'force-dynamic';

export default async function VocabHubPage() {
  const [cards, locale] = await Promise.all([fetchVocabCards(20), getLocale()]);
  const isBn = locale === 'bn';

  const studyModes = [
    {
      href: '/app/vocab/play?mode=flip',
      tag: isBn ? 'মোড ১' : 'Mode 1',
      title: isBn ? 'ক্লাসিক ফ্লিপ' : 'Classic Flip',
      description: isBn
        ? 'শব্দ, বাংলা অর্থ, মনে রাখার কৌশল এবং ৪-বোতামের এফএসআরএস রেটিং।'
        : 'Word, part of speech, Bangla gloss, mnemonic hooks, and 4-button FSRS rating.',
      accentBorder: 'border-t-[var(--brand)]',
    },
    {
      href: '/app/vocab/play?mode=cloze',
      tag: isBn ? 'মোড ২' : 'Mode 2',
      title: isBn ? 'ক্লোজ কনটেক্সট' : 'Cloze Context',
      description: isBn
        ? 'শূন্যস্থান পূরণ সহ জিআরই বাক্যে শব্দের প্রয়োগ ও সক্রিয় স্মরণ পরীক্ষা।'
        : 'GRE-style sentences with blanks; test your sentence completion recall.',
      accentBorder: 'border-t-[var(--brand-deep)]',
    },
    {
      href: '/app/vocab/play?mode=se_pair_drill',
      tag: isBn ? 'মোড ৩ • গতি' : 'Mode 3 • Speed',
      title: isBn ? '১৫ সেকেন্ড সমার্থক জোড়া' : '15s Synonym Pair',
      description: isBn
        ? '১৫ সেকেন্ডের টাইমার। সময় শেষ হওয়ার আগে সঠিক ২টি সমার্থক শব্দ বাছাই করুন।'
        : '15-second countdown timer. Identify the 2 exact synonym choices before time runs out.',
      accentBorder: 'border-t-[var(--accent)]',
    },
    {
      href: '/app/vocab/play?mode=quant_formula',
      tag: isBn ? 'মোড ৪ • কোয়ান্ট' : 'Mode 4 • Quant',
      title: isBn ? 'কোয়ান্ট সূত্র ও ফাঁদ' : 'Quant Formulas & Traps',
      description: isBn
        ? 'জ্যামিতির উপপাদ্য, সূচক নিয়ম এবং কোয়ান্ট তুলনার সতর্কতা চেকলিস্ট।'
        : 'Geometry theorems, exponent laws, and Quantitative Comparison trap checklists.',
      accentBorder: 'border-t-[var(--terracotta)]',
    },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--hairline)] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--brand)] uppercase">
            <Brain className="h-4 w-4" />
            <span>
              {isBn
                ? 'স্পেসড রিপিটিশন সিস্টেম (FSRS v4.5)'
                : 'Spaced Repetition System (FSRS v4.5)'}
            </span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--brand-ink)]">
            {isBn
              ? 'সক্রিয় স্মরণ ভোকাবুলারি ও সূত্র ডেক'
              : 'Active Recall Vocabulary & Formula Decks'}
          </h1>
          <p className="mt-1 text-sm text-[var(--text)]">
            {isBn
              ? '৪টি স্টাডি মোডে দীর্ঘমেয়াদি স্মৃতি শক্তিশালী করুন: ফ্লিপ, ক্লোজ, ১৫ সেকেন্ড ড্রিল এবং কোয়ান্ট ফাঁদ।'
              : 'Optimize long-term memory with 4 study modes: Flip, Cloze, 15s Synonym Speed Drill, and Quant Traps.'}
          </p>
        </div>

        <LocaleLink
          href="/app/vocab/play?mode=flip"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[4px] bg-[var(--brand)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
        >
          <Play className="h-4 w-4 fill-current" />
          <span>{isBn ? 'দৈনিক ১০-কার্ড রিভিউ শুরু করুন' : 'Start Daily 10-Card Review'}</span>
        </LocaleLink>
      </div>

      {/* 4 Study Mode Selection Grid */}
      <section className="grid divide-y divide-[var(--hairline)] rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] sm:grid-cols-2 sm:divide-x lg:grid-cols-4 lg:divide-y-0">
        {studyModes.map((m) => (
          <LocaleLink
            key={m.href}
            href={m.href}
            className={`group flex flex-col justify-between border-t-4 p-5 transition-colors hover:bg-[var(--bg-warm)]/70 ${m.accentBorder}`}
          >
            <div>
              <span className="inline-block rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-2 py-0.5 text-[11px] font-semibold text-[var(--brand-ink)]">
                {m.tag}
              </span>
              <h2 className="mt-3 text-base font-bold text-[var(--brand-ink)] transition-colors group-hover:text-[var(--brand)]">
                {m.title}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text)]">{m.description}</p>
            </div>
            <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)]">
              <span>{isBn ? 'মোড চালু করুন' : 'Play Mode'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </span>
          </LocaleLink>
        ))}
      </section>

      {/* Available Decks Progress */}
      <section className="space-y-4 pt-2">
        <h2 className="text-lg font-bold text-[var(--brand-ink)]">
          {isBn ? 'সক্রিয় কিউরেটেড ডেক' : 'Active Curated Decks'}
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--hairline)] pb-3">
              <h3 className="text-base font-bold text-[var(--brand-ink)]">
                {isBn ? 'জিআরই হাই-ফ্রিকোয়েন্সি কোর ১০০০' : 'GRE High-Frequency Core 1000'}
              </h3>
              <span className="rounded-[4px] border border-[var(--brand)]/25 bg-[var(--bg-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--brand)]">
                {isBn ? 'স্তর ১: কমন' : 'Tier 1: Common'}
              </span>
            </div>
            <ProgressBar
              value={cards.length}
              max={30}
              label={isBn ? 'সিড ডেক অগ্রগতি (৩০টি মৌলিক শব্দ)' : 'Seed Deck Progress (30 Original Words)'}
            />
            <div className="flex items-center justify-between pt-1 text-xs text-[var(--text)]">
              <span>{isBn ? 'বাংলা অর্থ ও উচ্চারণ সংযুক্ত' : 'Bangla glosses + IPA included'}</span>
              <LocaleLink
                href="/app/vocab/play?deck=core-1000"
                className="inline-flex h-7 items-center rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 text-xs font-semibold text-[var(--brand-ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                {isBn ? 'বাকি রিভিউ' : 'Review Due'}
              </LocaleLink>
            </div>
          </div>

          <div className="space-y-3 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5">
            <div className="flex items-center justify-between gap-2 border-b border-[var(--hairline)] pb-3">
              <h3 className="text-base font-bold text-[var(--brand-ink)]">
                {isBn ? 'সেন্টেন্স ইকুইভ্যালেন্স ক্লাস্টার' : 'Sentence Equivalence Clusters'}
              </h3>
              <span className="rounded-[4px] border border-[var(--accent)]/30 bg-[var(--bg-warm)] px-2 py-0.5 text-xs font-semibold text-[var(--terracotta)]">
                {isBn ? 'সমার্থক জোড়া' : 'Synonym Pairs'}
              </span>
            </div>
            <ProgressBar
              value={12}
              max={50}
              label={isBn ? 'সমার্থক জোড়া নির্ভুলতা' : 'Synonym Pair Accuracy'}
            />
            <div className="flex items-center justify-between pt-1 text-xs text-[var(--text)]">
              <span>{isBn ? '১৫ সেকেন্ড স্পিড ড্রিল অনুশীলন' : '15s speed drill practice'}</span>
              <LocaleLink
                href="/app/vocab/play?mode=se_pair_drill"
                className="inline-flex h-7 items-center rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 text-xs font-semibold text-[var(--brand-ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
              >
                {isBn ? 'ড্রিল শুরু করুন' : 'Start Drill'}
              </LocaleLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
