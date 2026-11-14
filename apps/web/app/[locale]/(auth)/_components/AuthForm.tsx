/** @purpose Reusable client auth form supporting Google OAuth, Email OTP, Phone OTP stub, Passkey/2FA prompt, and guest diagnostic token claim */
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { authClient } from '@lumen/auth';
import { brand } from '@lumen/config';
import {
  Button,
  Input,
  Badge,
  Callout,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@lumen/ui';
import { Mail, Phone, ShieldCheck, KeyRound, Sparkles, Loader2 } from 'lucide-react';
import { sendPhoneOtpStubAction, verifyPhoneOtpStubAction } from '../../../actions/auth';

export interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tab, setTab] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [emailOtp, setEmailOtp] = useState('');
  const [emailOtpSent, setEmailOtpSent] = useState(false);

  const [phone, setPhone] = useState('+8801');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [phoneHint, setPhoneHint] = useState<string | null>(null);

  const [staff2faMode, setStaff2faMode] = useState(false);
  const [diagnosticToken, setDiagnosticToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    const fromQuery = searchParams.get('diagnosticToken');
    if (fromQuery) {
      setDiagnosticToken(fromQuery);
      try {
        window.sessionStorage.setItem('lumen_guest_diagnostic_token', fromQuery);
      } catch {
        // Ignore storage restrictions
      }
      return;
    }
    try {
      const stored = window.sessionStorage.getItem('lumen_guest_diagnostic_token');
      if (stored) setDiagnosticToken(stored);
    } catch {
      // Ignore storage restrictions
    }
  }, [searchParams]);

  const nextUrl =
    mode === 'sign-up'
      ? `/onboarding${diagnosticToken ? `?diagnosticToken=${encodeURIComponent(diagnosticToken)}` : ''}`
      : diagnosticToken
        ? `/onboarding?diagnosticToken=${encodeURIComponent(diagnosticToken)}`
        : '/app';

  async function handleGoogleAuth() {
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: nextUrl,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed');
      setLoading(false);
    }
  }

  async function handleSendEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/auth/email-otp/send-verification-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type: mode === 'sign-in' ? 'sign-in' : 'email-verification' }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message || 'Unable to send email OTP');
      }
      setEmailOtpSent(true);
      setStatusMessage('6-digit verification code sent to your email (valid for 5 minutes).');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyEmailOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/sign-in/email-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: emailOtp }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { message?: string };
        throw new Error(body.message || 'Invalid or expired OTP');
      }
      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleSendPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatusMessage(null);
    try {
      const res = await sendPhoneOtpStubAction({ phone });
      setPhoneOtpSent(true);
      setPhoneHint(res.devHint ?? null);
      setStatusMessage(`6-digit SMS OTP dispatched to ${res.maskedPhone}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send phone OTP');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyPhoneOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await verifyPhoneOtpStubAction({ phone, code: phoneOtp });
      if (!res.ok) {
        throw new Error(res.error);
      }
      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Phone OTP verification failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="border-border bg-surface shadow-sm">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            {brand.name}
          </Badge>
          {diagnosticToken && (
            <Badge variant="default" className="bg-accent text-accent-fg gap-1 text-xs">
              <Sparkles className="h-3 w-3" /> Diagnostic Ready to Claim
            </Badge>
          )}
        </div>
        <CardTitle className="text-2xl font-bold">
          {mode === 'sign-in' ? `Sign in to ${brand.name}` : `Create your ${brand.name} account`}
        </CardTitle>
        <CardDescription>
          {mode === 'sign-in'
            ? 'Access your courses, adaptive mock exams, and AI score analytics.'
            : 'Start with a free diagnostic, 2 AI evaluation credits, and a tailored study plan.'}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Callout type="trap" title="Authentication Error">
            {error}
          </Callout>
        )}

        {statusMessage && (
          <Callout type="concept" title="Verification Sent">
            {statusMessage}
          </Callout>
        )}

        <Button
          type="button"
          variant="outline"
          className="w-full justify-center gap-2"
          onClick={handleGoogleAuth}
          disabled={loading}
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          Continue with Google
        </Button>

        <div className="relative flex items-center py-1">
          <div className="border-border flex-grow border-t" />
          <span className="text-fg-muted mx-3 shrink text-xs uppercase">or use OTP</span>
          <div className="border-border flex-grow border-t" />
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as 'email' | 'phone')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email" className="gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email OTP
            </TabsTrigger>
            <TabsTrigger value="phone" className="gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Phone OTP
            </TabsTrigger>
          </TabsList>

          <TabsContent value="email" className="mt-4 space-y-3">
            {!emailOtpSent ? (
              <form onSubmit={handleSendEmailOtp} className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="auth-email" className="text-sm font-medium">
                    Email address
                  </label>
                  <Input
                    id="auth-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Sending code...' : 'Send 6-digit Email OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="auth-email-otp" className="text-sm font-medium">
                    6-digit code sent to {email}
                  </label>
                  <Input
                    id="auth-email-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={emailOtp}
                    onChange={(e) => setEmailOtp(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify & Continue'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setEmailOtpSent(false)}
                    disabled={loading}
                  >
                    Change
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>

          <TabsContent value="phone" className="mt-4 space-y-3">
            {!phoneOtpSent ? (
              <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="auth-phone" className="text-sm font-medium">
                    Mobile number (BD +880 or E.164)
                  </label>
                  <Input
                    id="auth-phone"
                    type="tel"
                    required
                    placeholder="+8801712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Dispatching SMS...' : 'Send Phone OTP'}
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                <div className="space-y-1.5">
                  <label htmlFor="auth-phone-otp" className="text-sm font-medium">
                    6-digit SMS code {phoneHint ? `(${phoneHint})` : ''}
                  </label>
                  <Input
                    id="auth-phone-otp"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={phoneOtp}
                    onChange={(e) => setPhoneOtp(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1" disabled={loading}>
                    {loading ? 'Verifying...' : 'Verify Phone'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setPhoneOtpSent(false)}
                    disabled={loading}
                  >
                    Change
                  </Button>
                </div>
              </form>
            )}
          </TabsContent>
        </Tabs>

        <div className="border-border bg-surface-2/60 rounded-lg border p-3 text-xs">
          <div className="flex items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 font-medium">
              <ShieldCheck className="text-accent h-4 w-4" />
              Staff / Instructor / Org Admin
            </span>
            <button
              type="button"
              className="text-accent underline"
              onClick={() => setStaff2faMode((v) => !v)}
            >
              {staff2faMode ? 'Hide 2FA note' : 'Passkey / 2FA required'}
            </button>
          </div>
          {staff2faMode && (
            <p className="text-fg-muted mt-2 leading-relaxed">
              Grader, instructor, finance, support, and org-admin accounts
              must verify a Passkey or TOTP 2FA factor before accessing privileged routes. You will
              be prompted to enroll or verify 2FA immediately after sign-in.
            </p>
          )}
        </div>

        {mode === 'sign-up' && (
          <div className="text-fg-muted flex items-center gap-2 text-xs">
            <KeyRound className="h-3.5 w-3.5 shrink-0" />
            <span>Protected by Cloudflare Turnstile bot-prevention &amp; server-side OTP throttling.</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-border justify-between border-t pt-4 text-xs">
        <span className="text-fg-muted">
          {mode === 'sign-in' ? 'New to the platform?' : 'Already have an account?'}
        </span>
        <Link
          href={mode === 'sign-in' ? '/sign-up' : '/sign-in'}
          className="text-accent font-semibold hover:underline"
        >
          {mode === 'sign-in' ? 'Create an account' : 'Sign in'}
        </Link>
      </CardFooter>
    </Card>
  );
}
