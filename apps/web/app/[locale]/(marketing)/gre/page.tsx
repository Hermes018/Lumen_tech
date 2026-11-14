/** @purpose Flagship GRE Marketing showcase highlighting Magoosh + GregMat + Brilliant Parity Suite with Royal Indigo identity (BUG-12) */
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
  Compass,
} from 'lucide-react';
import { brand } from '@lumen/config';
import { LiveGreWidget } from './live-gre-widget';

export const metadata = {
  title: `GRE Prep Re-Engineered | Adaptive CBT Mocks & Socratic Pedagogy | ${brand.name}`,
  description:
    'Prepare for the GRE with the only platform offering authentic Section-Adaptive CBT Mocks, 3-Tier Hint Ladders, Distractor Trap Diagnostics, and 4-Mode FSRS Spaced Repetition.',
};

export default function GreMarketingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Royal Indigo Hero Section (BUG-12) */}
      <section className="relative w-full overflow-hidden border-b border-indigo-900 bg-indigo-950 px-4 py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-900/70 px-3.5 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>Magoosh + GregMat + Brilliant Parity Suite</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            The GRE Prep Platform Built for{' '}
            <span className="text-blue-400">330+ Ambitions</span>
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-indigo-100/90 sm:text-xl leading-relaxed">
            Stop passively watching video lectures. Experience real section-adaptive mock tests,
            progressive hint ladders that preserve your learning, distractor trap forensics, and
            predict-first verbal mastery.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/exam/diagnostic">
              <Button size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-500 shadow-lg">
                Take Free 15-Min Express Diagnostic <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="outline"
                size="lg"
                className="border-indigo-700 bg-indigo-900/60 text-white hover:bg-indigo-800"
              >
                View GRE Plans &amp; Passes
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-blue-400" /> 100% Authentic CBT Exam Shell
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-blue-400" /> 1,500+ High-Frequency Words (FSRS)
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-blue-400" /> 130–170 Rasch 1PL Ability Scoring
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Section with Well-Spaced 2-Column Header */}
      <section
        id="pedagogy"
        className="w-full max-w-5xl px-4 py-16 sm:py-20 flex flex-col items-center"
      >
        <div className="mb-10 grid w-full max-w-3xl gap-6 rounded-2xl border border-slate-200/80 bg-slate-50 p-6 sm:grid-cols-12 sm:items-center">
          <div className="space-y-2 sm:col-span-8">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-950 px-2.5 py-1 text-xs font-semibold text-indigo-200">
              <Compass className="h-3.5 w-3.5 text-blue-400" />
              Interactive GRE Pedagogy Sampler
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Test Our Interactive Pedagogy in 10 Seconds
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Try this Quantitative Comparison item below. Deliberately pick an incorrect option to
              see our Distractor Trap Diagnostic, or open the Hint Ladder if you need a conceptual spark.
            </p>
          </div>
          <div className="flex flex-col gap-2 rounded-xl border border-indigo-200 bg-white p-4 text-xs sm:col-span-4">
            <div className="font-bold text-indigo-950">What You Are Testing:</div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>KaTeX Algebraic Typography</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>3-Tier Progressive Hint Ladder</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>Distractor Trap Forensics</span>
            </div>
          </div>
        </div>

        <LiveGreWidget />
      </section>

      {/* Parity Suite Pillar Matrix */}
      <section className="w-full border-t border-slate-200 bg-slate-50/70 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Why Top Scorers Switch to {brand.name}
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              We combined the proven analytical depth of Magoosh, the tactical shortcut efficiency
              of GregMat, and the guided interactive problem solving of Brilliant into one seamless
              Bangladesh-first platform.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Pillar 1 */}
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-indigo-950 text-indigo-200 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Layers className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">Section-Adaptive CBT Mocks</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  True ETS-accurate multi-stage testing. Your performance in Section 1 dynamically
                  routes Section 2 to Easy, Medium, or Hard difficulty.
                </p>
                <p className="text-slate-500 text-xs">
                  Features official on-screen 4-function calculator with Transfer Display and
                  server-authoritative 10-second state synchronization.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-blue-600 text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">3-Tier Progressive Hint Ladder</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  Never spoil a problem just because you hit a momentary block. Reveal hints
                  gradually: Tier 1 (Concept), Tier 2 (Setup), Tier 3 (Bridge to Solution).
                </p>
                <p className="text-slate-500 text-xs">
                  Your partial mastery is preserved proportionally, helping build durable intuition
                  without dependence on answer keys.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-indigo-950 text-amber-300 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">Distractor Trap Diagnostics</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  ETS test writers spend weeks engineering subtle distractor traps. Our diagnostic
                  pinpoints exactly which cognitive trap you tripped on.
                </p>
                <p className="text-slate-500 text-xs">
                  Catalogs positive-root bias, extreme language, partial calculation, and scope shift
                  traps directly into your personal Mistake Notebook.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 4 */}
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-blue-600 text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Brain className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">Socratic Step-by-Step Solver</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  When you cannot solve a problem, enter Guided Socratic Mode. The engine breaks the
                  problem down into micro-decisions.
                </p>
                <p className="text-slate-500 text-xs">
                  Answer one intermediate step at a time, ensuring you understand the methodology
                  rather than passively watching an instructor solve it.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 5 */}
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-indigo-950 text-indigo-200 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">Predict-First Verbal Deconstructor</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  Text Completion &amp; Sentence Equivalence without the guesswork. The interface masks
                  the options while you analyze sentence shift keys and tone.
                </p>
                <p className="text-slate-500 text-xs">
                  Type your own prediction first; once submitted, match your prediction against the
                  official vocabulary options.
                </p>
              </CardContent>
            </Card>

            {/* Pillar 6 */}
            <Card id="vocab" className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300 scroll-mt-20">
              <CardHeader>
                <div className="bg-blue-600 text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">4-Mode FSRS Vocab Engine</CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  Built on Free Spaced Repetition Scheduler (FSRS-4.5) — mathematically proven to
                  beat legacy SM-2 with 30% fewer reviews for the same retention.
                </p>
                <p className="text-slate-500 text-xs">
                  Features 4 distinct review modes: Flashcard, Dual-Definition, Etymology / Root, and
                  Timed Contextual Sentence Completion.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Free Tools Callout */}
      <section className="w-full border-t border-slate-200 bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <Badge variant="outline" className="border-indigo-300 text-indigo-900 text-xs">
            Free SEO Utilities
          </Badge>
          <h3 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            Free Interactive Score Conversion Tools
          </h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            Curious what raw score maps to a 165 Quant or what IELTS Band 7.5 requires? Use our free
            interactive calculators:
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/tools/gre-score-calculator">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" /> GRE Score &amp; Percentile Calculator
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
      <section className="w-full border-t border-indigo-900 bg-indigo-950 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            Ready to Experience the Difference?
          </h2>
          <p className="text-indigo-200 text-base max-w-xl mx-auto">
            Take our 15-minute diagnostic test for free. No credit card required. Receive an
            estimated scaled score range and a personalized study recommendation.
          </p>
          <div className="pt-2">
            <Link href="/exam/diagnostic">
              <Button size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-500">
                Start Free GRE Diagnostic Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
