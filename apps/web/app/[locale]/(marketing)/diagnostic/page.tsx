/** @purpose Marketing landing gateway for Free GRE & IELTS Express Diagnostic tests */
import Link from 'next/link';
import { brand } from '@lumen/config';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Clock,
  ArrowRight,
  ShieldCheck,
  Brain,
  CheckCircle,
} from 'lucide-react';

export const metadata = {
  title: `Free Express Diagnostic | 15-Minute Ability Assessment | ${brand.name}`,
  description:
    'Test your real GRE or IELTS baseline in 15 minutes with our authentic CBT exam shell. Instant Rasch ability scoring and trap diagnostics.',
};

export default function DiagnosticLandingPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-4xl w-full space-y-10 text-center">
        {/* Header */}
        <div className="space-y-4">
          <Badge variant="outline" className="border-accent text-accent text-xs">
            Free Guest Diagnostic Access
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            Free 15-Minute GRE Express Diagnostic
          </h1>
          <p className="text-fg-muted text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Experience our authentic computer-based testing shell with 8 calibrated items (4 Quant + 4
            Verbal). Discover your estimated scaled score range and identify your primary cognitive
            trap vulnerability.
          </p>
        </div>

        {/* Feature Highlights */}
        <div className="grid gap-6 sm:grid-cols-3 text-left">
          <Card className="border-border bg-surface">
            <CardHeader className="pb-2">
              <Clock className="h-6 w-6 text-accent mb-2" />
              <CardTitle className="text-base font-bold text-fg">15-Minute Time Limit</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fg-muted">
              Fast, high-efficiency assessment designed to benchmark your current speed and pacing
              without requiring a full 4-hour test.
            </CardContent>
          </Card>

          <Card className="border-border bg-surface">
            <CardHeader className="pb-2">
              <Brain className="h-6 w-6 text-accent mb-2" />
              <CardTitle className="text-base font-bold text-fg">Rasch 1PL Ability Model</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fg-muted">
              Calibrated via psychometric item response theory to project your 130–170 Verbal &
              Quant scaled scores.
            </CardContent>
          </Card>

          <Card className="border-border bg-surface">
            <CardHeader className="pb-2">
              <ShieldCheck className="h-6 w-6 text-accent mb-2" />
              <CardTitle className="text-base font-bold text-fg">Trap Forensics</CardTitle>
            </CardHeader>
            <CardContent className="text-xs text-fg-muted">
              Learn whether you are prone to Positive Root Bias, Concession Shift Triggers, or Scope
              Expansion traps.
            </CardContent>
          </Card>
        </div>

        {/* Action Card */}
        <div className="rounded-2xl border border-accent/30 bg-surface p-8 sm:p-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-fg">Ready to Begin?</h2>
            <p className="text-xs text-fg-muted max-w-md mx-auto">
              No account creation or credit card required to start. Results are estimated diagnostic
              indicators.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/exam/diagnostic">
              <Button size="lg" className="gap-2 font-semibold">
                Launch GRE CBT Diagnostic Now <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="flex justify-center gap-6 text-xs text-fg-subtle pt-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" /> Official 4-Function Calculator
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle className="h-4 w-4 text-accent" /> Authentic Exam UI
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
