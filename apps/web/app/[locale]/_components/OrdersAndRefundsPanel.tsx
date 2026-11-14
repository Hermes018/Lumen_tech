/** @purpose Shared client panel displaying active entitlements, AI credit & mock allowances, Mushak/VAT receipt breakdown, and 1-click self-serve refund request */
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Badge,
  Button,
  Callout,
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Skeleton,
} from '@lumen/ui';
import {
  Receipt,
  Sparkles,
  FileCheck2,
  RotateCcw,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import {
  getOrdersAndEntitlementsAction,
  requestSelfServeRefundAction,
} from '../../actions/checkout';

type AccountBillingState = Awaited<ReturnType<typeof getOrdersAndEntitlementsAction>>;

function formatMoneyMinor(minor: number, currency: string): string {
  const major = (minor / 100).toFixed(currency === 'BDT' ? 0 : 2);
  return currency === 'BDT' ? `৳${major}` : `$${major}`;
}

export function OrdersAndRefundsPanel({ showAccountSecurity = false }: { showAccountSecurity?: boolean }) {
  const [data, setData] = useState<AccountBillingState | null>(null);
  const [loading, setLoading] = useState(true);
  const [authRequired, setAuthRequired] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refundingId, setRefundingId] = useState<string | null>(null);
  const [refundFeedback, setRefundFeedback] = useState<Record<string, string>>({});

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getOrdersAndEntitlementsAction();
      setData(res);
      setAuthRequired(false);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to load orders';
      if (/UNAUTHENTICATED|401|sign in/i.test(message)) {
        setAuthRequired(true);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadData();
  }, [loadData]);

  async function handleRefundRequest(orderId: string) {
    setRefundingId(orderId);
    setError(null);
    try {
      const res = await requestSelfServeRefundAction({
        orderId,
        reason: 'Self-serve refund requested from learner billing page',
      });
      if (!res.ok) {
        setRefundFeedback((prev) => ({ ...prev, [orderId]: res.error }));
      } else {
        setRefundFeedback((prev) => ({
          ...prev,
          [orderId]: `Refund request submitted (Audit #${res.auditId}). Refundable: ${formatMoneyMinor(res.refundableMinor, 'BDT')}.`,
        }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refund request failed');
    } finally {
      setRefundingId(null);
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-28 w-full rounded-xl" />
        <Skeleton className="h-44 w-full rounded-xl" />
      </div>
    );
  }

  if (authRequired) {
    return (
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle>Sign in to view your orders &amp; entitlements</CardTitle>
          <CardDescription>
            Your active plans, AI credit balance, Mushak VAT receipts, and refund options are tied to
            your authenticated account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/sign-in">
            <Button>Sign In</Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Callout type="trap" title="Unable to load billing details">
        {error || 'Unknown error'}
      </Callout>
    );
  }

  return (
    <div className="space-y-6">
      {showAccountSecurity && (
        <Card className="border-border bg-surface">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-lg">
                <ShieldCheck className="text-accent h-5 w-5" />
                Account &amp; Security
              </CardTitle>
              <Badge variant={data.twoFactorVerified ? 'default' : 'outline'}>
                {data.twoFactorVerified ? '2FA Verified' : 'Standard Session'}
              </Badge>
            </div>
            <CardDescription>
              Roles: {data.roles.join(', ')} · Actor ID: <code className="text-xs">{data.actorId}</code>
            </CardDescription>
          </CardHeader>
        </Card>
      )}

      {/* Active Entitlements & Allowances */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border bg-surface">
          <CardHeader className="pb-2">
            <CardDescription>Active Tier</CardDescription>
            <CardTitle className="text-2xl font-bold uppercase">{data.activeTier}</CardTitle>
          </CardHeader>
          <CardContent className="text-fg-muted text-xs">
            {data.entitlements.length} active entitlement{data.entitlements.length === 1 ? '' : 's'}
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <Sparkles className="text-accent h-3.5 w-3.5" /> AI Credits Remaining
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{data.aiCreditsRemaining}</CardTitle>
          </CardHeader>
          <CardContent className="text-fg-muted text-xs">
            Writing (1), Speaking Part (1), Full Speaking (2)
          </CardContent>
        </Card>

        <Card className="border-border bg-surface">
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-1">
              <FileCheck2 className="text-accent h-3.5 w-3.5" /> Mock Attempts Remaining
            </CardDescription>
            <CardTitle className="text-2xl font-bold">{data.mockAttemptsRemaining}</CardTitle>
          </CardHeader>
          <CardContent className="text-fg-muted text-xs">
            Full adaptive GRE &amp; IELTS CBT mocks
          </CardContent>
        </Card>
      </div>

      {/* Active Entitlements List */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="text-lg">Active Entitlements</CardTitle>
          <CardDescription>Server-verified access grants and expiry dates.</CardDescription>
        </CardHeader>
        <CardContent>
          {data.entitlements.length === 0 ? (
            <div className="text-fg-muted flex items-center justify-between rounded-lg border border-dashed p-4 text-sm">
              <span>No paid entitlements active yet.</span>
              <Link href="/courses">
                <Button variant="outline" size="sm">
                  Browse Courses
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {data.entitlements.map((ent) => (
                <div
                  key={ent.id}
                  className="border-border flex flex-wrap items-center justify-between gap-2 rounded-lg border p-3 text-sm"
                >
                  <div>
                    <div className="font-semibold">{ent.productSlug}</div>
                    <div className="text-fg-muted text-xs">
                      Started {new Date(ent.startsAt).toLocaleDateString()}
                      {ent.endsAt ? ` · Ends ${new Date(ent.endsAt).toLocaleDateString()}` : ' · Lifetime / No expiry'}
                    </div>
                  </div>
                  <Badge variant="default" className="uppercase">
                    {ent.tier} · {ent.revokedAt ? 'REVOKED' : 'ACTIVE'}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Orders, Mushak/VAT Breakdown & 1-Click Self-Serve Refund */}
      <Card className="border-border bg-surface">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Receipt className="text-accent h-5 w-5" />
            Orders, Mushak 6.3 / VAT Receipts &amp; Refunds
          </CardTitle>
          <CardDescription>
            15% BD VAT-inclusive breakdown and 1-click self-serve refund eligibility (7-day window,
            &lt;20% consumed, &le;1 full mock).
          </CardDescription>
        </CardHeader>
        <CardContent>
          {data.orders.length === 0 ? (
            <div className="text-fg-muted flex items-center justify-between rounded-lg border border-dashed p-4 text-sm">
              <span>You have not placed any orders yet.</span>
              <Link href="/checkout">
                <Button variant="outline" size="sm">
                  Go to Checkout
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {data.orders.map(({ order, vatBreakdown, eligibility }) => {
                const feedback = refundFeedback[order.id];
                return (
                  <div
                    key={order.id}
                    className="border-border space-y-3 rounded-xl border p-4 text-sm"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <div className="font-bold">{order.productName}</div>
                        <div className="text-fg-muted font-mono text-xs">
                          Ref: {order.providerRef} · {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={order.status === 'paid' ? 'default' : 'outline'}>
                          {order.status.toUpperCase()}
                        </Badge>
                        <span className="font-bold">
                          {formatMoneyMinor(order.amountMinor, order.currency)}
                        </span>
                      </div>
                    </div>

                    {/* Mushak 6.3 / VAT Breakdown */}
                    <div className="bg-surface-2/60 grid gap-2 rounded-lg p-3 text-xs sm:grid-cols-3">
                      <div>
                        <span className="text-fg-muted block">Base Net (Excl. VAT)</span>
                        <span className="font-semibold">
                          {formatMoneyMinor(vatBreakdown.net_minor, order.currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-fg-muted block">
                          BD VAT ({(vatBreakdown.vatRateBps / 100).toFixed(0)}%)
                        </span>
                        <span className="font-semibold">
                          {formatMoneyMinor(vatBreakdown.vat_minor, order.currency)}
                        </span>
                      </div>
                      <div>
                        <span className="text-fg-muted block">Mushak Gross Total</span>
                        <span className="font-semibold">
                          {formatMoneyMinor(vatBreakdown.gross_minor, order.currency)}
                        </span>
                      </div>
                    </div>

                    {/* 1-Click Self-Serve Refund */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="text-fg-muted text-xs">
                        {eligibility.eligible ? (
                          <span>
                            Eligible for self-serve refund up to{' '}
                            <strong>
                              {formatMoneyMinor(eligibility.refundableMinor, order.currency)}
                            </strong>{' '}
                            ({Math.round(eligibility.consumedPct * 100)}% consumed).
                          </span>
                        ) : (
                          <span className="flex items-center gap-1">
                            <AlertCircle className="h-3.5 w-3.5" />
                            Not eligible: {eligibility.reasons.join(', ')}
                          </span>
                        )}
                      </div>

                      {order.status === 'paid' && (
                        <Button
                          size="sm"
                          variant={eligibility.eligible ? 'outline' : 'ghost'}
                          disabled={!eligibility.eligible || refundingId === order.id}
                          onClick={() => handleRefundRequest(order.id)}
                          className="gap-1.5"
                        >
                          {refundingId === order.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RotateCcw className="h-3.5 w-3.5" />
                          )}
                          Request Refund
                        </Button>
                      )}
                    </div>

                    {feedback && (
                      <Callout type="concept" title="Refund Update">
                        {feedback}
                      </Callout>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
