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
import { initiateCheckoutAction } from '@/app/actions/checkout';

interface CheckoutClientProps {
  initialProduct: ProductDefinition;
}

export function CheckoutClient({ initialProduct }: CheckoutClientProps) {
  const [selectedProduct, setSelectedProduct] = useState<ProductDefinition>(initialProduct);
  const [name, setName] = useState('Ayman Rahman');
  const [email, setEmail] = useState('aymanrahman30@gmail.com');
  const [phone, setPhone] = useState('01712345678');
  const [address, setAddress] = useState('House 12, Road 4, Dhanmondi');
  const [city, setCity] = useState('Dhaka');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

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

    startTransition(async () => {
      try {
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
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : 'Checkout initiation failed');
      }
    });
  };

  const basePriceMinor = Math.round(selectedProduct.prices.BD / 1.05);
  const vatMinor = selectedProduct.prices.BD - basePriceMinor;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
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

            {/* Payment Gateway Callout */}
            <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50/50 p-4">
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

            {errorMsg && (
              <div className="rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded bg-[#1a56db] py-3 text-sm font-bold text-white shadow-xs hover:bg-[#1546b3] disabled:opacity-50"
            >
              <span>{isPending ? 'Redirecting to Gateway...' : 'Pay with SSLCommerz'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Right Column: Order Summary & VAT Breakdown */}
      <div className="space-y-6 lg:col-span-5">
        <div className="rounded-lg border border-[#e0e0e0] bg-[#fafafa] p-6 shadow-xs">
          <h3 className="border-b border-[#eee] pb-3 text-sm font-bold tracking-tight text-[#222]">
            Order Summary
          </h3>

          {/* Product Picker */}
          <div className="mt-4">
            <label className="block text-xs font-semibold text-[#666]">Select Plan / Package:</label>
            <select
              value={selectedProduct.slug}
              onChange={(e) => handleProductChange(e.target.value)}
              className="mt-1 w-full rounded border border-[#ccc] bg-white p-2 text-xs font-medium text-[#222]"
            >
              {CANONICAL_PRODUCTS.map((prod) => (
                <option key={prod.slug} value={prod.slug}>
                  {prod.name} — BDT {(prod.prices.BD / 100).toLocaleString()}
                </option>
              ))}
            </select>
          </div>

          {/* Included Features */}
          <div className="mt-6 space-y-2 border-b border-[#eee] pb-6 text-xs text-[#555]">
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
            <div className="flex justify-between text-[#666]">
              <span>Base Subtotal:</span>
              <span>BDT {(basePriceMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between text-[#666]">
              <span>5% Educational VAT (Included):</span>
              <span>BDT {(vatMinor / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
            </div>
            <div className="flex justify-between border-t border-[#ddd] pt-3 text-base font-extrabold text-[#111]">
              <span>Grand Total:</span>
              <span className="text-[#1a56db]">
                BDT {(selectedProduct.prices.BD / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 p-3 text-[11px] text-emerald-900">
            <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-700" />
            <span>7-Day Money-Back Guarantee if &lt;20% course consumed (docs/00 §D5).</span>
          </div>
        </div>
      </div>
    </div>
  );
}
