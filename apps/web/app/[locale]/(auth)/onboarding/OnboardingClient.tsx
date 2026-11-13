/** @purpose Learner onboarding form: target exam, date, target score, age band, Passkey/2FA prompt, and guest diagnostic token claim */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { brand } from '@lumen/config';
import {
  Button,
  Input,
  Select,
  Badge,
  Callout,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@lumen/ui';
import { Target, ShieldAlert, CheckCircle2, Sparkles, Loader2 } from 'lucide-react';
import { completeOnboardingAction } from '../../../actions/auth';

export function OnboardingClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [targetExam, setTargetExam] = useState<'gre' | 'ielts_academic' | 'ielts_general'>('gre');
  const [targetExamDate, setTargetExamDate] = useState('2027-02-15');
  const [targetScore, setTargetScore] = useState('325');
  const [currentLevel, setCurrentLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('intermediate');
  const [ageBand, setAgeBand] = useState<'under_18' | '18_24' | '25_plus'>('18_24');
  const [guardianEmail, setGuardianEmail] = useState('');
  const [diagnosticToken, setDiagnosticToken] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    grantedCredits: number;
    diagnosticClaimed: boolean;
    requires2faSetup: boolean;
  } | null>(null);

  useEffect(() => {
    const queryToken = searchParams.get('diagnosticToken');
    if (queryToken) {
      setDiagnosticToken(queryToken);
      return;
    }
    try {
      const stored = window.sessionStorage.getItem('lumen_guest_diagnostic_token');
      if (stored) setDiagnosticToken(stored);
    } catch {
      // Ignore storage restrictions
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await completeOnboardingAction({
        targetExam,
        targetExamDate,
        targetScore,
        currentLevel,
        ageBand,
        guardianEmail: ageBand === 'under_18' ? guardianEmail : undefined,
        diagnosticToken: diagnosticToken || undefined,
      });
      try {
        window.sessionStorage.removeItem('lumen_guest_diagnostic_token');
      } catch {
        // Ignore storage restrictions
      }
      setResult({
        grantedCredits: res.grantedCredits,
        diagnosticClaimed: res.diagnosticClaimed,
        requires2faSetup: res.requires2faSetup,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save onboarding profile');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
      <Card className="border-border bg-surface shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="text-success h-5 w-5" />
            <CardTitle className="text-xl font-bold">Welcome to {brand.name}</CardTitle>
          </div>
          <CardDescription>Your study profile is ready.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Callout type="concept" title="Credits & Diagnostic">
            +{result.grantedCredits} free AI evaluation credits added to your ledger.
            {result.diagnosticClaimed ? ' Your guest diagnostic attempt has been linked.' : ''}
          </Callout>

          {result.requires2faSetup && (
            <Callout type="trap" title="Staff / Instructor 2FA Required (D4)">
              Your account holds a privileged role. Enroll a Passkey or TOTP authenticator in
              Settings before accessing Grader, Studio, Finance, or Admin tools.
            </Callout>
          )}

          <div className="flex gap-2">
            <Button className="flex-1" onClick={() => router.push('/app')}>
              Go to Learner Portal
            </Button>
            {result.requires2faSetup && (
              <Button variant="outline" onClick={() => router.push('/app/settings')}>
                Enroll 2FA
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border bg-surface shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="gap-1 text-xs">
            <Target className="h-3 w-3" /> Personalize Your Plan
          </Badge>
          {diagnosticToken && (
            <Badge variant="default" className="bg-accent text-accent-fg gap-1 text-xs">
              <Sparkles className="h-3 w-3" /> Guest Diagnostic Attached
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl font-bold">Set your target score</CardTitle>
        <CardDescription>
          {brand.name} uses your target date and baseline to build an adaptive study schedule and
          grant 2 free AI credits.
        </CardDescription>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-4">
            <Callout type="trap" title="Onboarding Error">
              {error}
            </Callout>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="target-exam" className="text-sm font-medium">
              Target Examination
            </label>
            <Select
              id="target-exam"
              value={targetExam}
              onChange={(e) => {
                const val = e.target.value as 'gre' | 'ielts_academic' | 'ielts_general';
                setTargetExam(val);
                setTargetScore(val === 'gre' ? '325' : '7.5');
              }}
            >
              <option value="gre">GRE General Test</option>
              <option value="ielts_academic">IELTS Academic</option>
              <option value="ielts_general">IELTS General Training</option>
            </Select>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="target-date" className="text-sm font-medium">
                Target Exam Date
              </label>
              <Input
                id="target-date"
                type="date"
                required
                value={targetExamDate}
                onChange={(e) => setTargetExamDate(e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="target-score" className="text-sm font-medium">
                Target Score / Band
              </label>
              <Input
                id="target-score"
                type="text"
                required
                value={targetScore}
                onChange={(e) => setTargetScore(e.target.value)}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="current-level" className="text-sm font-medium">
                Current Preparation Level
              </label>
              <Select
                id="current-level"
                value={currentLevel}
                onChange={(e) =>
                  setCurrentLevel(e.target.value as 'beginner' | 'intermediate' | 'advanced')
                }
              >
                <option value="beginner">Beginner (Just starting)</option>
                <option value="intermediate">Intermediate (Know basics)</option>
                <option value="advanced">Advanced (Retake / 90th+ %ile)</option>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="age-band" className="text-sm font-medium">
                Age Band
              </label>
              <Select
                id="age-band"
                value={ageBand}
                onChange={(e) =>
                  setAgeBand(e.target.value as 'under_18' | '18_24' | '25_plus')
                }
              >
                <option value="under_18">Under 18 (Guardian link)</option>
                <option value="18_24">18 – 24</option>
                <option value="25_plus">25+</option>
              </Select>
            </div>
          </div>

          {ageBand === 'under_18' && (
            <div className="border-border bg-surface-2/60 space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold">
                <ShieldAlert className="text-accent h-4 w-4" />
                Guardian Consent Required for Under-18 Learners
              </div>
              <label htmlFor="guardian-email" className="block text-xs font-medium">
                Parent / Guardian Email
              </label>
              <Input
                id="guardian-email"
                type="email"
                required
                placeholder="guardian@example.com"
                value={guardianEmail}
                onChange={(e) => setGuardianEmail(e.target.value)}
              />
            </div>
          )}

          <Button type="submit" className="w-full gap-2" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {loading ? 'Saving profile...' : 'Complete Onboarding & Claim 2 AI Credits'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
