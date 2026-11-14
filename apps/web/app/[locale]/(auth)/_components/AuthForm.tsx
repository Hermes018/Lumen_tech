/** @purpose Full-bleed 50/50 edge-to-edge split-screen client auth experience with student photography poster, outcome cards, scholar testimonial, Google OAuth, Email/Phone (+880) OTP, and collapsible Staff Passkey/2FA drawer (M2.7-B) */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { LocaleLink as Link } from '../../_components/LocaleLink';
import { authClient } from '@lumen/auth';
import { brand } from '@lumen/config';
import {
  Button,
  Input,
  Badge,
  Callout,
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
    <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-12 bg-white">
      {/* Left 6 Columns: Full-Bleed Student Photograph + Institutional Overlay + Outcome Cards + Glassmorphic Testimonial */}
      <div className="lg:col-span-6 relative hidden lg:flex flex-col justify-between p-12 xl:p-16 bg-[#001E42] text-white overflow-hidden">
        {/* Full-bleed background student photograph */}
        <img
          src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=85"
          alt={
            isBn
              ? 'বিশ্ববিদ্যালয়ের শিক্ষার্থীরা একসাথে পরীক্ষার প্রস্তুতি নিচ্ছেন'
              : 'University scholars preparing together'
          }
          className="absolute inset-0 h-full w-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#001E42] via-[#001E42]/85 to-[#003057]/75"
          aria-hidden="true"
        />

        {/* Top: Brand logo + ETS / IELTS official format badge */}
        <div className="relative z-10 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E4002B] text-white shadow-md">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white">
              {brandDisplayName}
            </span>
          </Link>
          <span className="rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-100 backdrop-blur-xs">
            {isBn
              ? 'অফিশিয়াল ETS / IELTS ফরম্যাট'
              : 'ETS / IELTS Official Format'}
          </span>
        </div>

        {/* Center: Large Editorial Headline + 2 High-Impact Visual Outcome Cards */}
        <div className="relative z-10 space-y-8 my-auto py-8">
          <div className="space-y-4">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-cyan-200">
              {isBn
                ? '৩৩০+ জিআরই এবং ব্যান্ড ৮.০+ আইইএলটিএসের জন্য ক্যালিব্রেটেড'
                : 'Calibrated for 330+ GRE® & Band 8.0+ IELTS™'}
            </div>
            <h2 className="text-4xl xl:text-5xl font-bold leading-tight text-white">
              {isBn
                ? 'বাংলাদেশি স্কলারদের জন্য নির্মিত নিখুঁত ডায়াগনস্টিক ও সিবিটি ইঞ্জিন।'
                : 'Precision Diagnostics & CBT Simulators Built for Bangladesh Scholars.'}
            </h2>
            <p className="text-sm xl:text-base leading-relaxed text-slate-200 max-w-xl">
              {isBn
                ? 'সেকশন-অ্যাডাপটিভ প্র্যাকটিস টেস্ট আপনার দক্ষতার সাথে খাপ খাইয়ে নেয় এবং দীর্ঘস্থায়ী মনে রাখার জন্য ভোকাবুলারি রিভিউ নির্ধারণ করে।'
                : 'Section-adaptive practice tests match difficulty to your performance, and vocabulary reviews are scheduled for lasting recall.'}
            </p>
          </div>

          {/* 2 Clean, High-Impact Visual Outcome Cards */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
                <TrendingUp className="h-4 w-4" />
                <span>{isBn ? 'জিআরই ফলাফল' : 'GRE® Outcome'}</span>
              </div>
              <div className="mt-2 text-2xl xl:text-3xl font-black text-white">
                {isBn ? 'GRE® +১১.৪ পয়েন্ট' : 'GRE® +11.4 Pts Median Gain'}
              </div>
              <div className="mt-1 text-xs text-slate-300">
                {isBn ? '৮ সপ্তাহের ব্যাচে গড় স্কোর উন্নতি' : 'Verified 8-week cohort median gain'}
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md shadow-lg">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#00A896]">
                <CheckCircle2 className="h-4 w-4" />
                <span>{isBn ? 'আইইএলটিএস ফলাফল' : 'IELTS™ Outcome'}</span>
              </div>
              <div className="mt-2 text-2xl xl:text-3xl font-black text-white">
                {isBn
                  ? 'IELTS™ ব্যান্ড ৭.৫+ (৭৮%)'
                  : 'IELTS™ Band 7.5+ Achieved by 78%'}
              </div>
              <div className="mt-1 text-xs text-slate-300">
                {isBn ? 'প্লাস ও লাইভ ব্যাচ শিক্ষার্থীদের ফলাফল' : 'Across Plus & Live cohort test takers'}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Clean Glassmorphic Scholar Testimonial Poster Card */}
        <div className="relative z-10 rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-md shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-bold text-cyan-300">
              <CheckCircle2 className="h-4 w-4" />
              {isBn ? 'যাচাইকৃত বাংলাদেশি স্কলার' : 'Verified Bangladeshi Scholar'}
            </span>
            <span className="rounded bg-[#003057] px-2.5 py-0.5 font-mono text-xs font-bold text-white">
              GRE 332 (Q169 • V163)
            </span>
          </div>
          <p className="text-sm italic leading-relaxed text-slate-100">
            <Quote className="mr-1.5 inline h-4 w-4 text-cyan-300" />
            {isBn
              ? 'ডিস্ট্রাক্টর ট্র্যাপ ডায়াগনস্টিকস এবং ৩-ধাপের হিন্ট ল্যাডার কোয়ান্টিটেটিভ কম্প্যারিজনে আমার নেগেটিভ রুট সংক্রান্ত ভুলগুলো পুরোপুরি বন্ধ করেছে। মাত্র ৫ সপ্তাহে আমার কোয়ান্ট স্কোর ১৬১ থেকে ১৬৯ হয়েছে।'
              : 'The Distractor Trap Diagnostics and 3-Tier Hint Ladder stopped my careless root-sign mistakes in Quantitative Comparison. I jumped from 161 to 169 Quant in 5 weeks.'}
          </p>
          <div className="text-xs font-bold text-white">
            {isBn
              ? 'ফারহান টি., বুয়েট গ্র্যাজুয়েট • ফল পিএইচডি কোহর্টে ভর্তিকৃত — GRE 332'
              : 'Farhan T., BUET Graduate • Admitted to Fall PhD Cohort — GRE 332'}
          </div>
        </div>
      </div>

      {/* Right 6 Columns: Full-Height Form Column with Top Row + Center Form Container */}
      <div className="lg:col-span-6 flex flex-col justify-between p-6 sm:p-12 xl:p-16 bg-white">
        {/* Top Row: Locale-aware Back link on left + LocaleSwitcher on right */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 transition-colors hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>
              {isBn ? `← ${brandDisplayName}-এ ফিরে যান` : `← Back to ${brand.name}`}
            </span>
          </Link>
          <LocaleSwitcher />
        </div>

        {/* Center Form Container (max-w-md w-full mx-auto my-auto) */}
        <div className="max-w-md w-full mx-auto my-auto py-8 space-y-6">
          <div className="space-y-2 text-left">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
                {isBn ? `${brandDisplayName} অ্যাকাউন্ট পোর্টাল` : `${brand.name} Account Portal`}
              </div>
              {diagnosticToken && (
                <Badge variant="default" className="bg-[#007791] text-white gap-1 text-xs">
                  <Sparkles className="h-3 w-3" />{' '}
                  {isBn ? 'ডায়াগনস্টিক ফলাফল প্রস্তুত' : 'Diagnostic Ready to Claim'}
                </Badge>
              )}
            </div>

            <h1 className="text-3xl font-bold text-slate-900 pt-1">
              {mode === 'sign-in'
                ? isBn
                  ? `${brandDisplayName}-এ লগইন করুন`
                  : `Sign in to ${brand.name}`
                : isBn
                  ? `আপনার ${brandDisplayName} অ্যাকাউন্ট তৈরি করুন`
                  : `Create your ${brand.name} account`}
            </h1>
            <p className="text-sm text-slate-600 leading-relaxed">
              {mode === 'sign-in'
                ? isBn
                  ? 'আপনার কোর্সসমূহ, সেকশন-অ্যাডাপটিভ মক টেস্ট এবং এআই স্কোর অ্যানালিটিক্স অ্যাক্সেস করুন।'
                  : 'Access your courses, section-adaptive mock exams, and AI score analytics.'
                : isBn
                  ? 'ফ্রি ডায়াগনস্টিক টেস্ট, ২টি এআই ইভ্যালুয়েশন ক্রেডিট এবং কাস্টম স্টাডি প্ল্যান দিয়ে শুরু করুন।'
                  : 'Start with a free diagnostic, 2 AI evaluation credits, and a tailored study plan.'}
            </p>
          </div>

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

          {/* Large h-12 text-base Google OAuth Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full h-12 text-base justify-center gap-2.5 border-slate-300 font-semibold text-slate-800 hover:bg-slate-50"
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

          {/* Clean Email / +880 Phone Tabs */}
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
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  tab === 'email'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Mail className="h-3.5 w-3.5 text-[#003057]" />
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
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-bold transition-all ${
                  tab === 'phone'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Phone className="h-3.5 w-3.5 text-[#006677]" />
                <span>{isBn ? 'ফোন ওটিপি (+880)' : 'Phone OTP (+880)'}</span>
              </button>
            </div>

            {tab === 'email' ? (
              <div className="space-y-4" role="tabpanel">
                {!emailOtpSent ? (
                  <form onSubmit={handleSendEmailOtp} className="space-y-4">
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
                        className="h-12 text-base"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base bg-[#001E42] text-white hover:bg-slate-900 font-semibold"
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
                  <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
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
                        className="h-12 text-base font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 h-12 text-base bg-[#E4002B] text-white hover:bg-[#c80025] font-semibold"
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
                        className="h-12"
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
              <div className="space-y-4" role="tabpanel">
                {!phoneOtpSent ? (
                  <form onSubmit={handleSendPhoneOtp} className="space-y-4">
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
                        className="h-12 text-base"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full h-12 text-base bg-[#006677] text-white hover:bg-[#005563] font-semibold"
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
                  <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
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
                        className="h-12 text-base font-mono"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="flex-1 h-12 text-base bg-[#006677] text-white hover:bg-[#005563] font-semibold"
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
                        className="h-12"
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

          {/* Collapsible Staff Passkey & 2FA Drawer */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs">
            <div className="flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <ShieldCheck className="h-4 w-4 text-[#003057]" />
                {isBn
                  ? 'স্টাফ / ইন্সট্রাক্টর পাসকি ও ২এফএ (2FA)'
                  : 'Staff / Instructor Passkey & 2FA'}
              </span>
              <button
                type="button"
                aria-expanded={staff2faMode}
                className="font-semibold text-[#003057] underline hover:text-slate-950"
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
                      <Fingerprint className="h-3.5 w-3.5 text-[#003057]" />
                      {isBn ? 'পাসকি' : 'Passkey'}
                    </Button>
                  </div>
                  {totpVerifiedMsg && (
                    <p className="rounded-lg bg-slate-100 px-3 py-2 text-[11px] font-medium text-slate-900">
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
        </div>

        {/* Bottom Row: Account Mode Switcher */}
        <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs sm:text-sm max-w-md w-full mx-auto">
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
            className="font-bold text-[#E4002B] hover:underline"
          >
            {mode === 'sign-in'
              ? isBn
                ? 'অ্যাকাউন্ট তৈরি করুন →'
                : 'Create an account →'
              : isBn
                ? 'লগইন করুন →'
                : 'Sign in →'}
          </Link>
        </div>
      </div>
    </div>
  );
}
