/** @purpose IELTS Marketing showcase highlighting Computer-Delivered exam engine & 4-skill mastery */
import Link from 'next/link';
import { brand } from '@lumen/config';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Sparkles,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ArrowRight,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

export const metadata = {
  title: `IELTS Academic & General Prep | Authentic Computer-Delivered Mocks | ${brand.name}`,
  description:
    'Achieve Band 7.5+ with pixel-perfect Computer-Delivered IELTS test runners, AI writing & speaking band diagnostic, and authentic Cambridge-style item banks.',
};

export default function IeltsMarketingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full border-b border-border/40 bg-surface/40 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <Badge variant="outline" className="border-accent text-accent gap-1.5 px-3 py-1 font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Computer-Delivered IELTS Parity
          </Badge>

          <h1 className="text-fg text-4xl font-extrabold tracking-tight sm:text-6xl max-w-4xl mx-auto leading-tight">
            Target Band <span className="text-accent">7.5 to 8.5</span> with Exam-Room Precision
          </h1>

          <p className="text-fg-muted mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed">
            Practice in the exact interface used in British Council & IDP exam centres.
            Realistic single-play listening, split-pane reading with text highlighter, and instant
            rubric evaluations for Writing & Speaking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/diagnostic">
              <Button size="lg" className="gap-2">
                Take Free IELTS Band Diagnostic <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/tools/ielts-band-calculator">
              <Button variant="outline" size="lg">
                IELTS Band Calculator
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-fg-subtle">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" /> CD-IELTS Authentic UI Shell
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" /> 4-Dimension Human + AI Rubric
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" /> Academic & General Training
            </span>
          </div>
        </div>
      </section>

      {/* 4 Skills Breakdown */}
      <section className="w-full max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            Complete Mastery Across All 4 Skills
          </h2>
          <p className="text-fg-muted text-base max-w-2xl mx-auto">
            Engineered to overcome the specific bottlenecks faced by Bangladeshi test takers in
            Writing Task 2 coherence and Speaking fluency.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Listening */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <Headphones className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Listening Runner</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>Authentic single-play audio streams with UK, Australian, and North American accents.</p>
              <p className="text-fg-subtle text-xs">
                Supports all 7 CD-IELTS item formats: form completion, map labelling, matching, and MCQ.
              </p>
            </CardContent>
          </Card>

          {/* Reading */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Reading Split-Pane</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>Independent scrolling passage and questions pane with interactive text highlighter.</p>
              <p className="text-fg-subtle text-xs">
                True/False/Not Given and Yes/No/Not Given cognitive distinction training.
              </p>
            </CardContent>
          </Card>

          {/* Writing */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <PenTool className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Writing Evaluator</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>Real-time word counts with 10-second autosave preventing accidental loss.</p>
              <p className="text-fg-subtle text-xs">
                Rubric breakdown across Task Achievement, Cohesion, Lexical Resource, and Grammar.
              </p>
            </CardContent>
          </Card>

          {/* Speaking */}
          <Card className="border-border bg-surface">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <Mic className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg">Speaking Simulator</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm space-y-2">
              <p>Timed Parts 1, 2 (cue card 1-min prep), and Part 3 discussion with STT word-level evaluation.</p>
              <p className="text-fg-subtle text-xs">
                Measures speech rate (wpm), pauses, filler frequency, and pronunciation clarity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tools Banner */}
      <section className="w-full border-t border-border/40 bg-surface/30 px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl space-y-4">
          <Badge variant="outline" className="text-xs">
            Free Tool
          </Badge>
          <h3 className="text-2xl font-bold text-fg">Calculate Your IELTS Band Score</h3>
          <p className="text-fg-muted text-sm">
            Check how individual skill bands aggregate under the official 0.25/0.75 rounding rule.
          </p>
          <div className="pt-2">
            <Link href="/tools/ielts-band-calculator">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" /> Open IELTS Band Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
