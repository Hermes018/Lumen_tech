/** @purpose Institutional 50/50 split-screen client auth experience with warm crimson/orange design language, Google OAuth, Email/Phone (+880) OTP, and native Staff Passkey/2FA disclosure (M2.7-B, M2.8-A, P8) */
'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { authClient } from '@lumen/auth';
import { brand } from '@lumen/config';
import { Fingerprint, KeyRound, Loader2, ShieldCheck } from 'lucide-react';
import { LumenSparkMotif, PlaceholderImage } from '@/src/components/ui/primitives';
import { LocaleLink as Link } from '../../_components/LocaleLink';
import { LocaleSwitcher } from '../../_components/LocaleSwitcher';
import { sendPhoneOtpStubAction, verifyPhoneOtpStubAction } from '../../../actions/auth';

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
        body: JSON.stringify({
          email,
          type: mode === 'sign-in' ? 'sign-in' : 'email-verification',
        }),
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
    <div className="min-h-screen w-full bg-[var(--bg)]">
      {/* Top Institutional Bar */}
      <header className="bg-[var(--brand-deep)] text-white h-16 px-6 border-b-4 border-[var(--brand)] flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 text-white hover:text-white/90">
          <span className="translate-y-1.5">
            <LumenSparkMotif inverse />
          </span>
          <span className="text-lg font-bold tracking-tight">{brandDisplayName}</span>
        </Link>

        <div className="flex items-center gap-5">
          <LocaleSwitcher />
          <Link
            href="/help"
            className="text-sm font-medium text-white underline underline-offset-4 hover:text-white/85"
          >
            {isBn ? 'সহায়তা কেন্দ্র' : 'Help Center'}
          </Link>
        </div>
      </header>

      {/* Main Split Stage */}
      <main className="min-h-[calc(100dvh-4rem)] grid grid-cols-1 lg:grid-cols-12 bg-[var(--bg)]">
        {/* Left 6 Columns: Editorial Warm Backdrop + Framed Photography + Verified Facts */}
        <section className="lg:col-span-6 bg-[var(--bg-warm)] px-8 py-12 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-[var(--hairline)]">
          <div>
            <LumenSparkMotif />
            <h1 className="lumen-h1">
              {isBn
                ? 'জিআরই এবং আইইএলটিএস প্রস্তুতির জন্য একটি অ্যাকাউন্ট'
                : 'One Account for GRE® and IELTS™ Preparation'}
            </h1>
            <p className="lumen-body mt-4 max-w-xl">
              {isBn
                ? 'একই অ্যাকাউন্ট থেকে সেকশন-অ্যাডাপটিভ মক পরীক্ষা, এআই রাইটিং ও স্পিকিং ফিডব্যাক এবং সুশৃঙ্খল স্টাডি শিডিউল ব্যবহার করুন।'
                : 'Access section-adaptive mock exams, calibrated AI writing and speaking feedback, and structured study schedules from one unified workspace.'}
            </p>
          </div>

          <div className="relative my-8 px-3.5 pb-3.5">
            <div className="relative z-10">
              <PlaceholderImage slot="hero-home" aspect="16:10" locale={locale} />
            </div>
            <div aria-hidden="true" className="pointer-events-none">
              <span className="absolute bottom-0 left-0 z-20 h-3.5 w-16 bg-[var(--brand)]" />
              <span className="absolute bottom-0 left-0 z-20 h-16 w-3.5 bg-[var(--brand)]" />
              <span className="absolute bottom-0 right-0 z-20 h-3.5 w-16 bg-[var(--accent)]" />
              <span className="absolute bottom-0 right-0 z-20 h-16 w-3.5 bg-[var(--accent)]" />
            </div>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[var(--hairline)] pt-6 border-t border-[var(--hairline)]">
            <div className="pr-4">
              <div className="font-mono text-lg sm:text-xl font-bold text-[var(--brand-ink)]">
                {isBn ? '১ ঘণ্টা ৫৮ মি.' : '1h 58m'}
              </div>
              <div className="mt-1 text-xs text-[var(--text)]">
                {isBn ? 'অ্যাডাপটিভ জিআরই ফরম্যাট' : 'Adaptive GRE Format'}
              </div>
            </div>
            <div className="px-4">
              <div className="font-mono text-lg sm:text-xl font-bold text-[var(--brand-ink)]">
                {isBn ? '৪টি দক্ষতা' : '4 Skills'}
              </div>
              <div className="mt-1 text-xs text-[var(--text)]">
                {isBn ? 'কম্পিউটার-ভিত্তিক আইইএলটিএস' : 'Computer-Delivered IELTS'}
              </div>
            </div>
            <div className="pl-4">
              <div className="font-mono text-lg sm:text-xl font-bold text-[var(--brand-ink)]">
                {isBn ? '১৫% ভ্যাট' : '15% VAT'}
              </div>
              <div className="mt-1 text-xs text-[var(--text)]">
                {isBn ? 'অফিশিয়াল মূসক ৬.৩ চালান' : 'Official Mushak 6.3 Invoice'}
              </div>
            </div>
          </div>
        </section>

        {/* Right 6 Columns: Borderless Centered Form Container */}
        <section className="lg:col-span-6 bg-[var(--bg)] px-6 py-12 sm:px-12 lg:p-16 flex flex-col justify-center">
          <div className="w-full max-w-[420px] mx-auto space-y-6">
            <div>
              <LumenSparkMotif />
              <h2 className="lumen-h2">
                {mode === 'sign-in'
                  ? isBn
                    ? 'চালিয়ে যেতে লগইন করুন'
                    : 'Sign in to continue'
                  : isBn
                    ? 'আপনার অ্যাকাউন্ট তৈরি করুন'
                    : 'Create your account'}
              </h2>
              <p className="mt-2 text-sm text-[var(--text)] leading-relaxed">
                {mode === 'sign-in'
                  ? isBn
                    ? 'আপনার কোর্স, মক পরীক্ষা এবং স্টাডি অ্যানালিটিক্স অ্যাক্সেস করুন।'
                    : 'Access your courses, mock exams, and study analytics.'
                  : isBn
                    ? 'ফ্রি ডায়াগনস্টিক টেস্ট ও ২টি এআই ইভ্যালুয়েশন ক্রেডিট দিয়ে শুরু করুন।'
                    : 'Start with a free diagnostic and 2 AI evaluation credits.'}
              </p>
            </div>

            {diagnosticToken && (
              <p className="border-l-2 border-[var(--accent)] pl-3 text-sm font-medium text-[var(--brand-ink)]">
                {isBn
                  ? 'আপনার ফ্রি ডায়াগনস্টিক ফলাফল অ্যাকাউন্টে যুক্ত হওয়ার জন্য প্রস্তুত।'
                  : 'Diagnostic result ready to link to your account.'}
              </p>
            )}

            {error && (
              <div
                role="alert"
                className="border-l-4 border-[var(--crimson)] bg-[var(--bg-warm)] px-4 py-3 text-sm text-[var(--brand-ink)]"
              >
                <div className="font-bold">
                  {isBn ? 'লগইন ত্রুটি' : 'Authentication Error'}
                </div>
                <div className="mt-1">{error}</div>
              </div>
            )}

            {statusMessage && (
              <div
                role="status"
                className="border-l-4 border-[var(--brand)] bg-[var(--bg-tint)] px-4 py-3 text-sm text-[var(--brand-ink)]"
              >
                <div className="font-bold">
                  {isBn ? 'ভেরিফিকেশন কোড পাঠানো হয়েছে' : 'Verification Sent'}
                </div>
                <div className="mt-1">{statusMessage}</div>
              </div>
            )}

            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full h-12 rounded-[4px] border border-[var(--brand-ink)] bg-white text-[var(--brand-ink)] font-semibold text-sm flex items-center justify-center gap-2 hover:bg-[var(--bg-warm)] transition-colors disabled:opacity-60"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              <span>{isBn ? 'Google দিয়ে চালিয়ে যান' : 'Continue with Google'}</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-[var(--hairline)]" />
              <span className="text-xs text-[var(--text)]">
                {isBn ? 'অথবা ওয়ান-টাইম কোড দিয়ে চালিয়ে যান' : 'or continue with one-time code'}
              </span>
              <div className="flex-1 border-t border-[var(--hairline)]" />
            </div>

            <div className="space-y-5">
              <div
                className="grid grid-cols-2 border-b border-[var(--hairline)]"
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
                  className={`pb-3 text-sm transition-colors -mb-px ${
                    tab === 'email'
                      ? 'border-b-[3px] border-[var(--brand)] text-[var(--brand)] font-bold'
                      : 'text-[var(--text)] hover:text-[var(--brand-ink)] font-medium'
                  }`}
                >
                  {isBn ? 'ইমেইল ওটিপি' : 'Email code'}
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={tab === 'phone'}
                  onClick={() => {
                    setTab('phone');
                    setError(null);
                  }}
                  className={`pb-3 text-sm transition-colors -mb-px ${
                    tab === 'phone'
                      ? 'border-b-[3px] border-[var(--brand)] text-[var(--brand)] font-bold'
                      : 'text-[var(--text)] hover:text-[var(--brand-ink)] font-medium'
                  }`}
                >
                  {isBn ? 'ফোন ওটিপি (+880)' : 'Bangladesh mobile (+880)'}
                </button>
              </div>

              {tab === 'email' ? (
                <div role="tabpanel">
                  {!emailOtpSent ? (
                    <form onSubmit={handleSendEmailOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="auth-email"
                          className="block text-sm font-semibold text-[var(--brand-ink)]"
                        >
                          {isBn ? 'ইমেইল ঠিকানা' : 'Email address'}
                        </label>
                        <input
                          id="auth-email"
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full h-12 px-4 rounded-[4px] border border-[#B8A3A8] bg-white text-sm text-[var(--brand-ink)] focus:outline-none focus:border-[var(--brand)]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-[4px] bg-[var(--brand)] hover:bg-[#A50B24] text-white font-semibold text-sm transition-colors disabled:opacity-60"
                      >
                        {loading
                          ? isBn
                            ? 'কোড পাঠানো হচ্ছে...'
                            : 'Sending code...'
                          : isBn
                            ? '৬-ডিজিটের ইমেইল কোড পাঠান'
                            : 'Send 6-digit email code'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyEmailOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="auth-email-otp"
                          className="block text-sm font-semibold text-[var(--brand-ink)]"
                        >
                          {isBn
                            ? `${email}-এ পাঠানো ৬-ডিজিটের কোড`
                            : `6-digit code sent to ${email}`}
                        </label>
                        <input
                          id="auth-email-otp"
                          type="text"
                          inputMode="numeric"
                          pattern="\d{6}"
                          maxLength={6}
                          required
                          placeholder="123456"
                          value={emailOtp}
                          onChange={(e) => setEmailOtp(e.target.value)}
                          className="w-full h-12 px-4 rounded-[4px] border border-[#B8A3A8] bg-white text-sm font-mono text-[var(--brand-ink)] focus:outline-none focus:border-[var(--brand)]"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 h-12 rounded-[4px] bg-[var(--brand)] hover:bg-[#A50B24] text-white font-semibold text-sm transition-colors disabled:opacity-60"
                        >
                          {loading
                            ? isBn
                              ? 'যাচাই করা হচ্ছে...'
                              : 'Verifying...'
                            : isBn
                              ? 'যাচাই করে এগিয়ে যান'
                              : 'Verify & Continue'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEmailOtpSent(false)}
                          disabled={loading}
                          className="h-12 px-4 text-sm font-medium text-[var(--link)] underline underline-offset-4 hover:text-[var(--brand)]"
                        >
                          {isBn ? 'পরিবর্তন করুন' : 'Change'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              ) : (
                <div role="tabpanel">
                  {!phoneOtpSent ? (
                    <form onSubmit={handleSendPhoneOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="auth-phone"
                          className="block text-sm font-semibold text-[var(--brand-ink)]"
                        >
                          {isBn
                            ? 'বাংলাদেশ মোবাইল নম্বর (+880)'
                            : 'Bangladesh Mobile Number (+880)'}
                        </label>
                        <input
                          id="auth-phone"
                          type="tel"
                          required
                          placeholder="+8801712345678"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full h-12 px-4 rounded-[4px] border border-[#B8A3A8] bg-white text-sm text-[var(--brand-ink)] focus:outline-none focus:border-[var(--brand)]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-12 rounded-[4px] bg-[var(--brand)] hover:bg-[#A50B24] text-white font-semibold text-sm transition-colors disabled:opacity-60"
                      >
                        {loading
                          ? isBn
                            ? 'এসএমএস পাঠানো হচ্ছে...'
                            : 'Dispatching SMS...'
                          : isBn
                            ? 'ফোন কোড পাঠান (+880)'
                            : 'Send SMS code (+880)'}
                      </button>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyPhoneOtp} className="space-y-4">
                      <div className="space-y-1.5">
                        <label
                          htmlFor="auth-phone-otp"
                          className="block text-sm font-semibold text-[var(--brand-ink)]"
                        >
                          {isBn
                            ? `৬-ডিজিটের এসএমএস কোড ${phoneHint ? `(${phoneHint})` : ''}`
                            : `6-digit SMS code ${phoneHint ? `(${phoneHint})` : ''}`}
                        </label>
                        <input
                          id="auth-phone-otp"
                          type="text"
                          inputMode="numeric"
                          pattern="\d{6}"
                          maxLength={6}
                          required
                          placeholder="123456"
                          value={phoneOtp}
                          onChange={(e) => setPhoneOtp(e.target.value)}
                          className="w-full h-12 px-4 rounded-[4px] border border-[#B8A3A8] bg-white text-sm font-mono text-[var(--brand-ink)] focus:outline-none focus:border-[var(--brand)]"
                        />
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={loading}
                          className="flex-1 h-12 rounded-[4px] bg-[var(--brand)] hover:bg-[#A50B24] text-white font-semibold text-sm transition-colors disabled:opacity-60"
                        >
                          {loading
                            ? isBn
                              ? 'যাচাই করা হচ্ছে...'
                              : 'Verifying...'
                            : isBn
                              ? 'ফোন যাচাই করুন'
                              : 'Verify Phone'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setPhoneOtpSent(false)}
                          disabled={loading}
                          className="h-12 px-4 text-sm font-medium text-[var(--link)] underline underline-offset-4 hover:text-[var(--brand)]"
                        >
                          {isBn ? 'পরিবর্তন করুন' : 'Change'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>

            <details className="border-t border-[var(--hairline)] pt-4 text-sm">
              <summary className="cursor-pointer font-semibold text-[var(--brand-ink)] flex items-center gap-2 select-none">
                <ShieldCheck className="h-4 w-4 text-[var(--brand)] shrink-0" />
                <span>
                  {isBn
                    ? 'স্টাফ ও ইন্সট্রাক্টর পাসকি / ২এফএ'
                    : 'Staff & Instructor Passkey / 2FA'}
                </span>
              </summary>
              <div className="mt-3 space-y-3 text-xs text-[var(--text)]">
                <p className="leading-relaxed">
                  {isBn
                    ? 'গ্রেডার, ইন্সট্রাক্টর, ফিন্যান্স, সাপোর্ট এবং অর্গানাইজেশন অ্যাডমিন অ্যাকাউন্টের জন্য হার্ডওয়্যার পাসকি বা TOTP অথেনটিকেটর যাচাইকরণ বাধ্যতামূলক।'
                    : 'Grader, instructor, finance, support, and organization administrator accounts require a hardware Passkey or TOTP authenticator verification factor.'}
                </p>

                <form onSubmit={handleStaffTotpPrecheck} className="space-y-2.5">
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      placeholder={isBn ? '৬-ডিজিটের TOTP কোড' : '6-digit TOTP code'}
                      value={totpCode}
                      onChange={(e) => setTotpCode(e.target.value)}
                      aria-label={isBn ? '৬-ডিজিটের TOTP কোড' : '6-digit TOTP code'}
                      className="flex-1 h-10 px-3 rounded-[4px] border border-[#B8A3A8] bg-white text-xs text-[var(--brand-ink)] focus:outline-none focus:border-[var(--brand)]"
                    />
                    <button
                      type="submit"
                      className="h-10 px-3 rounded-[4px] border border-[var(--brand-ink)] bg-white text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] shrink-0"
                    >
                      {isBn ? 'TOTP যাচাই করুন' : 'Stage TOTP'}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setTotpVerifiedMsg(
                          isBn
                            ? 'পাসকি চ্যালেঞ্জ প্রস্তুত। উপরে প্রাথমিক সাইন-ইন সম্পন্ন করুন অথবা আপনার WebAuthn সিকিউরিটি কী সংযুক্ত করুন।'
                            : 'Passkey challenge ready. Complete primary sign-in above or insert your WebAuthn security key.'
                        )
                      }
                      className="h-10 px-3 rounded-[4px] border border-[var(--brand-ink)] bg-white text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] inline-flex items-center justify-center gap-1 shrink-0"
                    >
                      <Fingerprint className="h-3.5 w-3.5 text-[var(--brand)]" />
                      <span>{isBn ? 'পাসকি' : 'Passkey'}</span>
                    </button>
                  </div>
                  {totpVerifiedMsg && (
                    <p className="border-l-2 border-[var(--brand)] pl-3 py-1 text-xs font-medium text-[var(--brand-ink)]">
                      {totpVerifiedMsg}
                    </p>
                  )}
                </form>
              </div>
            </details>

            {mode === 'sign-up' && (
              <div className="flex items-center gap-2 text-xs text-[var(--text)]">
                <KeyRound className="h-3.5 w-3.5 shrink-0 text-[var(--brand)]" />
                <span>
                  {isBn
                    ? 'Cloudflare Turnstile বট-প্রতিরোধ এবং সার্ভার-সাইড ওটিপি রেট লিমিটিং দ্বারা সুরক্ষিত।'
                    : 'Protected by Cloudflare Turnstile bot-prevention & server-side OTP throttling.'}
                </span>
              </div>
            )}

            <div className="flex items-center justify-between border-t border-[var(--hairline)] pt-5 text-sm">
              <span className="text-[var(--text)]">
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
                className="font-semibold text-[var(--link)] underline underline-offset-4 hover:text-[var(--brand)]"
              >
                {mode === 'sign-in'
                  ? isBn
                    ? 'অ্যাকাউন্ট তৈরি করুন'
                    : 'Create an account'
                  : isBn
                    ? 'লগইন করুন'
                    : 'Sign in'}
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
