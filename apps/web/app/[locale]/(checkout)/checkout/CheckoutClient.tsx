/** @purpose Interactive checkout client with VAT breakdown, payment method selector, and SSLCommerz redirection */
'use client';

import React, { useState, useTransition } from 'react';
import {
  ShieldCheck,
  CreditCard,
  Lock,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { CANONICAL_PRODUCTS, type ProductDefinition } from '@lumen/core';
import { initiateCheckoutAction, submitManualCheckoutAction } from '@/app/actions/checkout';

interface CheckoutClientProps {
  initialProduct: ProductDefinition;
}

export function CheckoutClient({ initialProduct }: CheckoutClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductDefinition>(initialProduct);

  React.useEffect(() => {
    setSelectedProduct(initialProduct);
  }, [initialProduct]);
  const [name, setName] = useState('Ayman Rahman');
  const [email, setEmail] = useState('aymanrahman30@gmail.com');
  const [phone, setPhone] = useState('01712345678');
  const [address, setAddress] = useState('House 12, Road 4, Dhanmondi');
  const [city, setCity] = useState('Dhaka');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Manual payment state
  const [paymentTab, setPaymentTab] = useState<'sslcommerz' | 'manual'>('sslcommerz');
  const [manualMethod, setManualMethod] = useState<'bkash' | 'nagad'>('bkash');
  const [trxId, setTrxId] = useState('');
  const [manualSenderPhone, setManualSenderPhone] = useState('01712345678');
  const [manualSuccessMsg, setManualSuccessMsg] = useState<string | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleProductChange = (slug: string) => {
    const prod = CANONICAL_PRODUCTS.find((p) => p.slug === slug);
    if (prod) {
      setSelectedProduct(prod);
    }
  };

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setManualSuccessMsg(null);

    startTransition(async () => {
      try {
        if (paymentTab === 'sslcommerz') {
          const res = await initiateCheckoutAction({
            productSlug: selectedProduct.slug,
            name,
            email,
            phone,
            address,
            city,
          });

          if (res.redirectUrl) {
            window.location.href = res.redirectUrl;
          } else {
            setErrorMsg('Failed to initialize SSLCommerz gateway session.');
          }
        } else {
          // Manual bKash / Nagad payment fallback
          if (!trxId || trxId.trim().length < 6) {
            setErrorMsg('Please enter a valid Transaction ID (at least 6 alphanumeric characters).');
            return;
          }

          const res = await submitManualCheckoutAction({
            productSlug: selectedProduct.slug,
            name,
            email,
            phone,
            address,
            city,
            method: manualMethod,
            trxId: trxId.trim().toUpperCase(),
            senderNumber: manualSenderPhone.trim() || phone.trim(),
          });

          if (res.ok) {
            setManualSuccessMsg(
              `Manual payment submitted successfully! Order #${res.orderId} is now pending verification. Entitlements will activate once our finance team confirms TrxID ${res.trxId}.`
            );
            setTrxId('');
          }
        }
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Checkout initiation failed');
      }
    });
  };

  const basePriceMinor = Math.round(selectedProduct.prices.BD / 1.15);
  const vatMinor = selectedProduct.prices.BD - basePriceMinor;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Column: Billing Details & Payment Gateway */}
      <div className="space-y-6 lg:col-span-7">
        <div className="rounded-lg border border-[#e0e0e0] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center gap-2 border-b border-[#eee] pb-4">
            <Lock className="h-4 w-4 text-emerald-600" />
            <h2 className="text-lg font-bold text-[#111]">Student Billing Details</h2>
          </div>

          <form onSubmit={handleCheckoutSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#444] uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 w-full rounded border border-[#ccc] p-2.5 text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-[#444] uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded border border-[#ccc] p-2.5 text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#444] uppercase tracking-wider">
                  Mobile Number (BD)
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="01XXXXXXXXX"
                  className="mt-1 w-full rounded border border-[#ccc] p-2.5 text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-[#444] uppercase tracking-wider">
                  Billing Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="mt-1 w-full rounded border border-[#ccc] p-2.5 text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#444] uppercase tracking-wider">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1 w-full rounded border border-[#ccc] p-2.5 text-sm focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] focus:outline-none"
                />
              </div>
            </div>

            {/* Payment Method Tabs */}
            <div className="mt-6">
              <label className="block text-xs font-bold text-[#444] uppercase tracking-wider mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentTab('sslcommerz')}
                  className={`flex items-center justify-center gap-2 rounded border p-3 text-xs font-bold transition-all ${
                    paymentTab === 'sslcommerz'
                      ? 'border-[#1a56db] bg-blue-50/60 text-[#1a56db] ring-1 ring-[#1a56db]'
                      : 'border-[#ddd] bg-white text-[#555] hover:border-[#bbb]'
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  <span>Online Gateway (SSLCommerz)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentTab('manual')}
                  className={`flex items-center justify-center gap-2 rounded border p-3 text-xs font-bold transition-all ${
                    paymentTab === 'manual'
                      ? 'border-[#1a56db] bg-blue-50/60 text-[#1a56db] ring-1 ring-[#1a56db]'
                      : 'border-[#ddd] bg-white text-[#555] hover:border-[#bbb]'
                  }`}
                >
                  <ShieldCheck className="h-4 w-4" />
                  <span>Manual bKash / Nagad</span>
                </button>
              </div>
            </div>

            {paymentTab === 'sslcommerz' ? (
              /* Payment Gateway Callout */
              <div className="rounded-lg border border-blue-200 bg-blue-50/50 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-[#1a56db]" />
                    <span className="text-xs font-bold text-[#111]">
                      SSLCommerz Secure Bangladesh Gateway
                    </span>
                  </div>
                  <span className="rounded bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-900">
                    SANDBOX VERIFIED
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#555]">
                  Supports bKash, Nagad, Rocket, Upay, Visa, Mastercard, and Islamic Banking.
                  Transaction security verified by secondary Order Validation API.
                </p>
              </div>
            ) : (
              /* Manual bKash / Nagad Fallback */
              <div className="space-y-4 rounded-lg border border-amber-200 bg-amber-50/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-950">
                    Direct Merchant Payment (Fallback)
                  </span>
                  <span className="rounded bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-900">
                    OFFICIAL MERCHANT
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setManualMethod('bkash')}
                    className={`flex-1 rounded border py-2 text-xs font-bold transition-all ${
                      manualMethod === 'bkash'
                        ? 'border-pink-600 bg-pink-50 text-pink-700 ring-1 ring-pink-600'
                        : 'border-[#ddd] bg-white text-[#666]'
                    }`}
                  >
                    bKash Merchant
                  </button>
                  <button
                    type="button"
                    onClick={() => setManualMethod('nagad')}
                    className={`flex-1 rounded border py-2 text-xs font-bold transition-all ${
                      manualMethod === 'nagad'
                        ? 'border-orange-600 bg-orange-50 text-orange-700 ring-1 ring-orange-600'
                        : 'border-[#ddd] bg-white text-[#666]'
                    }`}
                  >
                    Nagad Merchant
                  </button>
                </div>

                <div className="rounded border border-amber-200/80 bg-white p-3 text-xs text-[#444] space-y-1.5">
                  <div className="flex justify-between font-mono font-bold text-sm text-[#111]">
                    <span>Merchant No:</span>
                    <span className="text-[#1a56db]">
                      {manualMethod === 'bkash' ? '01894928001' : '01894928002'}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#666]">
                    <strong>Instructions:</strong> Open {manualMethod === 'bkash' ? 'bKash App → "Make Payment"' : 'Nagad App → "Merchant Pay"'} → Enter merchant number above → Enter total amount (BDT {(selectedProduct.prices.BD / 100).toLocaleString()}) → Use your mobile number as reference → Enter PIN → Copy TrxID.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-[11px] font-bold text-[#444] uppercase">
                      Sender Mobile Number
                    </label>
                    <input
                      type="tel"
                      required={paymentTab === 'manual'}
                      value={manualSenderPhone}
                      onChange={(e) => setManualSenderPhone(e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className="mt-1 w-full rounded border border-[#ccc] p-2 text-xs focus:border-[#1a56db] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#444] uppercase">
                      Transaction ID (TrxID)
                    </label>
                    <input
                      type="text"
                      required={paymentTab === 'manual'}
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. BL54A92K1M"
                      className="mt-1 w-full rounded border border-[#ccc] p-2 text-xs font-mono uppercase focus:border-[#1a56db] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {errorMsg}
              </div>
            )}

            {manualSuccessMsg && (
              <div className="rounded border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 font-medium">
                {manualSuccessMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#1a56db] py-3 text-sm font-bold text-white shadow-xs hover:bg-[#1546b3] disabled:opacity-50"
            >
              <span>
                {isPending
                  ? paymentTab === 'sslcommerz'
                    ? 'Redirecting to Gateway...'
                    : 'Submitting TrxID...'
                  : paymentTab === 'sslcommerz'
                  ? 'Pay with SSLCommerz'
                  : 'Submit Manual TrxID for Verification'}
              </span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Order Summary & VAT Breakdown */}
      <div className="space-y-6 lg:col-span-5">
        <div className="sticky top-24 rounded-xl border border-border bg-surface p-6 shadow-xs">
          <h3 className="border-b border-border pb-3 text-sm font-bold tracking-tight text-fg">
            Order Summary
          </h3>

          {/* Product Picker */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-fg-muted">Select Plan / Package:</label>
            <select
              value={selectedProduct.slug}
              onChange={(e) => handleProductChange(e.target.value)}
              className="mt-1 w-full rounded border border-border bg-canvas p-2 text-xs font-medium text-fg focus:border-accent focus:outline-none"
            >
              {CANONICAL_PRODUCTS.map((prod) => (
                <option key={prod.slug} value={prod.slug}>
                  {prod.name} — BDT {(prod.prices.BD / 100).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Included Features */}
          <div className="mt-6 space-y-2 border-b border-border pb-6 text-xs text-fg-muted">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Full Computer-Based Mock Test Engine</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                {selectedProduct.allowances.ai_credits} AI Writing / AWA Rubric Evaluations
              </span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>{selectedProduct.allowances.full_mocks} Full Adaptive Mock Tests</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>FSRS Spaced-Repetition Active Recall Flashcards</span>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="mt-6 space-y-2 text-xs">
            <div className="flex justify-between text-fg-muted">
              <span>Base Subtotal:</span>
              <span>BDT {(basePriceMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-fg-muted">
              <span>15% BD VAT (Mushak 6.3 Included):</span>
              <span>BDT {(vatMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-3 text-base font-extrabold text-fg">
              <span>Grand Total:</span>
              <span className="text-accent">
                BDT {(selectedProduct.prices.BD / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-800 dark:text-emerald-300">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
            <span>100% refund within 7 days if less than 20% of course content is consumed.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
