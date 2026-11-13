/** @purpose Flagship GRE Marketing showcase highlighting Magoosh + GregMat + Brilliant Parity Suite */
import Link from 'next/link';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Sparkles,
  Brain,
  ShieldAlert,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle,
  BarChart3,
  BookOpen,
} from 'lucide-react';
import { LiveGreWidget } from './live-gre-widget';

export const metadata = {
  title: 'GRE Prep Re-Engineered | Adaptive CBT Mocks & Socratic Pedagogy | Lumen Academy',
  description:
    'Prepare for the GRE with the only platform offering authentic Section-Adaptive CBT Mocks, 3-Tier Hint Ladders, Distractor Trap Diagnostics, and 4-Mode FSRS Spaced Repetition.',
};

export default function GreMarketingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full border-b border-border/40 bg-surface/40 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <Badge variant="outline" className="border-accent text-accent gap-1.5 px-3 py-1 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Magoosh + GregMat + Brilliant Parity Suite
          </Badge>

          <h1 className="text-fg text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto leading-tight">
            The GRE Prep Platform Built for <span className="text-accent">330+ Ambitions</span>
          </h1>

          <p className="text-fg-muted mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed">
            Stop passively watching video lectures. Experience real section-adaptive mock tests,
            progressive hint ladders that preserve your learning, distractor trap forensics, and
            predict-first verbal mastery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/diagnostic">
              <Button size="lg" className="gap-2">
                Take Free 15-Min Express Diagnostic <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="outline" size="lg">
                View GRE Plans & Passes
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-fg-subtle">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" /> 100% Authentic CBT Exam Shell
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" /> 1,500+ High-Frequency Words (FSRS)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" /> Rasch 1PL EAP Ability Scoring
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Section */}
      <section className="w-full max-w-5xl px-4 py-16 sm:py-20 flex flex-col items-center">
        <div className="text-center space-y-2 mb-8">
          <Badge variant="default" className="text-xs">
            Interactive Experience
          </Badge>
          <h2 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            Test Our D13 Interactive Pedagogy in 10 Seconds
          </h2>
          <p className="text-fg-muted text-sm max-w-xl mx-auto">
            Try this Quantitative Comparison item below. Deliberately pick an incorrect option to
            see our Distractor Trap Diagnostic, or open the Hint Ladder if you need a conceptual spark.
          </p>
        </div>

        <LiveGreWidget />
      </section>

      {/* Parity Suite Pillar Matrix */}
      <section className="w-full border-t border-border/50 bg-canvas px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
              Why Top Scorers Switch to Lumen
            </h2>
            <p className="text-fg-muted text-base max-w-2xl mx-auto">
              We combined the proven analytical depth of Magoosh, the tactical shortcut efficiency
              of GregMat, and the guided interactive problem solving of Brilliant into one seamless
              Bangladesh-first platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Pillar 1 */}
            <Card className="border-border bg-surface transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Layers className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Section-Adaptive CBT Mocks</CardTitle>
              </CardHeader>
              <CardContent className="text-fg-muted text-sm space-y-2">
                <p>
                  True ETS-accurate multi-stage testing. Your performance in Section 1 dynamically
                  routes Section 2 to Easy, Medium, or Hard difficulty.
                </p>
                <p className="text-fg-subtle text-xs">
                  Features official on-screen 4-function calculator with Transfer Display and
                  server-authoritative 10-second state synchronization.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="border-border bg-surface transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">3-Tier Progressive Hint Ladder</CardTitle>
              </CardHeader>
              <CardContent className="text-fg-muted text-sm space-y-2">
                <p>
                  Never spoil a problem just because you hit a momentary block. Reveal hints
                  gradually: Tier 1 (Concept), Tier 2 (Setup), Tier 3 (Bridge to Solution).
                </p>
                <p className="text-fg-subtle text-xs">
                  Your partial mastery is preserved proportionally, helping build durable intuition
                  without dependence on answer keys.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="border-border bg-surface transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-warning/15 text-warning mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Distractor Trap Diagnostics</CardTitle>
              </CardHeader>
              <CardContent className="text-fg-muted text-sm space-y-2">
                <p>
                  ETS test writers spend weeks engineering subtle distractor traps. Our diagnostic
                  pinpoints exactly which cognitive trap you tripped on.
                </p>
                <p className="text-fg-subtle text-xs">
                  Catalogs positive-root bias, extreme language, partial calculation, and scope shift
                  traps directly into your personal Mistake Notebook.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 4 */}
            <Card className="border-border bg-surface transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Brain className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Socratic Step-by-Step Solver</CardTitle>
              </CardHeader>
              <CardContent className="text-fg-muted text-sm space-y-2">
                <p>
                  When you cannot solve a problem, enter Guided Socratic Mode. The engine breaks the
                  problem down into micro-decisions.
                </p>
                <p className="text-fg-subtle text-xs">
                  Answer one intermediate step at a time, ensuring you understand the methodology
                  rather than passively watching an instructor solve it.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 5 */}
            <Card className="border-border bg-surface transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">Predict-First Verbal Deconstructor</CardTitle>
              </CardHeader>
              <CardContent className="text-fg-muted text-sm space-y-2">
                <p>
                  Text Completion & Sentence Equivalence without the guesswork. The interface masks
                  the options while you analyze sentence shift keys and tone.
                </p>
                <p className="text-fg-subtle text-xs">
                  Type your own prediction first; once submitted, match your prediction against the
                  official vocabulary options.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 6 */}
            <Card className="border-border bg-surface transition-all hover:shadow-md">
              <CardHeader>
                <div className="bg-accent/10 text-accent mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg">4-Mode FSRS Vocab Engine</CardTitle>
              </CardHeader>
              <CardContent className="text-fg-muted text-sm space-y-2">
                <p>
                  Built on Free Spaced Repetition Scheduler (FSRS-4.5) — mathematically proven to
                  beat legacy SM-2 with 30% fewer reviews for the same retention.
                </p>
                <p className="text-fg-subtle text-xs">
                  Features 4 distinct review modes: Flashcard, Dual-Definition, Etymology / Root, and
                  Timed Contextual Sentence Completion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Free Tools Callout */}
      <section className="w-full border-t border-border/40 bg-surface/30 px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <Badge variant="outline" className="text-xs">
            Free SEO Utilities
          </Badge>
          <h3 className="text-2xl font-bold text-fg sm:text-3xl">
            Free Interactive Score Conversion Tools
          </h3>
          <p className="text-fg-muted text-sm max-w-xl mx-auto">
            Curious what raw score maps to a 165 Quant or what IELTS Band 7.5 requires? Use our free
            interactive calculators:
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/tools/gre-score-calculator">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" /> GRE Score & Percentile Calculator
              </Button>
            </Link>
            <Link href="/tools/ielts-band-calculator">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" /> IELTS 4-Skill Band Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="w-full border-t border-border bg-canvas px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-fg">
            Ready to Experience the Difference?
          </h2>
          <p className="text-fg-muted text-base max-w-xl mx-auto">
            Take our 15-minute diagnostic test for free. No credit card required. Receive an
            estimated scaled score range and a personalized study recommendation.
          </p>
          <div className="pt-2">
            <Link href="/diagnostic">
              <Button size="lg" className="gap-2">
                Start Free GRE Diagnostic Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
