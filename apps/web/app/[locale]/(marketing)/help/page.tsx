/** @purpose Public Help Center with Searchable FAQs, SLA Badges, and Support Ingestion (/support) */
'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { brand } from '@lumen/config';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Input,
  Button,
} from '@lumen/ui';
import {
  Search,
  HelpCircle,
  Clock,
  Receipt,
  Sparkles,
  Laptop,
  Video,
  RotateCcw,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from 'lucide-react';
import {
  getPublicSlaBadges,
  searchFaqs,
} from '@lumen/core';

const CATEGORIES = [
  { id: 'all', label: 'All FAQs', icon: HelpCircle },
  { id: 'billing', label: 'Billing & VAT', icon: Receipt },
  { id: 'ai-scoring', label: 'AI Scoring Disclaimer', icon: Sparkles },
  { id: 'technical', label: 'Technical & CBT Shell', icon: Laptop },
  { id: 'live-batches', label: 'Live Batches & Zoom', icon: Video },
  { id: 'refunds', label: 'Refund Eligibility', icon: RotateCcw },
] as const;

export default function SupportHelpCenterPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-bill-01');

  const slaBadges = useMemo(() => getPublicSlaBadges(), []);

  const filteredFaqs = useMemo(() => {
    return searchFaqs(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20">
      {/* High-Contrast Oxford Navy Hero Search Section (BUG-12) */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 py-14 text-white shadow-xs sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-35"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-950/80 px-3.5 py-1 text-xs font-semibold text-blue-200">
            <HelpCircle className="h-3.5 w-3.5 text-blue-400" />
            <span>{brand.name} Trust &amp; Support Center</span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            How can our student team assist you?
          </h1>
          <p className="mt-3 max-w-2xl text-base text-slate-300">
            Search our knowledge base for instant answers on test mock diagnostics, Mushak 6.3 VAT billing, AI scoring disclaimers, or transparent refunds.
          </p>

          <div className="relative mt-8 max-w-2xl">
            <Search className="pointer-events-none absolute left-3.5 top-3.5 h-5 w-5 text-slate-400" />
            <Input
              type="text"
              placeholder="Search by keywords: 'Mushak 6.3', 'AI essay score', 'disconnection', 'refund'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-12 w-full rounded-xl border-slate-700 bg-white pl-11 pr-4 text-base text-slate-900 shadow-md focus:border-blue-600 focus:ring-blue-600"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-3.5 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        {/* Tier Response SLA Badges */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Guaranteed Support SLAs by Tier</h2>
              <p className="text-xs text-slate-500">
                Resolution clocks begin upon ticket submission during Bangladesh business hours (9am - 10pm BST).
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
            >
              Compare plan tiers <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slaBadges.map((sla) => (
              <Card key={sla.tier} className="border-slate-200 bg-white transition-all hover:border-blue-300">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                      {sla.tier}
                    </span>
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 font-semibold">
                      {sla.badgeLabel}
                    </Badge>
                  </div>
                  <CardTitle className="mt-1 flex items-center gap-1.5 text-base font-bold text-slate-900">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span>&le; {sla.resolutionHours}h SLA</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0 text-xs text-slate-600">
                  {sla.description}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Category Filter Pills */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-medium transition-colors ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'border border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isSelected ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <section className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <Card className="p-12 text-center text-slate-500">
              <HelpCircle className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-base font-medium">No matching questions found</p>
              <p className="mt-1 text-xs text-slate-400">
                Try searching for different keywords or submit an inquiry below.
              </p>
            </Card>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-2xs transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => toggleFaq(faq.id)}
                    className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-slate-50/50"
                  >
                    <div className="flex items-center gap-3 pr-4">
                      <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-2xs font-semibold uppercase tracking-wider text-slate-600">
                        {faq.categoryLabel}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                        {faq.question}
                      </h3>
                    </div>
                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 p-5 pt-3">
                      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                        {faq.answer}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {faq.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-slate-100 px-2.5 py-0.5 text-2xs text-slate-500"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </section>

        {/* Quick Links & Contact Channels */}
        <section className="mt-14 grid gap-6 sm:grid-cols-2">
          <Card className="border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600">
                <RotateCcw className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Self-Serve 7-Day Refund</h3>
                <p className="text-xs text-slate-500">Inspect consumed content % and request instant refund</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Eligible orders (&lt; 20% consumed, &le; 1 full mock) qualify for instant 1-click refunds under policy D12 C13b.
            </p>
            <div className="mt-4">
              <Link href="/orders">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  View Orders & Eligibility Meter
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-emerald-50 p-2.5 text-emerald-600">
                <MessageSquare className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Live & Mentor Join Desk</h3>
                <p className="text-xs text-slate-500">15-minute priority join desk during class hours</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              Active Live Batch and 1-on-1 Mentor students enjoy fast-track WhatsApp escalation and immediate class join assistance.
            </p>
            <div className="mt-4">
              <Link href="/app/plan">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  Open Study Plan & Join Links
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Legal & Compliance Notice */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            Official legal documentation:{' '}
            <Link href="/legal/terms" className="font-medium text-slate-700 underline hover:text-slate-900">
              Terms of Service
            </Link>
            {' • '}
            <Link href="/legal/privacy" className="font-medium text-slate-700 underline hover:text-slate-900">
              Privacy Policy
            </Link>
            {' • '}
            <Link href="/legal/refund-policy" className="font-medium text-slate-700 underline hover:text-slate-900">
              Refund Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
