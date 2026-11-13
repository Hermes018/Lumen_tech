/** @purpose Interactive IELTS 4-Skill Band Score & CEFR Level Calculator lead magnet */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { calculateIeltsOverallBand, ieltsRawToBand } from '@lumen/core';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  BarChart3,
  ArrowRight,
  Info,
  GraduationCap,
} from 'lucide-react';

export default function IeltsBandCalculatorPage() {
  const [mode, setMode] = React.useState<'bands' | 'raw'>('bands');
  const [track, setTrack] = React.useState<'academic' | 'general'>('academic');

  // Direct band states
  const [listeningBand, setListeningBand] = React.useState<number>(7.5);
  const [readingBand, setReadingBand] = React.useState<number>(7.0);
  const [writingBand, setWritingBand] = React.useState<number>(6.5);
  const [speakingBand, setSpeakingBand] = React.useState<number>(7.0);

  // Raw counts (0-40) for Listening & Reading
  const [listeningRaw, setListeningRaw] = React.useState<number>(33);
  const [readingRaw, setReadingRaw] = React.useState<number>(31);

  // Update bands if raw mode
  const effectiveListening =
    mode === 'raw' ? ieltsRawToBand(listeningRaw, 'listening') : listeningBand;
  const effectiveReading =
    mode === 'raw'
      ? ieltsRawToBand(readingRaw, track === 'academic' ? 'reading_academic' : 'reading_general')
      : readingBand;

  const result = React.useMemo(() => {
    return calculateIeltsOverallBand({
      listening: effectiveListening,
      reading: effectiveReading,
      writing: writingBand,
      speaking: speakingBand,
    });
  }, [effectiveListening, effectiveReading, writingBand, speakingBand]);

  const bandOptions = [9.0, 8.5, 8.0, 7.5, 7.0, 6.5, 6.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.0];

  return (
    <div className="flex flex-col items-center px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="border-accent text-accent gap-1.5 px-3 py-1 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
            Official Rounding Engine
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">
            IELTS® 4-Skill Band Calculator
          </h1>
          <p className="text-fg-muted text-base max-w-2xl mx-auto">
            Calculate your official IELTS Overall Band Score and European CEFR Level with the
            authentic 0.25 / 0.75 decimal rounding formula.
          </p>

          <div className="flex justify-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setMode('bands')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'bands'
                  ? 'bg-accent text-accent-fg shadow-sm'
                  : 'bg-surface text-fg-muted border border-border hover:text-fg'
              }`}
            >
              Skill Band Mode (0 - 9.0)
            </button>
            <button
              type="button"
              onClick={() => setMode('raw')}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-colors ${
                mode === 'raw'
                  ? 'bg-accent text-accent-fg shadow-sm'
                  : 'bg-surface text-fg-muted border border-border hover:text-fg'
              }`}
            >
              Raw Score Mode (0 - 40 questions)
            </button>
          </div>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Inputs */}
          <Card className="border-border bg-surface shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-fg">Enter Section Scores</CardTitle>
                {mode === 'raw' && (
                  <div className="flex items-center gap-1 text-xs">
                    <button
                      type="button"
                      onClick={() => setTrack('academic')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        track === 'academic' ? 'bg-accent/20 text-accent' : 'text-fg-muted'
                      }`}
                    >
                      Academic
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrack('general')}
                      className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                        track === 'general' ? 'bg-accent/20 text-accent' : 'text-fg-muted'
                      }`}
                    >
                      General
                    </button>
                  </div>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-5 pt-6">
              {/* Listening */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-fg">Listening:</span>
                  <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-accent">
                    {mode === 'raw'
                      ? `${listeningRaw} / 40 (Band ${effectiveListening})`
                      : `Band ${listeningBand}`}
                  </span>
                </div>
                {mode === 'raw' ? (
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={listeningRaw}
                    onChange={(e) => setListeningRaw(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                ) : (
                  <select
                    value={listeningBand}
                    onChange={(e) => setListeningBand(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg"
                  >
                    {bandOptions.map((b) => (
                      <option key={b} value={b}>
                        Band {b.toFixed(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Reading */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-fg">Reading:</span>
                  <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-accent">
                    {mode === 'raw'
                      ? `${readingRaw} / 40 (Band ${effectiveReading})`
                      : `Band ${readingBand}`}
                  </span>
                </div>
                {mode === 'raw' ? (
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={readingRaw}
                    onChange={(e) => setReadingRaw(Number(e.target.value))}
                    className="w-full accent-accent cursor-pointer"
                  />
                ) : (
                  <select
                    value={readingBand}
                    onChange={(e) => setReadingBand(Number(e.target.value))}
                    className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg"
                  >
                    {bandOptions.map((b) => (
                      <option key={b} value={b}>
                        Band {b.toFixed(1)}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Writing */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-fg">Writing (Task 1 & 2):</span>
                  <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-accent">
                    Band {writingBand}
                  </span>
                </div>
                <select
                  value={writingBand}
                  onChange={(e) => setWritingBand(Number(e.target.value))}
                  className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg"
                >
                  {bandOptions.map((b) => (
                    <option key={b} value={b}>
                      Band {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speaking */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-fg">Speaking (Parts 1-3):</span>
                  <span className="rounded bg-accent/15 px-2 py-0.5 font-mono text-accent">
                    Band {speakingBand}
                  </span>
                </div>
                <select
                  value={speakingBand}
                  onChange={(e) => setSpeakingBand(Number(e.target.value))}
                  className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg"
                >
                  {bandOptions.map((b) => (
                    <option key={b} value={b}>
                      Band {b.toFixed(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg border border-border/70 bg-canvas p-3 text-xs text-fg-muted flex items-start gap-2">
                <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>
                  Official IELTS rounding: fractional averages of .25 round up to .5; fractional
                  averages of .75 round up to the next full band.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Results Output */}
          <Card className="border-border bg-surface shadow-sm flex flex-col justify-between">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-fg">Projected Band Score</CardTitle>
                <Badge variant="outline" className="border-accent text-accent text-xs">
                  {result.cefrLevel}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Overall Band Banner */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
                <div className="text-xs uppercase font-semibold tracking-wider text-fg-muted">
                  Official Overall Band
                </div>
                <div className="text-6xl font-black tracking-tight text-accent mt-1">
                  {result.overallBand.toFixed(1)}
                </div>
                <div className="mt-2 text-xs text-fg-subtle">
                  Arithmetic Average: <span className="font-mono font-semibold">{result.rawAverage}</span>
                </div>
              </div>

              {/* Skill Pill Breakdown */}
              <div className="grid grid-cols-2 gap-3 text-center text-xs">
                <div className="rounded border border-border bg-canvas p-2.5">
                  <div className="text-fg-muted">Listening</div>
                  <div className="font-bold text-fg text-base mt-0.5">{effectiveListening.toFixed(1)}</div>
                </div>
                <div className="rounded border border-border bg-canvas p-2.5">
                  <div className="text-fg-muted">Reading</div>
                  <div className="font-bold text-fg text-base mt-0.5">{effectiveReading.toFixed(1)}</div>
                </div>
                <div className="rounded border border-border bg-canvas p-2.5">
                  <div className="text-fg-muted">Writing</div>
                  <div className="font-bold text-fg text-base mt-0.5">{writingBand.toFixed(1)}</div>
                </div>
                <div className="rounded border border-border bg-canvas p-2.5">
                  <div className="text-fg-muted">Speaking</div>
                  <div className="font-bold text-fg text-base mt-0.5">{speakingBand.toFixed(1)}</div>
                </div>
              </div>

              {/* CEFR Description */}
              <div className="rounded-lg border border-border bg-canvas p-3 text-xs text-fg">
                <div className="font-semibold text-fg">CEFR Level: {result.cefrLevel}</div>
                <p className="mt-1 text-fg-muted leading-relaxed">
                  {result.overallBand >= 7.5
                    ? 'Exceeds direct entry requirements for Oxford, Cambridge, Ivy League, and Canadian Express Entry CRS maximum points.'
                    : result.overallBand >= 6.5
                    ? 'Qualifies for standard graduate admissions across UK, Australia, Canada, and EU universities.'
                    : 'Foundation preparation recommended to meet standard 6.5/7.0 university thresholds.'}
                </p>
              </div>

              {/* CTA into Diagnostic */}
              <div className="pt-2">
                <Link href="/diagnostic" className="w-full">
                  <Button size="lg" className="w-full gap-2 font-semibold">
                    Take Free IELTS Diagnostic <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-center text-[11px] text-fg-subtle mt-2">
                  Diagnose your real Speaking & Writing band with instant rubric feedback.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* IELTS Rounding Reference Table */}
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-base font-bold text-fg flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-accent" /> Official Rounding Examples
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-canvas text-fg-muted font-semibold">
                    <th className="p-2">Section Scores (L / R / W / S)</th>
                    <th className="p-2">Raw Average</th>
                    <th className="p-2">Official Band</th>
                    <th className="p-2">Applied Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-fg">
                  <tr>
                    <td className="p-2 font-mono">6.5 / 6.5 / 6.0 / 6.0</td>
                    <td className="p-2 font-mono font-semibold">6.25</td>
                    <td className="p-2 font-mono font-bold text-accent">6.5</td>
                    <td className="p-2 text-fg-muted">Ends in .25 &rarr; rounds up to next half band (.5)</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">6.5 / 6.0 / 6.0 / 6.0</td>
                    <td className="p-2 font-mono font-semibold">6.125</td>
                    <td className="p-2 font-mono font-bold text-accent">6.0</td>
                    <td className="p-2 text-fg-muted">Ends in .125 (&lt; .25) &rarr; rounds down to whole band</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">7.0 / 7.0 / 6.5 / 6.5</td>
                    <td className="p-2 font-mono font-semibold">6.75</td>
                    <td className="p-2 font-mono font-bold text-accent">7.0</td>
                    <td className="p-2 text-fg-muted">Ends in .75 &rarr; rounds up to next whole band</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono">7.0 / 6.5 / 6.5 / 6.5</td>
                    <td className="p-2 font-mono font-semibold">6.625</td>
                    <td className="p-2 font-mono font-bold text-accent">6.5</td>
                    <td className="p-2 text-fg-muted">Ends in .625 (&lt; .75) &rarr; rounds down to half band</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
