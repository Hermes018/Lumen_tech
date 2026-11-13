/** @purpose Interactive GRE Raw-to-Scaled & Percentile Calculator lead magnet (wired to @lumen/core scoring) */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { rawToGreScaled, grePercentile } from '@lumen/core';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  BarChart3,
  ArrowRight,
  Info,
  Award,
} from 'lucide-react';

export default function GreScoreCalculatorPage() {
  const [quantRaw, setQuantRaw] = React.useState<number>(20);
  const [verbalRaw, setVerbalRaw] = React.useState<number>(18);
  const [awaScore, setAwaScore] = React.useState<number>(4.5);

  // Compute using @lumen/core Rasch scoring engine
  const quantResult = React.useMemo(() => rawToGreScaled(quantRaw, 27, 'quant'), [quantRaw]);
  const verbalResult = React.useMemo(() => rawToGreScaled(verbalRaw, 27, 'verbal'), [verbalRaw]);
  const awaPercentile = React.useMemo(() => grePercentile(awaScore, 'awa'), [awaScore]);

  const totalScore = quantResult.scaled + verbalResult.scaled;

  let competitivenessBadge = 'Competitive (Top 25%)';
  let competitivenessColor = 'border-accent text-accent';
  if (totalScore >= 330) {
    competitivenessBadge = 'Elite Tier (Top 2% - Harvard/MIT/Stanford Calibre)';
    competitivenessColor = 'border-success text-success';
  } else if (totalScore >= 320) {
    competitivenessBadge = 'Very High (Top 10% - Top 30 US Grad Programmes)';
    competitivenessColor = 'border-accent text-accent';
  } else if (totalScore < 305) {
    competitivenessBadge = 'Foundation Building Needed (< 50th Percentile)';
    competitivenessColor = 'border-warning text-warning';
  }

  return (
    <div className="flex flex-col items-center px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="border-accent text-accent gap-1.5 px-3 py-1 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
            Interactive SEO Tool
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">
            GRE® Raw-to-Scaled & Percentile Calculator
          </h1>
          <p className="text-fg-muted text-base max-w-2xl mx-auto">
            Calculate your estimated 130–170 scaled section scores and global ETS percentiles from
            raw correct counts (Shorter GRE format: 27 Quant / 27 Verbal questions).
          </p>
        </div>

        {/* Calculator Main Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Input Controls */}
          <Card className="border-border bg-surface shadow-sm">
            <CardHeader className="border-b border-border/60 pb-4">
              <CardTitle className="text-lg font-bold text-fg">Enter Your Raw Scores</CardTitle>
              <p className="text-xs text-fg-subtle">
                Shorter GRE consists of 2 Quant sections (12 + 15 = 27 items) and 2 Verbal sections
                (12 + 15 = 27 items).
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-6">
              {/* Quant Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-fg">Quantitative Reasoning Correct:</span>
                  <span className="rounded bg-accent/15 px-2.5 py-0.5 font-mono text-accent">
                    {quantRaw} / 27
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="27"
                  value={quantRaw}
                  onChange={(e) => setQuantRaw(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-fg-subtle">
                  <span>0 (Min)</span>
                  <span>14 (Avg)</span>
                  <span>27 (Max)</span>
                </div>
              </div>

              {/* Verbal Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-fg">Verbal Reasoning Correct:</span>
                  <span className="rounded bg-accent/15 px-2.5 py-0.5 font-mono text-accent">
                    {verbalRaw} / 27
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="27"
                  value={verbalRaw}
                  onChange={(e) => setVerbalRaw(Number(e.target.value))}
                  className="w-full accent-accent cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-fg-subtle">
                  <span>0 (Min)</span>
                  <span>14 (Avg)</span>
                  <span>27 (Max)</span>
                </div>
              </div>

              {/* AWA Selector */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span className="text-fg">Analytical Writing (AWA):</span>
                  <span className="rounded bg-accent/15 px-2.5 py-0.5 font-mono text-accent">
                    {awaScore.toFixed(1)} / 6.0
                  </span>
                </div>
                <select
                  value={awaScore}
                  onChange={(e) => setAwaScore(Number(e.target.value))}
                  className="w-full rounded-md border border-border bg-canvas px-3 py-2 text-sm text-fg"
                >
                  {[6.0, 5.5, 5.0, 4.5, 4.0, 3.5, 3.0, 2.5, 2.0, 1.5, 1.0, 0.0].map((val) => (
                    <option key={val} value={val}>
                      {val.toFixed(1)} (Score) — {grePercentile(val, 'awa')}th Percentile
                    </option>
                  ))}
                </select>
              </div>

              <div className="rounded-lg border border-border/70 bg-canvas p-3 text-xs text-fg-muted flex items-start gap-2">
                <Info className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                <span>
                  Calibrated via Rasch 1PL Expected A Posteriori (EAP) ability estimation matching
                  official ETS Section-Adaptive curve norms.
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Scaled Output Card */}
          <Card className="border-border bg-surface shadow-sm flex flex-col justify-between">
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold text-fg">Estimated Score Report</CardTitle>
                <Badge variant="outline" className={`text-xs ${competitivenessColor}`}>
                  {competitivenessBadge}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Total Banner */}
              <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 text-center">
                <div className="text-xs uppercase font-semibold tracking-wider text-fg-muted">
                  Total Projected GRE Score
                </div>
                <div className="text-5xl font-black tracking-tight text-accent mt-1">
                  {totalScore}
                  <span className="text-lg font-normal text-fg-muted"> / 340</span>
                </div>
                <div className="mt-2 text-xs text-fg-subtle">
                  Quant: {quantResult.scaled} + Verbal: {verbalResult.scaled}
                </div>
              </div>

              {/* Sub-breakdown */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border border-border bg-canvas p-3">
                  <div className="text-xs text-fg-muted font-medium">Quantitative Scaled</div>
                  <div className="text-2xl font-bold text-fg mt-0.5">
                    {quantResult.scaled}
                    <span className="text-xs font-normal text-fg-subtle"> (130-170)</span>
                  </div>
                  <div className="text-xs font-semibold text-accent mt-1">
                    {quantResult.percentile}th Percentile
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-canvas p-3">
                  <div className="text-xs text-fg-muted font-medium">Verbal Scaled</div>
                  <div className="text-2xl font-bold text-fg mt-0.5">
                    {verbalResult.scaled}
                    <span className="text-xs font-normal text-fg-subtle"> (130-170)</span>
                  </div>
                  <div className="text-xs font-semibold text-accent mt-1">
                    {verbalResult.percentile}th Percentile
                  </div>
                </div>
              </div>

              {/* AWA Box */}
              <div className="rounded-lg border border-border bg-canvas p-3 flex justify-between items-center">
                <div>
                  <div className="text-xs text-fg-muted font-medium">Analytical Writing Measure</div>
                  <div className="text-sm font-semibold text-fg">Score: {awaScore.toFixed(1)} / 6.0</div>
                </div>
                <Badge variant="outline" className="border-border text-fg font-mono text-xs">
                  {awaPercentile}th Percentile
                </Badge>
              </div>

              {/* CTA into Diagnostic */}
              <div className="pt-2">
                <Link href="/diagnostic" className="w-full">
                  <Button size="lg" className="w-full gap-2 font-semibold">
                    Confirm With Real 15-Min Diagnostic <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <p className="text-center text-[11px] text-fg-subtle mt-2">
                  100% Free • Pinpoints your specific trap tendencies & weak question types
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Explanatory Concordance Table */}
        <Card className="border-border bg-surface">
          <CardHeader>
            <CardTitle className="text-base font-bold text-fg flex items-center gap-2">
              <Award className="h-4 w-4 text-accent" /> Official GRE Percentile Benchmarks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-border bg-canvas text-fg-muted font-semibold">
                    <th className="p-2">Scaled Score</th>
                    <th className="p-2">Quant Percentile</th>
                    <th className="p-2">Verbal Percentile</th>
                    <th className="p-2">Typical Target Programmes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60 text-fg">
                  <tr>
                    <td className="p-2 font-mono font-bold">168 - 170</td>
                    <td className="p-2">91% - 96%</td>
                    <td className="p-2">98% - 99%</td>
                    <td className="p-2 text-fg-muted">Top 10 CS/AI, Finance, Stanford, MIT, CMU</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold">163 - 167</td>
                    <td className="p-2">76% - 88%</td>
                    <td className="p-2">92% - 98%</td>
                    <td className="p-2 text-fg-muted">Top 30 Engineering, Ivy League Humanities</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold">158 - 162</td>
                    <td className="p-2">60% - 73%</td>
                    <td className="p-2">79% - 90%</td>
                    <td className="p-2 text-fg-muted">Competitive US State Universities & Europe MS</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-mono font-bold">150 - 157</td>
                    <td className="p-2">34% - 57%</td>
                    <td className="p-2">44% - 75%</td>
                    <td className="p-2 text-fg-muted">Broad Master’s programmes, initial baseline</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-[11px] text-fg-subtle mt-4">
              Disclaimer: Percentiles based on ETS published performance data. Performance in
              computer-based tests depends on multi-stage section adaptation.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
