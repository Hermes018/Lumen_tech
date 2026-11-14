/** @purpose Interactive GRE Raw-to-Scaled Score & Adaptive Routing Calculator in Pearl/Crimson institutional design */
'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { rawToGreScaled, grePercentile } from '@lumen/core';
import { LocaleLink } from '../../../_components/LocaleLink';
import { ArrowRight, BarChart3, Info } from 'lucide-react';

function getAdaptivePanel(sec1Score: number, isBn: boolean) {
  if (sec1Score >= 9) {
    return {
      tier: isBn ? 'হার্ড প্যানেল (Hard)' : 'Hard Panel',
      tone: 'border-emerald-700 bg-emerald-50/70 text-emerald-900',
    };
  }
  if (sec1Score >= 5) {
    return {
      tier: isBn ? 'মিডিয়াম প্যানেল (Medium)' : 'Medium Panel',
      tone: 'border-[var(--hairline)] bg-[var(--bg-warm)] text-[var(--brand-ink)]',
    };
  }
  return {
    tier: isBn ? 'ইজি প্যানেল (Easy)' : 'Easy Panel',
    tone: 'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand)]',
  };
}

export default function GreScoreCalculatorPage() {
  const hookLocale = useLocale();
  const isBn = hookLocale === 'bn';

  const [verbalSec1, setVerbalSec1] = React.useState<number>(8);
  const [verbalSec2, setVerbalSec2] = React.useState<number>(10);
  const [quantSec1, setQuantSec1] = React.useState<number>(9);
  const [quantSec2, setQuantSec2] = React.useState<number>(11);
  const [awaScore, setAwaScore] = React.useState<number>(4.5);

  const verbalRaw = verbalSec1 + verbalSec2;
  const quantRaw = quantSec1 + quantSec2;

  const verbalResult = React.useMemo(() => rawToGreScaled(verbalRaw, 27, 'verbal'), [verbalRaw]);
  const quantResult = React.useMemo(() => rawToGreScaled(quantRaw, 27, 'quant'), [quantRaw]);
  const awaPercentile = React.useMemo(() => grePercentile(awaScore, 'awa'), [awaScore]);

  const verbalPanel = getAdaptivePanel(verbalSec1, isBn);
  const quantPanel = getAdaptivePanel(quantSec1, isBn);
  const totalScore = verbalResult.scaled + quantResult.scaled;

  let competitivenessLabel = isBn
    ? 'প্রতিযোগিতামূলক (শীর্ষ ২৫%)'
    : 'Competitive (Top 25%)';
  if (totalScore >= 330) {
    competitivenessLabel = isBn
      ? 'এলিট স্তর (শীর্ষ ২% — MIT/Stanford মান)'
      : 'Elite Tier (Top 2% — Harvard/MIT/Stanford Calibre)';
  } else if (totalScore >= 320) {
    competitivenessLabel = isBn
      ? 'উচ্চতর স্তর (শীর্ষ ১০% — শীর্ষ ৩০ ইউএস প্রোগ্রাম)'
      : 'Very High (Top 10% — Top 30 US Grad Programmes)';
  } else if (totalScore < 305) {
    competitivenessLabel = isBn
      ? 'ভিত্তি মজবুত করা প্রয়োজন (< ৫০তম পার্সেন্টাইল)'
      : 'Foundation Building Needed (< 50th Percentile)';
  }

  return (
    <main className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <header className="border-b border-[var(--hairline)] pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-3 py-1 font-mono text-xs font-bold text-[var(--brand)]">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>{isBn ? 'সংক্ষিপ্ত জিআরই ক্যালকুলেটর (২৭ + ২৭)' : 'SHORTER GRE CALCULATOR (27 + 27)'}</span>
          </div>
          <h1 className="lumen-h1">
            {isBn
              ? 'GRE® র-টু-স্কেলড স্কোর ও পার্সেন্টাইল ক্যালকুলেটর'
              : 'GRE® Raw-to-Scaled Score & Adaptive Calculator'}
          </h1>
          <p className="lumen-body">
            {isBn
              ? 'সেকশন ১ (১২টি প্রশ্ন) এবং সেকশন ২ (১৫টি প্রশ্ন)-এর সঠিক উত্তর থেকে রিয়েল-টাইম অ্যাডাপটিভ প্যানেল, ২৬০–৩৪০ স্কেলড স্কোর এবং পার্সেন্টাইল র‍্যাঙ্ক হিসাব করুন।'
              : 'Estimate your 260–340 scaled score, adaptive Section 2 routing panel (Easy / Medium / Hard), and ETS percentile rank from Section 1 (0–12) and Section 2 (0–15) raw scores.'}
          </p>
        </header>

        {/* 12-Col Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Section 1 & 2 Sliders */}
          <section className="lg:col-span-7 bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-8">
            <div className="border-b border-[var(--hairline)] pb-4">
              <h2 className="lumen-h3">
                {isBn ? 'সেকশন অনুযায়ী সঠিক উত্তর দিন' : 'Enter Section-by-Section Raw Scores'}
              </h2>
            </div>

            {/* Verbal Reasoning */}
            <div className="space-y-5 border-b border-[var(--hairline)] pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--brand-ink)]">
                  {isBn ? 'ভার্বাল রিজনিং (Verbal)' : 'Verbal Reasoning'}
                </span>
                <span className={`rounded-[4px] border px-2.5 py-0.5 font-mono text-xs font-bold ${verbalPanel.tone}`}>
                  {verbalPanel.tier}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{isBn ? 'ভার্বাল সেকশন ১ (রাউটিং):' : 'Verbal Section 1 (Routing):'}</span>
                  <span className="font-mono font-bold text-[var(--brand)]">{verbalSec1} / 12</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  value={verbalSec1}
                  onChange={(e) => setVerbalSec1(Number(e.target.value))}
                  aria-label="Verbal Section 1 Score"
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{isBn ? 'ভার্বাল সেকশন ২ (অ্যাডাপটিভ):' : 'Verbal Section 2 (Adaptive):'}</span>
                  <span className="font-mono font-bold text-[var(--brand)]">{verbalSec2} / 15</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={verbalSec2}
                  onChange={(e) => setVerbalSec2(Number(e.target.value))}
                  aria-label="Verbal Section 2 Score"
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
              </div>
            </div>

            {/* Quantitative Reasoning */}
            <div className="space-y-5 border-b border-[var(--hairline)] pb-6">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--brand-ink)]">
                  {isBn ? 'কোয়ান্টিটেটিভ রিজনিং (Quant)' : 'Quantitative Reasoning'}
                </span>
                <span className={`rounded-[4px] border px-2.5 py-0.5 font-mono text-xs font-bold ${quantPanel.tone}`}>
                  {quantPanel.tier}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{isBn ? 'কোয়ান্ট সেকশন ১ (রাউটিং):' : 'Quant Section 1 (Routing):'}</span>
                  <span className="font-mono font-bold text-[var(--brand)]">{quantSec1} / 12</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={12}
                  value={quantSec1}
                  onChange={(e) => setQuantSec1(Number(e.target.value))}
                  aria-label="Quant Section 1 Score"
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span>{isBn ? 'কোয়ান্ট সেকশন ২ (অ্যাডাপটিভ):' : 'Quant Section 2 (Adaptive):'}</span>
                  <span className="font-mono font-bold text-[var(--brand)]">{quantSec2} / 15</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={15}
                  value={quantSec2}
                  onChange={(e) => setQuantSec2(Number(e.target.value))}
                  aria-label="Quant Section 2 Score"
                  className="w-full accent-[var(--brand)] cursor-pointer"
                />
              </div>
            </div>

            {/* AWA Selector */}
            <div className="space-y-3">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-[var(--brand-ink)]">
                  {isBn ? 'অ্যানালিটিক্যাল রাইটিং (AWA):' : 'Analytical Writing (AWA):'}
                </span>
                <span className="font-mono font-bold text-[var(--brand)]">{awaScore.toFixed(1)} / 6.0</span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {[3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAwaScore(val)}
                    className={`rounded-[4px] border py-2 font-mono text-xs font-bold transition-colors cursor-pointer ${
                      awaScore === val
                        ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                        : 'border-[var(--hairline)] bg-[var(--bg)] text-[var(--brand-ink)] hover:bg-[var(--bg-warm)]'
                    }`}
                  >
                    {val.toFixed(1)}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Right 5 Columns: Scaled Score Ledger */}
          <aside className="lg:col-span-5 bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[var(--hairline)] pb-4">
              <h2 className="lumen-h3">
                {isBn ? 'অনুমিত স্কেলড স্কোর' : 'Estimated Scaled Score'}
              </h2>
            </div>

            {/* Total Score */}
            <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-6 text-center space-y-2">
              <div className="font-mono text-xs font-bold text-[var(--text)]">
                {isBn ? 'মোট জিআরই স্কোর (২৬০–৩৪০)' : 'COMBINED GRE SCORE (260–340)'}
              </div>
              <div className="font-mono text-5xl font-black text-[var(--brand)]">{totalScore}</div>
              <div className="text-xs font-bold text-[var(--brand-ink)] pt-1">{competitivenessLabel}</div>
            </div>

            {/* Section Breakdown */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3">
                <div className="text-[11px] font-bold text-[var(--text)]">Quant</div>
                <div className="font-mono text-2xl font-extrabold text-[var(--brand-ink)] mt-1">
                  {quantResult.scaled}
                </div>
                <div className="font-mono text-[11px] text-[var(--brand)]">
                  {quantResult.percentile}th %ile
                </div>
              </div>
              <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3">
                <div className="text-[11px] font-bold text-[var(--text)]">Verbal</div>
                <div className="font-mono text-2xl font-extrabold text-[var(--brand-ink)] mt-1">
                  {verbalResult.scaled}
                </div>
                <div className="font-mono text-[11px] text-[var(--brand)]">
                  {verbalResult.percentile}th %ile
                </div>
              </div>
              <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3">
                <div className="text-[11px] font-bold text-[var(--text)]">AWA</div>
                <div className="font-mono text-2xl font-extrabold text-[var(--brand-ink)] mt-1">
                  {awaScore.toFixed(1)}
                </div>
                <div className="font-mono text-[11px] text-[var(--brand)]">
                  {awaPercentile}th %ile
                </div>
              </div>
            </div>

            {/* CTA to Diagnostic */}
            <div className="space-y-3 pt-2">
              <LocaleLink
                href="/exam/diagnostic"
                className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand)] py-3.5 px-4 text-sm font-bold text-white hover:bg-[var(--link)] transition-colors"
              >
                <span>
                  {isBn ? 'ফ্রি ১৫-মিনিটের অ্যাডাপটিভ ডায়াগনস্টিক দিন' : 'Take Free 15-Min Adaptive Diagnostic'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </LocaleLink>

              <div className="flex items-start gap-2 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3 text-[11px] text-[var(--text)]">
                <Info className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'স্কোরগুলো সংক্ষিপ্ত জিআরই রাশ/আইআরটি মডেল অনুযায়ী অনুমিত। এটি কোনো অফিসিয়াল ইটিএস স্কোর নয়।'
                    : 'Estimated using shorter-GRE Rasch/IRT scaling. Official ETS scores may vary slightly.'}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
