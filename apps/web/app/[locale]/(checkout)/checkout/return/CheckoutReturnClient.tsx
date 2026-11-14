/** @purpose Interactive client for SSLCommerz payment return callbacks and entitlement verification */
'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
  BookOpen,
  Sparkles,
  HelpCircle,
} from 'lucide-react';
import { confirmReturnCallbackAction } from '@/app/actions/checkout';
import { brand } from '@lumen/config';
import type { OrderRecord, EntitlementRecord } from '@lumen/core';

export function CheckoutReturnClient() {
  const searchParams = useSearchParams();
  const statusParam = (searchParams.get('status') || 'success').toLowerCase();
  const tranIdParam = searchParams.get('tran_id') || '';
  const valIdParam = searchParams.get('val_id') || '';

  const [isVerifying, startTransition] = useTransition();
  const [hasVerified, setHasVerified] = useState(false);
  const [isSuccess, setIsSuccess] = useState(statusParam === 'success');
  const [order, setOrder] = useState<OrderRecord | null>(null);
  const [entitlement, setEntitlement] = useState<EntitlementRecord | undefined>(undefined);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (statusParam === 'success' && tranIdParam && !hasVerified) {
      startTransition(async () => {
        try {
          const res = await confirmReturnCallbackAction(tranIdParam, valIdParam);
          setHasVerified(true);
          if (res.success) {
            setIsSuccess(true);
            setOrder(res.order);
            setEntitlement(res.entitlement);
          } else {
            setIsSuccess(false);
            setErrorMessage(res.errorMessage || 'Secondary order validation check failed');
          }
        } catch (err) {
          setHasVerified(true);
          setIsSuccess(false);
          setErrorMessage(err instanceof Error ? err.message : 'Unknown validation error');
        }
      });
    } else if (statusParam !== 'success') {
      setHasVerified(true);
      setIsSuccess(false);
    }
  }, [statusParam, tranIdParam, valIdParam, hasVerified]);

  if (isVerifying) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-[#e5e7eb] bg-white p-12 text-center shadow-xs">
        <div className="h-10 w-10 animate-spin rounded-full border-3 border-[#2563eb] border-t-transparent mb-4" />
        <h2 className="text-lg font-semibold text-[#111]">Verifying Payment with SSLCommerz</h2>
        <p className="mt-1 text-sm text-[#666] max-w-md">
          Executing secondary Order Validation API check server-side to verify transaction signature
          and activate course entitlements...
        </p>
        {tranIdParam && (
          <span className="mt-4 rounded bg-[#f3f4f6] px-3 py-1 font-mono text-xs text-[#555]">
            Ref: {tranIdParam}
          </span>
        )}
      </div>
    );
  }

  // Transaction Cancelled
  if (statusParam === 'cancel') {
    return (
      <div className="rounded-lg border border-[#fef3c7] bg-white p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-[#fef3c7] p-2 text-[#d97706]">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#92400e]">Payment Cancelled</h2>
            <p className="mt-1 text-sm text-[#78350f]">
              You cancelled the SSLCommerz payment session. No funds were debited from your bank or mobile wallet.
            </p>

            {tranIdParam && (
              <div className="mt-4 rounded border border-[#fde68a] bg-[#fffbeb] p-3 text-xs font-mono text-[#92400e]">
                Transaction Ref: {tranIdParam}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
              >
                <RotateCcw className="h-4 w-4" />
                Return to Checkout
              </Link>
              <Link
                href="/app/practice"
                className="inline-flex items-center gap-2 rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                Continue as Free Learner
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Transaction Failed or Verification Failed
  if (!isSuccess || statusParam === 'fail') {
    return (
      <div className="rounded-lg border border-[#fee2e2] bg-white p-8 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-[#fee2e2] p-2 text-[#dc2626]">
            <XCircle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-[#991b1b]">Payment Failed</h2>
            <p className="mt-1 text-sm text-[#7f1d1d]">
              The payment transaction could not be completed or was rejected by the gateway.
            </p>

            {errorMessage && (
              <div className="mt-4 rounded border border-[#fecaca] bg-[#fef2f2] p-3 text-xs text-[#991b1b]">
                <span className="font-semibold">Reason:</span> {errorMessage}
              </div>
            )}

            {tranIdParam && (
              <div className="mt-3 text-xs font-mono text-[#666]">
                Transaction Ref: {tranIdParam}
              </div>
            )}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/checkout"
                className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-4 py-2 text-sm font-medium text-white hover:bg-[#1d4ed8]"
              >
                <RotateCcw className="h-4 w-4" />
                Try Payment Again
              </Link>
              <a
                href={`mailto:${brand.supportEmail}`}
                className="inline-flex items-center gap-2 rounded-md border border-[#d1d5db] bg-white px-4 py-2 text-sm font-medium text-[#374151] hover:bg-[#f9fafb]"
              >
                <HelpCircle className="h-4 w-4" />
                Contact Support
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Payment Succeeded & Entitlement Verified
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] p-6 shadow-xs">
        <div className="flex items-start gap-4">
          <div className="rounded-full bg-[#dcfce7] p-2 text-[#16a34a]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#dcfce7] px-2.5 py-0.5 text-xs font-semibold text-[#15803d]">
                Verified by SSLCommerz
              </span>
              <span className="text-xs text-[#666]">
                5% Educational VAT Included
              </span>
            </div>
            <h2 className="mt-2 text-xl font-bold text-[#166534]">
              Enrollment Confirmed & Entitlements Active!
            </h2>
            <p className="mt-1 text-sm text-[#14532d]">
              Thank you for your enrollment. Your access has been provisioned server-side and is immediately ready to use.
            </p>
          </div>
        </div>
      </div>

      {/* Transaction & Order Summary */}
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-xs">
        <h3 className="text-sm font-semibold text-[#111] uppercase tracking-wider mb-4">
          Order & Payment Details
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-xs">
          <div className="space-y-1">
            <span className="text-[#666]">Product Enrolled</span>
            <p className="font-semibold text-sm text-[#111]">
              {order?.productName || 'GRE Self-Paced Comprehensive Course'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[#666]">Status</span>
            <div className="flex items-center gap-1.5 text-emerald-600 font-semibold">
              <ShieldCheck className="h-4 w-4" />
              <span>Paid & Fulfilled</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[#666]">SSLCommerz Tran ID</span>
            <p className="font-mono text-[#333]">{tranIdParam || order?.providerRef || 'N/A'}</p>
          </div>

          <div className="space-y-1">
            <span className="text-[#666]">Order ID</span>
            <p className="font-mono text-[#333]">{order?.id || 'N/A'}</p>
          </div>

          {entitlement && (
            <>
              <div className="space-y-1">
                <span className="text-[#666]">Access Period</span>
                <p className="text-[#333]">
                  {new Date(entitlement.startsAt).toLocaleDateString()} —{' '}
                  {entitlement.endsAt
                    ? new Date(entitlement.endsAt).toLocaleDateString()
                    : 'Lifetime access'}
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-[#666]">Entitlement ID</span>
                <p className="font-mono text-[#333]">{entitlement.id}</p>
              </div>
            </>
          )}
        </div>

        {/* Feature Unlocks */}
        <div className="mt-6 border-t border-[#f3f4f6] pt-4">
          <h4 className="text-xs font-semibold text-[#555] uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            Features Unlocked in Your Account
          </h4>
          <ul className="grid grid-cols-1 gap-2 text-xs text-[#333] sm:grid-cols-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Full GRE Mock Exam Engine with Section Adaptivity</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>4-Mode FSRS Active-Recall Vocabulary Engine</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>D13 Mistake Notebook & Error Taxonomy Tracker</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Socratic Step-by-Step Solver & Verbal Deconstructor</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-2">
        <Link
          href="/app/practice"
          className="inline-flex items-center gap-2 rounded-md bg-[#2563eb] px-5 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-[#1d4ed8]"
        >
          <BookOpen className="h-4 w-4" />
          Start Interactive Practice
          <ArrowRight className="h-4 w-4" />
        </Link>
        <Link
          href="/app/vocab/play"
          className="inline-flex items-center gap-2 rounded-md border border-[#d1d5db] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] shadow-xs hover:bg-[#f9fafb]"
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
          Practice Vocab Deck
        </Link>
        <Link
          href="/app/mistakes"
          className="inline-flex items-center gap-2 rounded-md border border-[#d1d5db] bg-white px-5 py-2.5 text-sm font-semibold text-[#374151] shadow-xs hover:bg-[#f9fafb]"
        >
          <RotateCcw className="h-4 w-4 text-purple-500" />
          Mistake Notebook
        </Link>
      </div>
    </div>
  );
}
