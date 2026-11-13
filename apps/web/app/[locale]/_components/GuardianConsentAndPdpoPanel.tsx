/** @purpose Client component for Bangladesh PDPO 2025 Under-18 Guardian Consent and Data Portability / Erasure controls (docs/00 D7, docs/02 §463) */
'use client';

import React, { useState, useTransition, useEffect } from 'react';
import {
  ShieldCheck,
  ShieldAlert,
  Download,
  Trash2,
  CheckCircle2,
  Clock,
  Info,
  Lock,
  Mail,
  Phone,
  KeyRound,
  AlertTriangle,
} from 'lucide-react';
import {
  getGuardianConsentStatusAction,
  requestGuardianConsentAction,
  verifyGuardianOtpAction,
  revokeGuardianConsentAction,
  exportUserDataBundleAction,
  requestAccountDeletionAction,
} from '@/app/actions/pdpo';
import type { GuardianConsentState } from '@lumen/core';

export function GuardianConsentAndPdpoPanel() {
  const [consentState, setConsentState] = useState<GuardianConsentState | null>(null);
  const [guardianEmail, setGuardianEmail] = useState('');
  const [guardianPhone, setGuardianPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [revokeReason, setRevokeReason] = useState('');
  const [deletionReason, setDeletionReason] = useState('');

  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [devHint, setDevHint] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deletionScheduled, setDeletionScheduled] = useState<string | null>(null);

  useEffect(() => {
    startTransition(async () => {
      try {
        const state = await getGuardianConsentStatusAction();
        setConsentState(state);
      } catch {
        // Fallback for unauthenticated dev view
        setConsentState({
          studentId: 'guest_or_dev',
          status: 'unverified',
          otpAttempts: 0,
        });
      }
    });
  }, []);

  const handleRequestConsent = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const res = await requestGuardianConsentAction({
          guardianEmail,
          guardianPhone,
        });
        if (res.ok) {
          setMessage({
            type: 'success',
            text: `Verification OTP dispatched to ${res.maskedEmail} and ${res.maskedPhone}.`,
          });
          if (res.devHint) setDevHint(res.devHint);
          const state = await getGuardianConsentStatusAction();
          setConsentState(state);
        }
      } catch (err: unknown) {
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to request guardian consent.',
        });
      }
    });
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    startTransition(async () => {
      try {
        const res = await verifyGuardianOtpAction({ otp: otpInput });
        if (res.ok) {
          setMessage({
            type: 'success',
            text: 'Guardian consent verified successfully under Bangladesh PDPO 2025!',
          });
          setDevHint(null);
          const state = await getGuardianConsentStatusAction();
          setConsentState(state);
        } else {
          setMessage({ type: 'error', text: res.error || 'Invalid OTP code.' });
        }
      } catch (err: unknown) {
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to verify OTP.',
        });
      }
    });
  };

  const handleRevokeConsent = () => {
    if (!revokeReason.trim()) {
      alert('Please provide a brief reason for revoking guardian consent.');
      return;
    }
    setMessage(null);
    startTransition(async () => {
      try {
        const res = await revokeGuardianConsentAction({ reason: revokeReason });
        if (res.ok) {
          setMessage({
            type: 'success',
            text: 'Guardian consent has been revoked. Minor safeguards are re-applied.',
          });
          const state = await getGuardianConsentStatusAction();
          setConsentState(state);
          setRevokeReason('');
        }
      } catch (err: unknown) {
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to revoke consent.',
        });
      }
    });
  };

  const handleExportData = () => {
    startTransition(async () => {
      try {
        const bundle = await exportUserDataBundleAction();
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(bundle, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute('href', dataStr);
        downloadAnchor.setAttribute('download', `lumen_pdpo_export_${new Date().toISOString().slice(0, 10)}.json`);
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        setMessage({
          type: 'success',
          text: 'Data portability bundle exported successfully (PDPO 2025 JSON format).',
        });
      } catch (err: unknown) {
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to export user data bundle.',
        });
      }
    });
  };

  const handleRequestDeletion = () => {
    if (!deletionReason.trim()) {
      alert('Please state a reason for requesting account deletion.');
      return;
    }
    const confirmed = window.confirm(
      'Are you sure you want to schedule account and data erasure? A 30-day statutory grace period will apply before permanent cryptographic deletion per PDPO 2025.'
    );
    if (!confirmed) return;

    startTransition(async () => {
      try {
        const res = await requestAccountDeletionAction({ reason: deletionReason });
        if (res.ok) {
          setDeletionScheduled(res.scheduledPurgeDate);
          setMessage({
            type: 'success',
            text: `Right to Erasure scheduled. Irreversible cryptographic deletion on: ${new Date(res.scheduledPurgeDate).toLocaleDateString()}`,
          });
          setDeletionReason('');
        }
      } catch (err: unknown) {
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to schedule deletion.',
        });
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {message && (
        <div
          className={`flex items-start gap-2.5 rounded-lg border p-4 text-xs font-medium ${
            message.type === 'success'
              ? 'border-emerald-500/20 bg-emerald-500/10 text-emerald-800 dark:text-emerald-300'
              : 'border-destructive/20 bg-destructive/10 text-destructive'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Section 1: Bangladesh PDPO 2025 Under-18 Guardian Consent */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <h2 className="text-base font-semibold text-foreground">
                Bangladesh PDPO 2025: Guardian Consent (Under-18)
              </h2>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Statutory minor protection compliance under the Personal Data Protection Ordinance 2025.
            </p>
          </div>

          {/* Status Badge */}
          <div>
            {consentState?.status === 'verified' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                <CheckCircle2 className="h-3.5 w-3.5" /> VERIFIED CONSENT
              </span>
            )}
            {consentState?.status === 'consent_requested' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-1 font-mono text-xs font-semibold text-amber-700 dark:text-amber-300">
                <Clock className="h-3.5 w-3.5" /> VERIFICATION PENDING
              </span>
            )}
            {consentState?.status === 'unverified' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 font-mono text-xs font-semibold text-muted-foreground">
                <ShieldAlert className="h-3.5 w-3.5" /> UNVERIFIED (MINOR)
              </span>
            )}
            {consentState?.status === 'revoked' && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-destructive/10 px-3 py-1 font-mono text-xs font-semibold text-destructive">
                <Lock className="h-3.5 w-3.5" /> CONSENT REVOKED
              </span>
            )}
          </div>
        </div>

        {/* Informational Callout */}
        <div className="mt-4 rounded-lg border border-border/80 bg-muted/30 p-4 text-xs text-muted-foreground">
          <p className="flex items-start gap-2">
            <Info className="h-4 w-4 shrink-0 text-primary" />
            <span>
              <strong>Minor Safeguards:</strong> In accordance with Bangladesh PDPO 2025, minor accounts
              are strictly excluded from commercial 3rd-party analytics. Public profile visibility and
              community forum interactions remain locked until verifiable parental/guardian consent is completed.
            </span>
          </p>
        </div>

        {/* Consent Flow Controls */}
        <div className="mt-6 space-y-4">
          {consentState?.status !== 'verified' ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {/* Request Consent Form */}
              <form onSubmit={handleRequestConsent} className="space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  1. Send Guardian Verification Request
                </h3>
                <div>
                  <label className="text-xs font-medium text-foreground">Guardian Email Address</label>
                  <div className="relative mt-1">
                    <Mail className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      placeholder="parent@example.com"
                      value={guardianEmail}
                      onChange={(e) => setGuardianEmail(e.target.value)}
                      className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-foreground">Guardian Phone Number (E.164)</label>
                  <div className="relative mt-1">
                    <Phone className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="tel"
                      required
                      placeholder="+8801711000000"
                      value={guardianPhone}
                      onChange={(e) => setGuardianPhone(e.target.value)}
                      className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full rounded bg-primary py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
                >
                  {isPending ? 'Sending Request...' : 'Send Guardian OTP'}
                </button>
              </form>

              {/* Verify OTP Form */}
              <form onSubmit={handleVerifyOtp} className="space-y-3 border-t border-border pt-4 md:border-t-0 md:border-l md:pt-0 md:pl-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  2. Enter 6-Digit Guardian OTP
                </h3>
                <p className="text-xs text-muted-foreground">
                  Enter the verification code received by your parent/guardian via email or SMS.
                </p>

                {devHint && (
                  <div className="rounded bg-primary/10 p-2 font-mono text-xs text-primary">
                    {devHint}
                  </div>
                )}

                <div>
                  <label className="text-xs font-medium text-foreground">6-Digit Verification Code</label>
                  <div className="relative mt-1">
                    <KeyRound className="absolute top-2.5 left-2.5 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      maxLength={6}
                      required
                      placeholder="e.g. 482910"
                      value={otpInput}
                      onChange={(e) => setOtpInput(e.target.value)}
                      className="w-full rounded border border-border bg-background py-2 pr-3 pl-9 font-mono text-xs tracking-widest text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isPending || otpInput.length !== 6}
                  className="w-full rounded bg-emerald-600 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
                >
                  {isPending ? 'Verifying...' : 'Verify Guardian Consent'}
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-semibold text-foreground">
                    Parental consent is verified and active.
                  </p>
                  <p className="text-muted-foreground">
                    Verified on: {new Date(consentState.verifiedAt || '').toLocaleDateString()} • Audit Token:{' '}
                    <span className="font-mono">{consentState.consentRecordHash?.slice(0, 24)}...</span>
                  </p>
                </div>
              </div>

              {/* Revoke Option */}
              <div className="rounded-lg border border-border bg-muted/20 p-4">
                <h4 className="text-xs font-semibold text-foreground">Revoke Guardian Consent</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  If you or your guardian wish to withdraw consent, community posting and public profile access will be locked immediately.
                </p>
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    placeholder="Reason for revocation..."
                    value={revokeReason}
                    onChange={(e) => setRevokeReason(e.target.value)}
                    className="flex-1 rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground"
                  />
                  <button
                    onClick={handleRevokeConsent}
                    disabled={isPending}
                    className="rounded border border-destructive/30 bg-destructive/10 px-3 py-1.5 text-xs font-semibold text-destructive hover:bg-destructive/20 disabled:opacity-50"
                  >
                    Revoke Consent
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Section 2: PDPO 2025 Data Portability & Erasure Controls */}
      <div className="rounded-xl border border-border bg-card p-6 shadow-xs">
        <h2 className="text-base font-semibold text-foreground">
          PDPO 2025 Data Privacy, Portability &amp; Right to Erasure
        </h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Exercise your statutory rights under the Bangladesh Personal Data Protection Ordinance 2025.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Data Portability (Export) */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-5">
            <div>
              <div className="flex items-center gap-2">
                <Download className="h-4 w-4 text-primary" />
                <h3 className="text-xs font-semibold text-foreground">Data Portability Export</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Download a complete, machine-readable JSON archive containing your learner profile,
                mock test attempts, study history, and Mushak 6.3 payment records.
              </p>
            </div>
            <button
              onClick={handleExportData}
              disabled={isPending}
              className="mt-4 flex items-center justify-center gap-2 rounded border border-border bg-card py-2 text-xs font-semibold text-foreground hover:bg-muted disabled:opacity-50"
            >
              <Download className="h-3.5 w-3.5" />
              {isPending ? 'Generating Export...' : 'Download My Data (JSON)'}
            </button>
          </div>

          {/* Right to Erasure (Account Deletion) */}
          <div className="flex flex-col justify-between rounded-lg border border-destructive/20 bg-destructive/5 p-5">
            <div>
              <div className="flex items-center gap-2">
                <Trash2 className="h-4 w-4 text-destructive" />
                <h3 className="text-xs font-semibold text-destructive">Right to Erasure (Delete Account)</h3>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Permanently purge your account, essays, and personal data. Per PDPO 2025 guidelines, a 30-day
                statutory grace period is granted before irreversible cryptographic destruction.
              </p>
              {deletionScheduled && (
                <div className="mt-2 rounded bg-destructive/10 p-2 font-mono text-[11px] text-destructive">
                  Purge scheduled on: {new Date(deletionScheduled).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="mt-4 space-y-2">
              <input
                type="text"
                placeholder="Reason for deletion..."
                value={deletionReason}
                onChange={(e) => setDeletionReason(e.target.value)}
                className="w-full rounded border border-border bg-background px-3 py-1.5 text-xs text-foreground"
              />
              <button
                onClick={handleRequestDeletion}
                disabled={isPending}
                className="w-full rounded bg-destructive py-2 text-xs font-semibold text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50"
              >
                {isPending ? 'Scheduling...' : 'Request Account Deletion'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
