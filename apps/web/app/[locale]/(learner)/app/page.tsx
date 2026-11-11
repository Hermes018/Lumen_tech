/** @purpose Learner study dashboard home (/app) */
import Link from 'next/link';
import { Button, Card, CardHeader, CardTitle, CardContent, ProgressBar, Callout } from '@lumen/ui';
import { ArrowRight, BookOpen, Brain, PlayCircle, Trophy } from 'lucide-react';

export default function LearnerAppPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-surface border-border flex flex-col justify-between gap-4 rounded-xl border p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <h1 className="text-fg text-2xl font-bold tracking-tight">Welcome back, Ayman</h1>
          <p className="text-fg-muted mt-1 text-sm">
            Target exam date: 15 Dec 2026 • 34 days remaining • Estimated GRE: 318 (Q162, V156)
          </p>
        </div>
        <Link href="/exam/mock-session-01">
          <Button className="shrink-0 gap-2">
            <PlayCircle className="h-4 w-4" /> Resume Sectional Mock
          </Button>
        </Link>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-fg-muted text-xs font-semibold uppercase">
              Quant Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-fg text-2xl font-bold">82%</div>
            <p className="text-success mt-1 text-xs">+4% from last diagnostic</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-fg-muted text-xs font-semibold uppercase">
              Verbal Mastery
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-fg text-2xl font-bold">71%</div>
            <p className="text-warning mt-1 text-xs">Text Completion traps detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-fg-muted text-xs font-semibold uppercase">
              FSRS Vocab Cards
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-fg text-2xl font-bold">480 / 1,500</div>
            <p className="text-accent mt-1 text-xs">45 cards due today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-fg-muted text-xs font-semibold uppercase">
              Avg Pace / Item
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-fg text-2xl font-bold">1m 18s</div>
            <p className="text-fg-muted mt-1 text-xs">Target: &lt; 1m 30s</p>
          </CardContent>
        </Card>
      </div>

      {/* Progress & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-accent h-4 w-4" />
              Active Vocabulary Retention (FSRS)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ProgressBar value={480} max={1500} label="Common GRE Word Deck" />
            <ProgressBar value={120} max={500} label="GregMat Essential Synonyms" />
            <Link href="/app/flashcards" className="inline-block pt-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                Review 45 Due Cards <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="text-warning h-4 w-4" />
              Recommended Practice Drill
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Callout type="trap" title="High Error Rate: Numeric Entry Geometry">
              In your last 3 practice sets, 40% of misses were due to forgetting units conversion in
              multi-step triangle problems.
            </Callout>
            <Link href="/app/practice" className="inline-block pt-1">
              <Button size="sm" className="gap-1.5">
                <BookOpen className="h-3.5 w-3.5" /> Start 10-Item Targeted Drill
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
