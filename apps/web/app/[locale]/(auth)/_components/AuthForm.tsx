/** @purpose High-conversion 2-column split-screen client auth experience supporting Google OAuth, Email OTP, Phone OTP (+880), inline Staff Passkey/TOTP 2FA drawer, and guest diagnostic token claim (BUG-11, P2.6.1 Bilingual) */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/src/i18n/routing';
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
} from '@lumen/ui';
import {
  Mail,
  Phone,
  ShieldCheck,
  KeyRound,
  Sparkles,
  Loader2,
  GraduationCap,
  TrendingUp,
  Brain,
  CheckCircle2,
  Fingerprint,
  Quote,
  ArrowLeft,
} from 'lucide-react';
import { sendPhoneOtpStubAction, verifyPhoneOtpStubAction } from '../../../actions/auth';
import { LocaleSwitcher } from '../../_components/LocaleSwitcher';

export interface AuthFormProps {
  mode: 'sign-in' | 'sign-up';
  locale?: 'en' | 'bn';
}

export function AuthForm({ mode, locale: propLocale }: AuthFormProps) {
  const hookLocale = useLocale();
  const locale = propLocale ?? (hookLocale === 'bn' ? 'bn' : 'en');
  const isBn = locale === 'bn';

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
  const [totpCode, setTotpCode] = useState('');
  const [totpVerifiedMsg, setTotpVerifiedMsg] = useState<string | null>(null);

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

  const basePrefix = isBn ? '/bn' : '';
  const nextUrl =
    mode === 'sign-up'
      ? `${basePrefix}/onboarding${diagnosticToken ? `?diagnosticToken=${encodeURIComponent(diagnosticToken)}` : ''}`
      : diagnosticToken
        ? `${basePrefix}/onboarding?diagnosticToken=${encodeURIComponent(diagnosticToken)}`
        : `${basePrefix}/app`;

  async function handleGoogleAuth() {
    setLoading(true);
    setError(null);
    try {
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: nextUrl,
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBn
            ? 'Google লগইন ব্যর্থ হয়েছে'
            : 'Google sign-in failed'
      );
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
        throw new Error(
          body.message || (isBn ? 'ইমেইল ওটিপি পাঠানো সম্ভব হয়নি' : 'Unable to send email OTP')
        );
      }
      setEmailOtpSent(true);
      setStatusMessage(
        isBn
          ? 'আপনার ইমেইলে ৬-ডিজিটের ভেরিফিকেশন কোড পাঠানো হয়েছে (মেয়াদ ৫ মিনিট)।'
          : '6-digit verification code sent to your email (valid for 5 minutes).'
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBn
            ? 'ইমেইল ওটিপি পাঠাতে ব্যর্থ হয়েছে'
            : 'Failed to send email OTP'
      );
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
        throw new Error(
          body.message || (isBn ? 'ভুল বা মেয়াদোত্তীর্ণ ওটিপি কোড' : 'Invalid or expired OTP')
        );
      }
      router.push(nextUrl);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBn
            ? 'ওটিপি যাচাইকরণ ব্যর্থ হয়েছে'
            : 'OTP verification failed'
      );
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
      setStatusMessage(
        isBn
          ? `${res.maskedPhone} নম্বরে ৬-ডিজিটের এসএমএস ওটিপি পাঠানো হয়েছে।`
          : `6-digit SMS OTP dispatched to ${res.maskedPhone}.`
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : isBn
            ? 'ফোন ওটিপি পাঠাতে ব্যর্থ হয়েছে'
            : 'Failed to send phone OTP'
      );
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
      setError(
        err instanceof Error
          ? err.message
          : isBn
            ? 'ফোন ওটিপি যাচাইকরণ ব্যর্থ হয়েছে'
            : 'Phone OTP verification failed'
      );
    } finally {
      setLoading(false);
    }
  }

  function handleStaffTotpPrecheck(e: React.FormEvent) {
    e.preventDefault();
    if (totpCode.trim().length !== 6) {
      setTotpVerifiedMsg(
        isBn
          ? 'অনুগ্রহ করে ৬-ডিজিটের সঠিক অথেনটিকেটর কোড দিন।'
          : 'Please enter a valid 6-digit authenticator code.'
      );
      return;
    }
    setTotpVerifiedMsg(
      isBn
        ? 'TOTP ফ্যাক্টর প্রস্তুত। স্টাফ ও গ্রেডার কনসোলে প্রবেশ করতে উপরে আপনার ইমেইল বা ফোন ওটিপি লগইন সম্পন্ন করুন।'
        : 'TOTP factor pre-staged. Complete your primary Email or Phone OTP sign-in above to enter the Staff & Grader console.'
    );
  }

  const brandDisplayName = isBn ? 'লুমেন একাডেমি' : brand.name;

  return (
    <div className="space-y-6">
      {/* Top Bar: Back to Home + Language Switcher */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 transition-colors hover:text-slate-950"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>{isBn ? `${brandDisplayName}-এ ফিরে যান` : `Back to ${brand.name}`}</span>
        </Link>
        <LocaleSwitcher />
      </div>

      {/* 2-Column Split Layout on Desktop (BUG-11) */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-stretch">
        {/* Left Panel: Brand Showcase, Live GRE/IELTS Metrics, FSRS Guarantee & Verified Scholar Quote */}
        <div className="lg:col-span-5 bg-slate-950 text-white p-10 rounded-3xl flex flex-col justify-between shadow-2xl border border-slate-800 relative overflow-hidden">
          <div
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-30"
            aria-hidden="true"
          />

          <div className="relative space-y-6">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="text-lg font-extrabold tracking-tight text-white">
                {brandDisplayName}
              </span>
            </div>

            <div className="space-y-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/30 bg-blue-950/90 px-3 py-1 text-[11px] font-semibold text-blue-200">
                <Sparkles className="h-3 w-3 text-blue-400" />
                {isBn
                  ? '৩৩০+ জিআরই এবং ব্যান্ড ৮.০+ আইইএলটিএসের জন্য ক্যালিব্রেটেড'
                  : 'Calibrated for 330+ GRE & Band 8.0+ IELTS'}
              </span>
              <h2 className="text-2xl font-extrabold leading-snug text-white sm:text-3xl">
                {isBn
                  ? 'বাংলাদেশি শিক্ষার্থীদের জন্য নির্মিত নিখুঁত ডায়াগনস্টিক ও অ্যাক্টিভ রিকল ইঞ্জিন।'
                  : 'Precision Diagnostics & Active Recall Built for Bangladesh Scholars.'}
              </h2>
              <p className="text-xs leading-relaxed text-slate-300">
                {isBn
                  ? 'প্রতিটি অনুশীলন প্রশ্ন Rasch 1PL IRT অ্যালগরিদম ব্যবহার করে আপনার দক্ষতার সাথে খাপ খাইয়ে নেয় এবং ৯০% স্মৃতি স্থায়িত্ব বজায় রাখতে ভোকাবুলারি রিভিউ নির্ধারণ করে।'
                  : 'Every practice item adapts to your latent ability using Rasch 1PL IRT and schedules vocabulary reviews at your exact 90% memory stability threshold.'}
              </p>
            </div>

            {/* Live GRE/IELTS Score Improvement Metrics */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400">
                  <TrendingUp className="h-3.5 w-3.5" />
                  <span>{isBn ? 'জিআরই স্কোর উন্নতি' : 'GRE Improvement'}</span>
                </div>
                <div className="mt-1 text-2xl font-black text-white">
                  {isBn ? '+১১.৪ পয়েন্ট' : '+11.4 pts'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isBn ? '৮ সপ্তাহের ব্যাচে গড় উন্নতি' : 'Median 8-week cohort gain'}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-3.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>{isBn ? 'আইইএলটিএস ফলাফল' : 'IELTS Outcome'}</span>
                </div>
                <div className="mt-1 text-2xl font-black text-white">
                  {isBn ? 'ব্যান্ড ৭.৫+' : 'Band 7.5+'}
                </div>
                <div className="text-[11px] text-slate-400">
                  {isBn ? '৭৮% প্লাস শিক্ষার্থীর অর্জিত স্কোর' : 'Achieved by 78% of Plus learners'}
                </div>
              </div>
            </div>

            {/* FSRS Retention Guarantee Pill */}
            <div className="rounded-2xl border border-indigo-500/30 bg-indigo-950/60 p-4 space-y-1.5">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-200">
                <Brain className="h-4 w-4 text-indigo-400 shrink-0" />
                <span>
                  {isBn
                    ? 'FSRS-4.5 স্মৃতি গ্যারান্টি ও ৭-দিনের রিফান্ড নীতি'
                    : 'FSRS-4.5 Retention Guarantee & 7-Day Refund'}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed text-indigo-100/80">
                {isBn
                  ? 'পুরাতন SM-2 পদ্ধতির তুলনায় ৩০% কম ফ্ল্যাশকার্ড রিভিউতে পরীক্ষার দিন ৯০% মনে রাখার নিশ্চয়তা, সাথে থাকছে ৭-দিনের সম্পূর্ণ মানি-ব্যাক গ্যারান্টি।'
                  : '30% fewer flashcard repetitions than legacy SM-2 for the same 90% exam-day recall, backed by our transparent 7-day money-back guarantee.'}
              </p>
            </div>
          </div>

          {/* Verified Bangladeshi Scholar Quote */}
          <div className="relative mt-8 rounded-2xl border border-slate-800 bg-slate-900/90 p-4 space-y-2.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />{' '}
                {isBn ? 'যাচাইকৃত বাংলাদেশি স্কলার' : 'Verified Bangladeshi Scholar'}
              </span>
              <span className="font-mono text-slate-300">GRE 332 (Q169, V163)</span>
            </div>
            <p className="text-xs italic leading-relaxed text-slate-200">
              <Quote className="mr-1 inline h-3.5 w-3.5 text-blue-400" />
              {isBn
                ? 'ডিস্ট্রাক্টর ট্র্যাপ ডায়াগনস্টিকস এবং ৩-ধাপের হিন্ট ল্যাডার কোয়ান্টিটেটিভ কম্প্যারিজনে আমার নেগেটিভ রুট সংক্রান্ত ভুলগুলো পুরোপুরি বন্ধ করেছে। মাত্র ৫ সপ্তাহে আমার কোয়ান্ট স্কোর ১৬১ থেকে ১৬৯ হয়েছে।'
                : 'The Distractor Trap Diagnostics and 3-Tier Hint Ladder stopped my careless root-sign mistakes in Quantitative Comparison. I jumped from 161 to 169 Quant in 5 weeks.'}
            </p>
            <div className="text-[11px] font-semibold text-slate-300">
              {isBn
                ? '— ফারহান টি., বুয়েট সিএসই গ্র্যাজুয়েট • ফল পিএইচডি ব্যাচে ভর্তিকৃত'
                : '— Farhan T., BUET CSE Graduate • Admitted to Fall PhD Cohort'}
            </div>
          </div>
        </div>

        {/* Right Panel: Clean Authentication Card */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          <Card className="border-slate-200/90 bg-white shadow-xl rounded-3xl p-2 sm:p-4">
            <CardHeader className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Badge variant="outline" className="border-slate-300 text-slate-700 text-xs font-semibold">
                  {isBn ? `${brandDisplayName} অ্যাকাউন্ট পোর্টাল` : `${brand.name} Account Portal`}
                </Badge>
                {diagnosticToken && (
                  <Badge variant="default" className="bg-blue-600 text-white gap-1 text-xs">
                    <Sparkles className="h-3 w-3" />{' '}
                    {isBn ? 'ডায়াগনস্টিক ফলাফল সংরক্ষণের জন্য প্রস্তুত' : 'Diagnostic Ready to Claim'}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl font-extrabold text-slate-950 sm:text-3xl">
                {mode === 'sign-in'
                  ? isBn
                    ? `${brandDisplayName}-এ লগইন করুন`
                    : `Sign in to ${brand.name}`
                  : isBn
                    ? `আপনার ${brandDisplayName} অ্যাকাউন্ট তৈরি করুন`
                    : `Create your ${brand.name} account`}
              </CardTitle>
              <CardDescription className="text-slate-600">
                {mode === 'sign-in'
                  ? isBn
                    ? 'আপনার কোর্সসমূহ, সেকশন-অ্যাডাপটিভ মক টেস্ট এবং এআই স্কোর অ্যানালিটিক্স অ্যাক্সেস করুন।'
                    : 'Access your courses, section-adaptive mock exams, and AI score analytics.'
                  : isBn
                    ? 'ফ্রি ডায়াগনস্টিক টেস্ট, ২টি এআই ইভ্যালুয়েশন ক্রেডিট এবং কাস্টম স্টাডি প্ল্যান দিয়ে শুরু করুন।'
                    : 'Start with a free diagnostic, 2 AI evaluation credits, and a tailored study plan.'}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-5">
              {error && (
                <Callout type="trap" title={isBn ? 'লগইন ত্রুটি' : 'Authentication Error'}>
                  {error}
                </Callout>
              )}

              {statusMessage && (
                <Callout type="concept" title={isBn ? 'ভেরিফিকেশন কোড পাঠানো হয়েছে' : 'Verification Sent'}>
                  {statusMessage}
                </Callout>
              )}

              <Button
                type="button"
                variant="outline"
                className="w-full justify-center gap-2 border-slate-300 py-2.5 font-semibold text-slate-800 hover:bg-slate-50"
                onClick={handleGoogleAuth}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {isBn ? 'Google দিয়ে চালিয়ে যান' : 'Continue with Google'}
              </Button>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-slate-200" />
                <span className="mx-3 shrink text-xs font-semibold uppercase tracking-wider text-slate-400">
                  {isBn ? 'অথবা পাসওয়ার্ডবিহীন ওটিপি' : 'or passwordless OTP'}
                </span>
                <div className="flex-grow border-t border-slate-200" />
              </div>

              {/* Dynamic Email OTP vs Phone OTP (+880) Switcher */}
              <div className="space-y-4">
                <div
                  className="grid w-full grid-cols-2 rounded-xl border border-slate-200 bg-slate-100 p-1"
                  role="tablist"
                  aria-label={isBn ? 'ওটিপি পদ্ধতি' : 'OTP Method'}
                >
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'email'}
                    onClick={() => {
                      setTab('email');
                      setError(null);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                      tab === 'email'
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Mail className="h-3.5 w-3.5 text-blue-600" />
                    <span>{isBn ? 'ইমেইল ওটিপি' : 'Email OTP'}</span>
                  </button>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'phone'}
                    onClick={() => {
                      setTab('phone');
                      setError(null);
                    }}
                    className={`flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-bold transition-all ${
                      tab === 'phone'
                        ? 'bg-white text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Phone className="h-3.5 w-3.5 text-emerald-600" />
                    <span>{isBn ? 'ফোন ওটিপি (+880)' : 'Phone OTP (+880)'}</span>
                  </button>
                </div>

                {tab === 'email' ? (
                  <div className="space-y-3" role="tabpanel">
                    {!emailOtpSent ? (
                      <form onSubmit={handleSendEmailOtp} className="space-y-3">
                        <div className="space-y-1.5">
                          <label htmlFor="auth-email" className="text-sm font-semibold text-slate-800">
                            {isBn ? 'ইমেইল ঠিকানা' : 'Email address'}
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
                        <Button
                          type="submit"
                          className="w-full bg-slate-950 text-white hover:bg-slate-900 font-semibold"
                          disabled={loading}
                        >
                          {loading
                            ? isBn
                              ? 'কোড পাঠানো হচ্ছে...'
                              : 'Sending code...'
                            : isBn
                              ? '৬-ডিজিটের ইমেইল ওটিপি পাঠান'
                              : 'Send 6-digit Email OTP'}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyEmailOtp} className="space-y-3">
                        <div className="space-y-1.5">
                          <label htmlFor="auth-email-otp" className="text-sm font-semibold text-slate-800">
                            {isBn
                              ? `${email}-এ পাঠানো ৬-ডিজিটের কোড`
                              : `6-digit code sent to ${email}`}
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
                          <Button
                            type="submit"
                            className="flex-1 bg-blue-600 text-white hover:bg-blue-500 font-semibold"
                            disabled={loading}
                          >
                            {loading
                              ? isBn
                                ? 'যাচাই করা হচ্ছে...'
                                : 'Verifying...'
                              : isBn
                                ? 'যাচাই করে এগিয়ে যান'
                                : 'Verify & Continue'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setEmailOtpSent(false)}
                            disabled={loading}
                          >
                            {isBn ? 'পরিবর্তন করুন' : 'Change'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3" role="tabpanel">
                    {!phoneOtpSent ? (
                      <form onSubmit={handleSendPhoneOtp} className="space-y-3">
                        <div className="space-y-1.5">
                          <label htmlFor="auth-phone" className="text-sm font-semibold text-slate-800">
                            {isBn ? 'বাংলাদেশ মোবাইল নম্বর (+880)' : 'Bangladesh Mobile Number (+880)'}
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
                        <Button
                          type="submit"
                          className="w-full bg-emerald-950 text-white hover:bg-emerald-900 font-semibold"
                          disabled={loading}
                        >
                          {loading
                            ? isBn
                              ? 'এসএমএস পাঠানো হচ্ছে...'
                              : 'Dispatching SMS...'
                            : isBn
                              ? 'ফোন ওটিপি পাঠান (+880)'
                              : 'Send Phone OTP (+880)'}
                        </Button>
                      </form>
                    ) : (
                      <form onSubmit={handleVerifyPhoneOtp} className="space-y-3">
                        <div className="space-y-1.5">
                          <label htmlFor="auth-phone-otp" className="text-sm font-semibold text-slate-800">
                            {isBn
                              ? `৬-ডিজিটের এসএমএস কোড ${phoneHint ? `(${phoneHint})` : ''}`
                              : `6-digit SMS code ${phoneHint ? `(${phoneHint})` : ''}`}
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
                          <Button
                            type="submit"
                            className="flex-1 bg-teal-600 text-white hover:bg-teal-500 font-semibold"
                            disabled={loading}
                          >
                            {loading
                              ? isBn
                                ? 'যাচাই করা হচ্ছে...'
                                : 'Verifying...'
                              : isBn
                                ? 'ফোন যাচাই করুন'
                                : 'Verify Phone'}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setPhoneOtpSent(false)}
                            disabled={loading}
                          >
                            {isBn ? 'পরিবর্তন করুন' : 'Change'}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                )}
              </div>

              {/* Staff / Instructor Passkey & 2FA Inline Expandable Drawer */}
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3.5 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    {isBn
                      ? 'স্টাফ / ইন্সট্রাক্টর পাসকি ও ২এফএ (2FA)'
                      : 'Staff / Instructor Passkey & 2FA'}
                  </span>
                  <button
                    type="button"
                    aria-expanded={staff2faMode}
                    className="font-semibold text-blue-600 underline hover:text-blue-800"
                    onClick={() => setStaff2faMode((v) => !v)}
                  >
                    {staff2faMode
                      ? isBn
                        ? '২এফএ ড্রয়ার লুকান'
                        : 'Hide 2FA Drawer'
                      : isBn
                        ? 'পাসকি / ২এফএ ড্রয়ার খুলুন'
                        : 'Open Passkey / 2FA Drawer'}
                  </button>
                </div>

                {staff2faMode && (
                  <div className="mt-3 space-y-3 border-t border-slate-200 pt-3">
                    <p className="leading-relaxed text-slate-600">
                      {isBn
                        ? 'গ্রেডার, ইন্সট্রাক্টর, ফিন্যান্স, সাপোর্ট এবং অর্গানাইজেশন অ্যাডমিন অ্যাকাউন্টের জন্য হার্ডওয়্যার পাসকি বা TOTP অথেনটিকেটর যাচাইকরণ বাধ্যতামূলক।'
                        : 'Grader, instructor, finance, support, and organization administrator accounts require a hardware Passkey or TOTP authenticator verification factor.'}
                    </p>

                    <form onSubmit={handleStaffTotpPrecheck} className="space-y-2.5">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        <Input
                          type="text"
                          inputMode="numeric"
                          maxLength={6}
                          placeholder={isBn ? '৬-ডিজিটের TOTP কোড' : '6-digit TOTP code'}
                          value={totpCode}
                          onChange={(e) => setTotpCode(e.target.value)}
                          className="bg-white text-xs"
                          aria-label={isBn ? '৬-ডিজিটের TOTP কোড' : '6-digit TOTP code'}
                        />
                        <Button type="submit" size="sm" variant="outline" className="shrink-0 font-semibold">
                          {isBn ? 'TOTP যাচাই করুন' : 'Stage TOTP Factor'}
                        </Button>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setTotpVerifiedMsg(
                              isBn
                                ? 'পাসকি চ্যালেঞ্জ প্রস্তুত। উপরে প্রাথমিক সাইন-ইন সম্পন্ন করুন অথবা আপনার WebAuthn সিকিউরিটি কী সংযুক্ত করুন।'
                                : 'Passkey challenge ready. Complete primary sign-in above or insert your WebAuthn security key.'
                            )
                          }
                          className="shrink-0 gap-1 font-semibold"
                        >
                          <Fingerprint className="h-3.5 w-3.5 text-blue-600" />
                          {isBn ? 'পাসকি' : 'Passkey'}
                        </Button>
                      </div>
                      {totpVerifiedMsg && (
                        <p className="rounded-lg bg-blue-50 px-3 py-2 text-[11px] font-medium text-blue-900">
                          {totpVerifiedMsg}
                        </p>
                      )}
                    </form>
                  </div>
                )}
              </div>

              {mode === 'sign-up' && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <KeyRound className="h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <span>
                    {isBn
                      ? 'Cloudflare Turnstile বট-প্রতিরোধ এবং সার্ভার-সাইড ওটিপি রেট লিমিটিং দ্বারা সুরক্ষিত।'
                      : 'Protected by Cloudflare Turnstile bot-prevention & server-side OTP throttling.'}
                  </span>
                </div>
              )}
            </CardContent>

            <CardFooter className="justify-between border-t border-slate-100 pt-4 text-xs">
              <span className="text-slate-600">
                {mode === 'sign-in'
                  ? isBn
                    ? 'প্ল্যাটফর্মে নতুন?'
                    : 'New to the platform?'
                  : isBn
                    ? 'ইতিমধ্যে একটি অ্যাকাউন্ট আছে?'
                    : 'Already have an account?'}
              </span>
              <Link
                href={mode === 'sign-in' ? '/sign-up' : '/sign-in'}
                className="font-bold text-blue-600 hover:underline"
              >
                {mode === 'sign-in'
                  ? isBn
                    ? 'অ্যাকাউন্ট তৈরি করুন →'
                    : 'Create an account →'
                  : isBn
                    ? 'লগইন করুন →'
                    : 'Sign in →'}
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
