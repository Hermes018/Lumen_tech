/** @purpose Interactive IELTS 4-Skill Band Score & CEFR Calculator in Pearl/Crimson institutional design */
'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { calculateIeltsOverallBand, ieltsRawToBand } from '@lumen/core';
import { LocaleLink } from '../../../_components/LocaleLink';
import { ArrowRight, BarChart3, Info } from 'lucide-react';

const BAND_OPTIONS = [9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.0];

export default function IeltsBandCalculatorPage() {
  const hookLocale = useLocale();
  const isBn = hookLocale === 'bn';

  const [track, setTrack] = React.useState<'academic' | 'general'>('academic');
  const [listeningRaw, setListeningRaw] = React.useState<number>(33);
  const [readingRaw, setReadingRaw] = React.useState<number>(31);
  const [writingBand, setWritingBand] = React.useState<number>(6.5);
  const [speakingBand, setSpeakingBand] = React.useState<number>(7.0);

  const listeningBand = React.useMemo(
    () => ieltsRawToBand(listeningRaw, 'listening'),
    [listeningRaw]
  );
  const readingBand = React.useMemo(
    () =>
      ieltsRawToBand(
        readingRaw,
        track === 'academic' ? 'reading_academic' : 'reading_general'
      ),
    [readingRaw, track]
  );

  const result = React.useMemo(
    () =>
      calculateIeltsOverallBand({
        listening: listeningBand,
        reading: readingBand,
        writing: writingBand,
        speaking: speakingBand,
      }),
    [listeningBand, readingBand, writingBand, speakingBand]
  );

  return (
    <main className="min-h-screen w-full bg-[var(--bg)] text-[var(--text)] py-12 lg:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <header className="border-b border-[var(--hairline)] pb-6 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-3 py-1 font-mono text-xs font-bold text-[var(--brand)]">
            <BarChart3 className="h-3.5 w-3.5" />
            <span>{isBn ? 'অফিসিয়াল ০.৫ রাউন্ডিং ইঞ্জিন' : 'OFFICIAL 0.5 BAND ROUNDING ENGINE'}</span>
          </div>
          <h1 className="lumen-h1">
            {isBn
              ? 'IELTS® ৪-দক্ষতা ব্যান্ড ও CEFR ক্যালকুলেটর'
              : 'IELTS® 4-Skill Band & CEFR Calculator'}
          </h1>
          <p className="lumen-body">
            {isBn
              ? 'লিসেনিং ও রিডিং র-স্কোর (০–৪০) এবং রাইটিং ও স্পিকিং ব্যান্ড থেকে নির্ভুল ০.৫-রাউন্ডেড ওভারঅল ব্যান্ড স্কোর ও CEFR লেভেল (B1–C2) হিসাব করুন।'
              : 'Compute your exact 0.5-rounded Overall IELTS Band Score and CEFR level (B1–C2) from Listening & Reading raw scores (0–40) plus Writing and Speaking bands.'}
          </p>
        </header>

        {/* 12-Col Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 7 Columns: Inputs */}
          <section className="lg:col-span-7 bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-4">
              <h2 className="lumen-h3">
                {isBn ? 'সেকশন স্কোর নির্বাচন করুন' : 'Enter Section Scores'}
              </h2>
              <div className="inline-flex rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setTrack('academic')}
                  className={`rounded-[4px] px-3 py-1 font-bold transition-colors cursor-pointer ${
                    track === 'academic'
                      ? 'bg-[var(--brand)] text-white'
                      : 'text-[var(--text)] hover:text-[var(--brand-ink)]'
                  }`}
                >
                  {isBn ? 'একাডেমিক' : 'Academic'}
                </button>
                <button
                  type="button"
                  onClick={() => setTrack('general')}
                  className={`rounded-[4px] px-3 py-1 font-bold transition-colors cursor-pointer ${
                    track === 'general'
                      ? 'bg-[var(--brand)] text-white'
                      : 'text-[var(--text)] hover:text-[var(--brand-ink)]'
                  }`}
                >
                  {isBn ? 'জেনারেল ট্রেনিং' : 'General Training'}
                </button>
              </div>
            </div>

            {/* Listening Raw Slider (0-40) */}
            <div className="space-y-2 border-b border-[var(--hairline)] pb-5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[var(--brand-ink)]">
                  {isBn ? 'লিসেনিং র-স্কোর (০–৪০):' : 'Listening Raw Score (0–40):'}
                </span>
                <span className="font-mono text-[var(--brand)]">
                  {listeningRaw}/40 → Band {listeningBand.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={listeningRaw}
                onChange={(e) => setListeningRaw(Number(e.target.value))}
                aria-label="Listening Raw Score"
                className="w-full accent-[var(--brand)] cursor-pointer"
              />
            </div>

            {/* Reading Raw Slider (0-40) */}
            <div className="space-y-2 border-b border-[var(--hairline)] pb-5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-[var(--brand-ink)]">
                  {isBn
                    ? `রিডিং র-স্কোর (${track === 'academic' ? 'একাডেমিক' : 'জেনারেল'}, ০–৪০):`
                    : `Reading Raw Score (${track === 'academic' ? 'Academic' : 'General'}, 0–40):`}
                </span>
                <span className="font-mono text-[var(--brand)]">
                  {readingRaw}/40 → Band {readingBand.toFixed(1)}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                value={readingRaw}
                onChange={(e) => setReadingRaw(Number(e.target.value))}
                aria-label="Reading Raw Score"
                className="w-full accent-[var(--brand)] cursor-pointer"
              />
            </div>

            {/* Writing & Speaking Band Selectors */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[var(--brand-ink)] mb-1.5">
                  {isBn ? 'রাইটিং ব্যান্ড (০.০–৯.০)' : 'Writing Band (0.0–9.0)'}
                </label>
                <select
                  value={writingBand}
                  onChange={(e) => setWritingBand(Number(e.target.value))}
                  aria-label="Writing Band"
                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 font-mono text-sm font-bold text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                >
                  {BAND_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      Band {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[var(--brand-ink)] mb-1.5">
                  {isBn ? 'স্পিকিং ব্যান্ড (০.০–৯.০)' : 'Speaking Band (0.0–9.0)'}
                </label>
                <select
                  value={speakingBand}
                  onChange={(e) => setSpeakingBand(Number(e.target.value))}
                  aria-label="Speaking Band"
                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5 font-mono text-sm font-bold text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                >
                  {BAND_OPTIONS.map((b) => (
                    <option key={b} value={b}>
                      Band {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* Right 5 Columns: Result Ledger */}
          <aside className="lg:col-span-5 bg-[var(--surface-paper)] border border-[var(--hairline)] p-6 sm:p-8 space-y-6">
            <div className="border-b border-[var(--hairline)] pb-4">
              <h2 className="lumen-h3">
                {isBn ? 'ওভারঅল ব্যান্ড ফলাফল' : 'Overall Band Result'}
              </h2>
            </div>

            <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-6 text-center space-y-2">
              <div className="font-mono text-xs font-bold text-[var(--text)]">
                {isBn ? 'ওভারঅল ব্যান্ড স্কোর' : 'OVERALL IELTS BAND'}
              </div>
              <div className="font-mono text-5xl font-black text-[var(--brand)]">
                {result.overallBand.toFixed(1)}
              </div>
              <div className="inline-block rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-1 font-mono text-xs font-bold text-[var(--brand-ink)]">
                CEFR {result.cefrLevel} • {isBn ? 'গড়' : 'Raw Avg'}: {result.rawAverage.toFixed(2)}
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'L', val: listeningBand },
                { label: 'R', val: readingBand },
                { label: 'W', val: writingBand },
                { label: 'S', val: speakingBand },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-2.5"
                >
                  <div className="text-[11px] font-bold text-[var(--text)]">{item.label}</div>
                  <div className="font-mono text-lg font-extrabold text-[var(--brand-ink)]">
                    {item.val.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3 pt-2">
              <LocaleLink
                href="/exam/ielts-preview"
                className="flex w-full items-center justify-center gap-2 rounded-[4px] bg-[var(--brand)] py-3.5 px-4 text-sm font-bold text-white hover:bg-[var(--link)] transition-colors"
              >
                <span>
                  {isBn
                    ? 'সিডি-আইইএলটিএস স্প্লিট-স্ক্রিন সিমুলেটর দেখুন'
                    : 'Try CD-IELTS Split-Screen Simulator'}
                </span>
                <ArrowRight className="h-4 w-4" />
              </LocaleLink>

              <div className="flex items-start gap-2 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3 text-[11px] text-[var(--text)]">
                <Info className="h-4 w-4 text-[var(--accent)] shrink-0 mt-0.5" />
                <span>
                  {isBn
                    ? 'অফিসিয়াল ০.২৫ → ০.৫ এবং ০.৭৫ → ১.০ রাউন্ডিং নিয়ম অনুসরণ করে হিসাবকৃত।'
                    : 'Calculated using official 0.25 → 0.5 and 0.75 → 1.0 band rounding rules.'}
                </span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
