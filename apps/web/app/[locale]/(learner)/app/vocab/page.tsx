/** @purpose Active Recall Vocabulary & Formula Decks (/app/vocab) in Claude Editorial Ledger aesthetic */
import { getLocale } from 'next-intl/server';
import { GRE_VOCAB_SEED_WORDS } from '@lumen/db';
import { fetchVocabCards } from '@/app/actions/practice';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  WorkspaceLedger,
  WorkspaceLedgerRow,
  WorkspaceProgressBar,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
} from '@/src/components/ui/WorkspacePrimitives';

export const dynamic = 'force-dynamic';

export default async function VocabHubPage() {
  const [cards, locale] = await Promise.all([
    fetchVocabCards(20).catch(() => GRE_VOCAB_SEED_WORDS.slice(0, 20)),
    getLocale(),
  ]);
  const isBn = locale === 'bn';

  const studyModes = [
    {
      href: '/app/vocab/play?mode=flip',
      modeEn: 'Mode 1 · Classic Flip',
      modeBn: 'মোড ১ · ক্লাসিক ফ্লিপ',
      descEn: 'Word, part of speech, Bangla gloss, mnemonic hooks, and 4-button FSRS rating.',
      descBn: 'শব্দ, বাংলা অর্থ, মনে রাখার কৌশল এবং ৪-বোতামের এফএসআরএস রেটিং।',
    },
    {
      href: '/app/vocab/play?mode=cloze',
      modeEn: 'Mode 2 · Cloze Context',
      modeBn: 'মোড ২ · ক্লোজ কনটেক্সট',
      descEn: 'GRE-style sentences with blanks to sharpen contextual sentence completion recall.',
      descBn: 'শূন্যস্থান পূরণসহ জিআরই বাক্যে শব্দের প্রয়োগ ও সক্রিয় স্মরণ পরীক্ষা।',
    },
    {
      href: '/app/vocab/play?mode=se_pair_drill',
      modeEn: 'Mode 3 · 15s Synonym Pair',
      modeBn: 'মোড ৩ · ১৫ সেকেন্ড সমার্থক জোড়া',
      descEn: '15-second countdown timer. Identify the 2 exact synonym choices before time runs out.',
      descBn: '১৫ সেকেন্ডের টাইমার। সময় শেষ হওয়ার আগে সঠিক ২টি সমার্থক শব্দ বাছাই করুন।',
    },
    {
      href: '/app/vocab/play?mode=quant_formula',
      modeEn: 'Mode 4 · Quant Formulas & Traps',
      modeBn: 'মোড ৪ · কোয়ান্ট সূত্র ও ফাঁদ',
      descEn: 'Geometry theorems, exponent laws, and Quantitative Comparison trap checklists.',
      descBn: 'জ্যামিতির উপপাদ্য, সূচক নিয়ম এবং কোয়ান্ট তুলনার সতর্কতা চেকলিস্ট।',
    },
  ];

  const curatedDecks = [
    {
      id: 'core-1000',
      titleEn: 'GRE High-Frequency Core 1000',
      titleBn: 'জিআরই হাই-ফ্রিকোয়েন্সি কোর ১০০০',
      subEn: 'Bangla glosses + IPA included · Tier 1 Common',
      subBn: 'বাংলা অর্থ ও উচ্চারণ সংযুক্ত · স্তর ১ কমন',
      value: cards.length,
      max: 30,
      tone: 'crimson' as const,
      href: '/app/vocab/play?deck=core-1000',
      ctaEn: 'Review Due →',
      ctaBn: 'বাকি রিভিউ →',
    },
    {
      id: 'se-clusters',
      titleEn: 'Sentence Equivalence Clusters',
      titleBn: 'সেন্টেন্স ইকুইভ্যালেন্স ক্লাস্টার',
      subEn: '15s speed drill practice · Synonym Pairs',
      subBn: '১৫ সেকেন্ড স্পিড ড্রিল অনুশীলন · সমার্থক জোড়া',
      value: 12,
      max: 50,
      tone: 'espresso' as const,
      href: '/app/vocab/play?mode=se_pair_drill',
      ctaEn: 'Start Drill →',
      ctaBn: 'ড্রিল শুরু করুন →',
    },
  ];

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'সক্রিয় স্মরণ ভোকাবুলারি ও সূত্র ডেক' : 'Active Recall Vocabulary & Formula Decks'}
        subtitle={
          isBn
            ? '৪টি স্টাডি মোডে এফএসআরএস (FSRS v4.5) স্পেসড রিপিটিশন: ফ্লিপ, ক্লোজ, ১৫ সেকেন্ড ড্রিল এবং কোয়ান্ট ফাঁদ।'
            : 'Spaced repetition (FSRS v4.5) across 4 active-recall modes: Flip, Cloze, 15s Synonym Pair, and Quant Traps.'
        }
        primaryAction={{
          label: isBn ? 'দৈনিক ১০-কার্ড রিভিউ শুরু করুন →' : 'Start Daily 10-Card Review →',
          href: '/app/vocab/play?mode=flip',
        }}
        secondaryAction={{
          label: isBn ? 'জিআরই সূত্র শীট দেখুন →' : 'GRE Formula Sheets →',
          href: '/app/gre?tab=formulas',
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: isBn ? '৪৫ বাকি' : '45 Due',
            label: isBn ? 'আজকের এফএসআরএস রিভিউ কার্ড' : 'FSRS Cards Due Today',
          },
          {
            value: String(cards.length),
            label: isBn ? 'সক্রিয় কোর শব্দ লোডকৃত' : 'Core Words Loaded',
          },
          {
            value: isBn ? '৪টি মোড' : '4 Modes',
            label: isBn ? 'ফ্লিপ · ক্লোজ · সমার্থক · সূত্র' : 'Flip · Cloze · Synonym · Formula',
          },
          {
            value: 'FSRS v4.5',
            label: isBn ? 'অ্যাডাপ্টিভ মেমোরি শিডিউলার' : 'Adaptive Memory Scheduler',
          },
        ]}
      />

      <section className="mb-12">
        <WorkspaceSectionTitle
          title={isBn ? 'অধ্যয়ন মোডসমূহ' : 'Study Modes'}
          subtitle={
            isBn
              ? 'কীবোর্ড শর্টকাট (১–৪ ও Space) সমর্থিত সক্রিয় স্মরণ অনুশীলন।'
              : 'Active-recall modes with full keyboard support (keys 1–4 and Space).'
          }
        />

        <WorkspaceLedger>
          {studyModes.map((m) => (
            <WorkspaceLedgerRow
              key={m.href}
              left={
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                    {isBn ? m.modeBn : m.modeEn}
                  </p>
                  <p className="text-xs text-[var(--text)] leading-relaxed">
                    {isBn ? m.descBn : m.descEn}
                  </p>
                </div>
              }
              right={
                <LocaleLink
                  href={m.href}
                  className="text-sm font-medium text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)] leading-relaxed"
                >
                  {isBn ? 'মোড চালু করুন →' : 'Play Mode →'}
                </LocaleLink>
              }
            />
          ))}
        </WorkspaceLedger>
      </section>

      <section>
        <WorkspaceSectionTitle
          title={isBn ? 'সক্রিয় কিউরেটেড ডেক' : 'Active Curated Decks'}
        />

        <WorkspaceLedger>
          {curatedDecks.map((deck) => (
            <WorkspaceLedgerRow
              key={deck.id}
              left={
                <div className="space-y-2 max-w-md">
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                      {isBn ? deck.titleBn : deck.titleEn}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {isBn ? deck.subBn : deck.subEn}
                    </p>
                  </div>
                  <WorkspaceProgressBar
                    value={deck.value}
                    max={deck.max}
                    tone={deck.tone}
                    label={isBn ? deck.titleBn : deck.titleEn}
                  />
                </div>
              }
              right={
                <>
                  <span className="font-mono text-xs text-[var(--text-muted)]">
                    {deck.value} / {deck.max}
                  </span>
                  <LocaleLink
                    href={deck.href}
                    className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
                  >
                    {isBn ? deck.ctaBn : deck.ctaEn}
                  </LocaleLink>
                </>
              }
            />
          ))}
        </WorkspaceLedger>
      </section>
    </WorkspaceContainer>
  );
}
