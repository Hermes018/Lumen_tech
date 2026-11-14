/** @purpose GRE Practice Bank and custom quiz builder (/app/practice) */
import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@lumen/ui';
import { Target, Sparkles, Clock, Filter, ArrowRight, Lightbulb, ShieldAlert } from 'lucide-react';
import { fetchPracticeQuestions } from '@/app/actions/practice';
import type { SeedGreQuestion } from '@lumen/db';

export default async function PracticeDashboardPage() {
  const seedQuestions = await fetchPracticeQuestions({ limit: 12 });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-control/30 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-accent uppercase tracking-wider">
            <Target className="w-4 h-4" />
            Adaptive Practice Engine
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-fg mt-1">
            GRE Custom Practice & Tutor Sessions
          </h1>
          <p className="text-sm text-fg-muted mt-0.5">
            Targeted drills with 3-tier hints, distractor trap diagnostics, and Socratic walkthroughs.
          </p>
        </div>

        <Link href="/app/practice/session-quick-start">
          <Button className="gap-2 shadow-sm">
            <Sparkles className="w-4 h-4" /> Quick 5-Question Drill
          </Button>
        </Link>
      </div>

      {/* Practice Configuration Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Tutor Mode Card */}
        <Card className="relative overflow-hidden border-accent/40 bg-accent-soft/20 flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="default" className="bg-accent text-accent-fg">
                Recommended
              </Badge>
              <Lightbulb className="w-4 h-4 text-accent" />
            </div>
            <CardTitle className="text-lg">Untimed Tutor Mode</CardTitle>
            <p className="text-xs text-fg-muted leading-relaxed">
              Solve at your own pace with 3 progressive hints, distractor trap explanations, and Second-Chance retries.
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="text-xs space-y-1.5 text-fg mb-4">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> 3-tier hint ladder with budget tracking
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> Second-Chance retry on wrong choices
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent" /> &ldquo;Walk Me Through It&rdquo; Socratic solver
              </li>
            </ul>
            <Link href="/app/practice/sess-tutor-all">
              <Button className="w-full gap-1.5 text-xs">
                Start Tutor Drill <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Timed Challenge Mode Card */}
        <Card className="flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="outline">Exam Simulation</Badge>
              <Clock className="w-4 h-4 text-fg-muted" />
            </div>
            <CardTitle className="text-lg">Timed Challenge Mode</CardTitle>
            <p className="text-xs text-fg-muted leading-relaxed">
              Strict GRE CBT section pacing (1m 30s per Quant, 1m 15s per Verbal). Hints capped; no second chances.
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <ul className="text-xs space-y-1.5 text-fg mb-4">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fg-muted" /> Exam timer countdown with alert
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fg-muted" /> On-screen 4-function GRE calculator
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-fg-muted" /> Comprehensive post-drill trap analysis
              </li>
            </ul>
            <Link href="/app/practice/sess-timed-quant">
              <Button variant="secondary" className="w-full gap-1.5 text-xs">
                Start Timed Drill <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Mistake Spaced Retry Queue Card */}
        <Card className="flex flex-col justify-between border-warning/40 bg-warning-soft/10">
          <CardHeader>
            <div className="flex items-center justify-between mb-1">
              <Badge variant="warning">Spaced Error Queue</Badge>
              <ShieldAlert className="w-4 h-4 text-warning" />
            </div>
            <CardTitle className="text-lg">Trap Diagnostic Retries</CardTitle>
            <p className="text-xs text-fg-muted leading-relaxed">
              Re-attempt questions you missed due to Careless Math, Vocab Gaps, or Extreme Distractors on a spaced curve.
            </p>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="rounded-lg bg-surface-2 p-2.5 mb-4 text-xs">
              <div className="font-semibold text-fg">4 Items Due for Review</div>
              <div className="text-fg-muted text-[11px] mt-0.5">
                Next retry intervals: 1d &bull; 3d &bull; 7d &bull; 21d
              </div>
            </div>
            <Link href="/app/practice/sess-error-retry">
              <Button variant="outline" className="w-full gap-1.5 text-xs border-warning/50 text-warning hover:bg-warning-soft">
                Review Error Log Queue <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Seed Questions Library Preview */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-fg-muted" />
            <h2 className="text-base font-semibold text-fg">Curated GRE Practice Items</h2>
          </div>
          <span className="text-xs text-fg-muted">{seedQuestions.length} Items Available</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {seedQuestions.map((q: SeedGreQuestion, idx: number) => {
            const isQuant = q.questionType.startsWith('gre_q') || q.questionType.startsWith('gre_numeric');
            const diffLabel = q.difficultyB < -0.3 ? 'Easy' : q.difficultyB > 0.5 ? 'Hard' : 'Medium';
            const diffVariant = q.difficultyB < -0.3 ? 'success' : q.difficultyB > 0.5 ? 'destructive' : 'warning';

            return (
              <div
                key={q.id}
                className="rounded-xl border border-control bg-surface p-4 shadow-2xs hover:border-accent/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-2">
                    <span className="text-[11px] font-mono text-fg-muted">Item #{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] rounded px-1.5 py-0.2 bg-surface-2 text-fg-muted font-medium">
                        {isQuant ? 'Quant' : 'Verbal'}
                      </span>
                      <span
                        className={`text-[10px] rounded px-1.5 py-0.2 font-semibold ${
                          diffVariant === 'success'
                            ? 'bg-success-soft text-success'
                            : diffVariant === 'destructive'
                              ? 'bg-danger-soft text-danger'
                              : 'bg-warning-soft text-warning'
                        }`}
                      >
                        {diffLabel}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-fg font-medium line-clamp-2 leading-relaxed">
                    {q.promptMd.replace(/\$|\n/g, ' ')}
                  </p>

                  <div className="flex flex-wrap items-center gap-1 mt-3">
                    {q.hints.length > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-accent bg-accent-soft px-1.5 py-0.2 rounded font-medium">
                        <Lightbulb className="w-2.5 h-2.5" /> 3 Hints
                      </span>
                    )}
                    {Object.keys(q.choiceExplanations).length > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-warning bg-warning-soft px-1.5 py-0.2 rounded font-medium">
                        <ShieldAlert className="w-2.5 h-2.5" /> Trap Tags
                      </span>
                    )}
                    {q.steps.length > 0 && (
                      <span className="inline-flex items-center gap-0.5 text-[10px] text-info bg-info-soft px-1.5 py-0.2 rounded font-medium">
                        <Sparkles className="w-2.5 h-2.5" /> Socratic
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-control/30 mt-3 flex items-center justify-between">
                  <span className="text-[11px] text-fg-muted capitalize">
                    {q.topicSlug.replace(/-/g, ' ')}
                  </span>
                  <Link href={`/app/practice/sess-item-${q.id}`}>
                    <Button variant="ghost" size="sm" className="h-7 text-xs px-2 gap-1 text-accent">
                      Practice <ArrowRight className="w-3 h-3" />
                    </Button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
