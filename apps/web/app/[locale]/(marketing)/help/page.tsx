/** @purpose Public Help Center with Searchable FAQs, SLA Badges, and Support Ingestion (/help, P2.6.1 Bilingual) */
'use client';

import React, { useState, useMemo } from 'react';
import { useLocale } from 'next-intl';
import { LocaleLink as Link } from '../../_components/LocaleLink';
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
import { getPublicSlaBadges, searchFaqs } from '@lumen/core';

const CATEGORIES = [
  { id: 'all', label: 'All FAQs', labelBn: 'সকল প্রশ্নোত্তর', icon: HelpCircle },
  { id: 'billing', label: 'Billing & VAT', labelBn: 'বিলিং ও মূসক ৬.৩ ভ্যাট', icon: Receipt },
  { id: 'ai-scoring', label: 'AI Scoring Disclaimer', labelBn: 'এআই স্কোরিং নীতিমালা', icon: Sparkles },
  { id: 'technical', label: 'Technical & CBT Shell', labelBn: 'টেকনিক্যাল ও সিবিটি শেল', icon: Laptop },
  { id: 'live-batches', label: 'Live Batches & Zoom', labelBn: 'লাইভ ব্যাচ ও জুম', icon: Video },
  { id: 'refunds', label: 'Refund Eligibility', labelBn: 'রিফান্ড যোগ্যতা', icon: RotateCcw },
] as const;

const FAQ_BN_TRANSLATIONS: Record<
  string,
  { categoryLabelBn: string; questionBn: string; answerBn: string }
> = {
  'faq-bill-01': {
    categoryLabelBn: 'বিলিং ও ইনভয়েস',
    questionBn: 'বাংলাদেশে আমার কেনাকাটার জন্য অফিসিয়াল মূসক ৬.৩ ভ্যাট চালান কীভাবে পাব?',
    answerBn:
      'বাংলাদেশে সকল কোর্স এবং মক টেস্ট কেনাকাটায় এনবিআর বিধিমালা অনুযায়ী ১৫% ভ্যাট অন্তর্ভুক্ত। SSLCommerz, বিকাশ বা নগদের মাধ্যমে পেমেন্ট সম্পন্ন করার পর আপনার অ্যাকাউন্টের অর্ডার পেজ (/orders) থেকে স্বয়ংক্রিয়ভাবে মূসক ৬.৩ ট্যাক্স ইনভয়েস ডাউনলোড করতে পারবেন। প্রাতিষ্ঠানিক BIN চালানের জন্য সাপোর্ট টিমে যোগাযোগ করুন।',
  },
  'faq-bill-02': {
    categoryLabelBn: 'বিলিং ও ইনভয়েস',
    questionBn: 'আমি কি বিকাশ বা লোকাল কার্ডের মাধ্যমে কিস্তিতে পরিশোধ করতে পারব?',
    answerBn:
      'হ্যাঁ। নির্বাচিত লাইভ এবং মেন্টর প্যাকেজগুলোতে বিকাশ বা কার্ড চেকআউটের মাধ্যমে সুদমুক্ত ২-কিস্তি বা ৩-কিস্তিতে পরিশোধের সুবিধা রয়েছে। ৩য় ক্লাসের আগে দ্বিতীয় কিস্তি পরিশোধযোগ্য। নির্ধারিত সময়ে কিস্তি পরিশোধ না করলে সাময়িকভাবে লাইভ ক্লাস অ্যাক্সেস স্থগিত থাকতে পারে।',
  },
  'faq-ai-01': {
    categoryLabelBn: 'এআই স্কোরিং ও মূল্যায়ন',
    questionBn: 'এআই-মূল্যায়নকৃত এসে এবং স্পিকিং স্কোর কি ETS বা IELTS দ্বারা অফিসিয়ালি অনুমোদিত?',
    answerBn:
      'না। সকল এআই মূল্যায়ন, ডায়াগনস্টিক স্কোর এবং ব্যান্ড পূর্বাভাস শুধুমাত্র আপনার প্রস্তুতির সহায়তার জন্য আনুমানিক সূচক। এগুলো ETS (GRE) বা কেমব্রিজ/IDP/ব্রিটিশ কাউন্সিল (IELTS) দ্বারা প্রত্যয়িত বা অনুমোদিত নয়। চূড়ান্ত অফিসিয়াল স্কোর কেবল সংশ্লিষ্ট পরীক্ষা কর্তৃপক্ষ প্রদান করে।',
  },
  'faq-ai-02': {
    categoryLabelBn: 'এআই স্কোরিং ও মূল্যায়ন',
    questionBn: 'এআই-প্রদত্ত এসে স্কোর বা ফিডব্যাকের সাথে আমি একমত না হলে কী করব?',
    answerBn:
      'আপনি যদি মনে করেন স্বয়ংক্রিয় স্কোরিং মূল্যায়নটি সঠিক নয়, তবে এক্সাম রিভিউ স্ক্রিন থেকে সরাসরি স্কোর ডিসপিউট জমা দিতে পারেন। একজন সার্টিফাইড হিউম্যান গ্রেডার ৪৮ ঘণ্টার (প্রায়োরিটি টিয়ারে ২৪ ঘণ্টা) মধ্যে অফিসিয়াল রুব্রিক অনুযায়ী আপনার লেখাটি পুনঃমূল্যায়ন করবেন।',
  },
  'faq-tech-01': {
    categoryLabelBn: 'টেকনিক্যাল ও এক্সাম শেল',
    questionBn: 'মক টেস্ট চলাকালীন আমার ইন্টারনেট সংযোগ বিচ্ছিন্ন হলে কী হবে?',
    answerBn:
      'আমাদের সিবিটি এক্সাম শেলে স্বয়ংক্রিয় লোকাল অটোসেভ এবং অফলাইন টলারেন্স কিউ রয়েছে। পরীক্ষা মোডে ২ মিনিটের বেশি সংযোগ বিচ্ছিন্ন থাকলে আপনি প্রতি অ্যাটেম্পটে একবার সেলফ-সার্ভ "I lost connection" অপশন ব্যবহার করতে পারবেন এবং আপনার মক ক্রেডিট ফেরত দেওয়া হবে।',
  },
  'faq-tech-02': {
    categoryLabelBn: 'টেকনিক্যাল ও এক্সাম শেল',
    questionBn: 'কম্পিউটার-ভিত্তিক মক টেস্টের জন্য কোন ব্রাউজার এবং ডিভাইস সমর্থিত?',
    answerBn:
      'আমরা ডেস্কটপের আধুনিক Chrome, Edge, Safari বা Firefox ব্যবহারের পরামর্শ দিই। ফ্ল্যাশকার্ড ও স্টাডি মেটেরিয়াল মোবাইলে সম্পূর্ণ অপ্টিমাইজড হলেও পূর্ণাঙ্গ সিবিটি মক টেস্টের জন্য ল্যাপটপ বা ডেস্কটপ (ন্যূনতম ১৩৬৬x৭৬৮ স্ক্রিন রেজোলিউশন) ব্যবহার করা আবশ্যক।',
  },
  'faq-live-01': {
    categoryLabelBn: 'লাইভ ব্যাচ ও মেন্টরশিপ',
    questionBn: 'আমি কীভাবে লাইভ জুম সেশন এবং ক্লাস রেকর্ডিং অ্যাক্সেস করব?',
    answerBn:
      'লাইভ বা মেন্টর ব্যাচে ভর্তিকৃত শিক্ষার্থীরা নির্ধারিত ক্লাসের ১৫ মিনিট আগে তাদের স্টাডি প্ল্যান ক্যালেন্ডার (/app/plan) থেকে সরাসরি জুম জয়েন লিংক পাবেন। ক্লাস শেষ হওয়ার ২৪ ঘণ্টার মধ্যে ডাইনামিক ওয়াটারমার্কসহ এইচডি রেকর্ডিং পোর্টালে আপলোড করা হয়।',
  },
  'faq-live-02': {
    categoryLabelBn: 'লাইভ ব্যাচ ও মেন্টরশিপ',
    questionBn: 'কোনো নির্ধারিত লাইভ ক্লাস বা ওয়ার্কশপ মিস হয়ে গেলে কী করব?',
    answerBn:
      'সকল লাইভ সেশন চ্যাপ্টার মার্কার এবং স্লাইড ডেকসহ আর্কাইভ করা থাকে। এছাড়াও শিক্ষার্থীরা সাপ্তাহিক লাইভ Q&A অফিস আওয়ারে অংশ নিতে পারেন বা টিউটর পোর্টালে প্রশ্ন করতে পারেন।',
  },
  'faq-ref-01': {
    categoryLabelBn: 'রিফান্ড নীতিমালা ও যোগ্যতা',
    questionBn: 'কোর্স বা মক প্যাক রিফান্ড করার নিয়ম এবং সময়সীমা কী?',
    answerBn:
      'আমাদের স্বচ্ছ নীতিমালা (D12 C13b) অনুযায়ী, কেনাকাটার ৭ দিনের মধ্যে (মক প্যাকের জন্য ৭২ ঘণ্টা; ১০-সপ্তাহের লাইভ ব্যাচে ৩য় ক্লাসের আগে; ক্র্যাশ কোর্সে ২য় ক্লাসের আগে) রিফান্ড আবেদন করতে হবে। যোগ্য থাকতে হলে কোর্সের ২০%-এর কম সম্পন্ন এবং সর্বোচ্চ ১টি পূর্ণাঙ্গ মক টেস্ট দেওয়া যাবে। আপনি /orders পেজে আপনার যোগ্যতা মিটার দেখে ১-ক্লিকে রিফান্ড নিতে পারেন।',
  },
  'faq-ref-02': {
    categoryLabelBn: 'রিফান্ড নীতিমালা ও যোগ্যতা',
    questionBn: 'অর্ডার বাতিল করলে কি ব্যবহৃত এআই ক্রেডিটগুলোর টাকা ফেরত দেওয়া হয়?',
    answerBn:
      'না। ব্যবহৃত এআই ক্রেডিটগুলোর ক্লাউড কমপিউট খরচ অফেরতযোগ্য হওয়ায় ব্যবহৃত ক্রেডিটের সমপরিমাণ মূল্য রিফান্ডের অংক থেকে বাদ দেওয়া হয় এবং সংশ্লিষ্ট অর্ডারের সার্টিফিকেট বাতিল করা হয়।',
  },
};

const SLA_BN_TRANSLATIONS: Record<string, { tierBn: string; badgeBn: string; descBn: string }> = {
  mentor: {
    tierBn: 'মেন্টর',
    badgeBn: 'মেন্টর ৪ ঘণ্টা',
    descBn: 'ডেডিকেটেড ১-অন-১ মেন্টর সাপোর্ট। ৩০ মিনিটের মধ্যে প্রথম উত্তর, ৪ ঘণ্টার মধ্যে সমাধান।',
  },
  live: {
    tierBn: 'লাইভ ব্যাচ',
    badgeBn: 'লাইভ ১২ ঘণ্টা',
    descBn: 'লাইভ ব্যাচ প্রায়োরিটি কিউ। হোয়াটসঅ্যাপ অগ্রাধিকার, ১২ ঘণ্টায় সমাধান, ক্লাসের দিনে ১৫ মিনিট জয়েন ডেস্ক।',
  },
  plus: {
    tierBn: 'প্লাস',
    badgeBn: 'প্লাস ২৪ ঘণ্টা',
    descBn: 'পূর্ণাঙ্গ প্লাস সাপোর্ট। ১ ঘণ্টার মধ্যে এজেন্ট রেসপন্স এবং ২৪ ঘণ্টার মধ্যে সমাধান।',
  },
  core: {
    tierBn: 'কোর',
    badgeBn: 'কোর ৪৮ ঘণ্টা',
    descBn: 'পোর্টাল এবং ইমেইলের মাধ্যমে কোর লার্নার সাপোর্ট। ৪৮ ঘণ্টার মধ্যে সমাধান।',
  },
};

export default function SupportHelpCenterPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';
  const brandDisplayName = isBn ? 'লুমেন একাডেমি' : brand.name;

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>('faq-bill-01');

  const slaBadges = useMemo(() => getPublicSlaBadges(), []);

  const filteredFaqs = useMemo(() => {
    const baseResults = searchFaqs(searchQuery, selectedCategory);
    if (baseResults.length > 0 || !searchQuery.trim() || !isBn) {
      return baseResults;
    }
    // Also support searching in Bengali text
    const allInCat = searchFaqs('', selectedCategory);
    const q = searchQuery.trim().toLowerCase();
    return allInCat.filter((faq) => {
      const bn = FAQ_BN_TRANSLATIONS[faq.id];
      return (
        bn &&
        (bn.questionBn.toLowerCase().includes(q) || bn.answerBn.toLowerCase().includes(q))
      );
    });
  }, [searchQuery, selectedCategory, isBn]);

  const toggleFaq = (id: string) => {
    setExpandedFaqId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen bg-slate-50/70 pb-20" data-locale={locale}>
      {/* Asymmetric 12-Column Split Hero Search Section */}
      <section className="relative overflow-hidden border-b border-slate-800 bg-[#001E42] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left 7 Columns: Editorial Kicker, Bold Left-Aligned Heading, Search Bar */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-slate-200">
              {isBn
                ? `${brandDisplayName} ট্রাস্ট ও সাপোর্ট সেন্টার`
                : `${brand.name} Trust & Support Center`}
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {isBn
                ? 'আমাদের স্টুডেন্ট সাপোর্ট টিম আপনাকে কীভাবে সাহায্য করতে পারে?'
                : 'How can our student team assist you?'}
            </h1>
            <p className="max-w-2xl text-base text-slate-300 leading-relaxed">
              {isBn
                ? 'মক টেস্ট ডায়াগনস্টিক, মূসক ৬.৩ ভ্যাট চালান, এআই স্কোরিং নীতিমালা অথবা স্বচ্ছ রিফান্ড প্রক্রিয়ার তাৎক্ষণিক উত্তরের জন্য আমাদের নলেজ বেস অনুসন্ধান করুন।'
                : 'Search our knowledge base for instant answers on test mock diagnostics, Mushak 6.3 VAT billing, AI scoring disclaimers, or transparent refunds.'}
            </p>

            <div className="relative pt-2 max-w-2xl">
              <Search className="pointer-events-none absolute left-3.5 top-5.5 h-5 w-5 text-slate-400" />
              <Input
                type="text"
                placeholder={
                  isBn
                    ? "কীওয়ার্ড দিয়ে খুঁজুন: 'Mushak 6.3', 'ভ্যাট', 'এআই স্কোর', 'রিফান্ড'..."
                    : "Search by keywords: 'Mushak 6.3', 'AI essay score', 'disconnection', 'refund'..."
                }
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 w-full rounded-xl border-slate-700 bg-white pl-11 pr-4 text-base text-slate-900 shadow-md focus:border-blue-600 focus:ring-blue-600"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-5.5 text-xs font-medium text-slate-500 hover:text-slate-800"
                >
                  {isBn ? 'মুছুন' : 'Clear'}
                </button>
              )}
            </div>
          </div>

          {/* Right 5 Columns: Student Support Poster Collage & Guaranteed SLA Card */}
          <div className="lg:col-span-5 relative">
            <div
              className="absolute -top-3 -right-3 h-full w-full rounded-2xl bg-[#E4002B] opacity-85"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-3 -left-3 h-full w-full rounded-2xl bg-[#00A896] opacity-80"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=85"
                alt={
                  isBn
                    ? 'শিক্ষার্থী সহায়তা ও একাডেমিক পরামর্শ দল'
                    : 'Student support and academic mentoring desk'
                }
                className="h-[320px] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001E42]/95 via-[#001E42]/35 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-slate-200 bg-white/95 p-4 text-slate-900 shadow-xl backdrop-blur-xs space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-[#001E42]">
                  <span>
                    {isBn
                      ? 'ঢাকা স্টুডেন্ট সাপোর্ট ডেস্ক (৯টা – ১০টা BST)'
                      : 'Dhaka Student Desk (9am – 10pm BST)'}
                  </span>
                  <span className="rounded bg-[#00A896]/15 px-2 py-0.5 text-[10px] font-extrabold text-[#006677]">
                    Mushak 6.3 Verified
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  {isBn
                    ? '৭-দিনের ১-ক্লিক স্বচ্ছ রিফান্ড এবং লাইভ ক্লাস চলাকালীন ১৫-মিনিট জয়েন ডেস্ক সহায়তা।'
                    : '7-day 1-click self-serve refund eligibility and 15-minute live batch join desk.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6">
        {/* Tier Response SLA Badges */}
        <section className="mb-12">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {isBn ? 'প্ল্যান অনুযায়ী নিশ্চিত সাপোর্ট সময়সীমা (SLA)' : 'Guaranteed Support SLAs by Tier'}
              </h2>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'বাংলাদেশ অফিস চলাকালীন সময়ে (সকাল ৯টা – রাত ১০টা BST) টিকেট জমা দেওয়ার সাথে সাথেই সমাধানের সময় গণনা শুরু হয়।'
                  : 'Resolution clocks begin upon ticket submission during Bangladesh business hours (9am - 10pm BST).'}
              </p>
            </div>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
            >
              {isBn ? 'প্ল্যানগুলো তুলনা করুন' : 'Compare plan tiers'}{' '}
              <ExternalLink className="h-3 w-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {slaBadges.map((sla) => {
              const slaBn = SLA_BN_TRANSLATIONS[sla.tier];
              return (
                <Card key={sla.tier} className="border-slate-200 bg-white transition-all hover:border-blue-300">
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium uppercase tracking-wider text-slate-500">
                        {isBn && slaBn ? slaBn.tierBn : sla.tier}
                      </span>
                      <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700 font-semibold">
                        {isBn && slaBn ? slaBn.badgeBn : sla.badgeLabel}
                      </Badge>
                    </div>
                    <CardTitle className="mt-1 flex items-center gap-1.5 text-base font-bold text-slate-900">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span>
                        &le; {sla.resolutionHours}
                        {isBn ? ' ঘণ্টা SLA' : 'h SLA'}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-slate-600">
                    {isBn && slaBn ? slaBn.descBn : sla.description}
                  </CardContent>
                </Card>
              );
            })}
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
                <span>{isBn ? cat.labelBn : cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* FAQ Accordion List */}
        <section className="space-y-3">
          {filteredFaqs.length === 0 ? (
            <Card className="p-12 text-center text-slate-500">
              <HelpCircle className="mx-auto mb-3 h-10 w-10 text-slate-300" />
              <p className="text-base font-medium">
                {isBn ? 'কোনো প্রাসঙ্গিক প্রশ্ন পাওয়া যায়নি' : 'No matching questions found'}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {isBn
                  ? 'অনুগ্রহ করে ভিন্ন কীওয়ার্ড দিয়ে খুঁজুন অথবা নিচের সাপোর্ট চ্যানেলে যোগাযোগ করুন।'
                  : 'Try searching for different keywords or submit an inquiry below.'}
              </p>
            </Card>
          ) : (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedFaqId === faq.id;
              const bnFaq = FAQ_BN_TRANSLATIONS[faq.id];
              const categoryLabel = isBn && bnFaq ? bnFaq.categoryLabelBn : faq.categoryLabel;
              const question = isBn && bnFaq ? bnFaq.questionBn : faq.question;
              const answer = isBn && bnFaq ? bnFaq.answerBn : faq.answer;

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
                        {categoryLabel}
                      </span>
                      <h3 className="text-sm font-semibold text-slate-900 sm:text-base">
                        {question}
                      </h3>
                    </div>
                    <div className="shrink-0 text-slate-400">
                      {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="border-t border-slate-100 p-5 pt-3">
                      <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                        {answer}
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
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'সেলফ-সার্ভ ৭-দিনের রিফান্ড' : 'Self-Serve 7-Day Refund'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? 'ব্যবহৃত কনটেন্টের % দেখুন এবং তাৎক্ষণিক রিফান্ড অনুরোধ করুন'
                    : 'Inspect consumed content % and request instant refund'}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              {isBn
                ? 'যোগ্য অর্ডারগুলো (< ২০% ব্যবহৃত, ≤ ১টি পূর্ণাঙ্গ মক) নীতিমালা D12 C13b অনুযায়ী তাৎক্ষণিক ১-ক্লিক রিফান্ডের আওতাভুক্ত।'
                : 'Eligible orders (< 20% consumed, ≤ 1 full mock) qualify for instant 1-click refunds under policy D12 C13b.'}
            </p>
            <div className="mt-4">
              <Link href="/orders">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  {isBn
                    ? 'অর্ডার ও রিফান্ড যোগ্যতা মিটার দেখুন'
                    : 'View Orders & Eligibility Meter'}
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
                <h3 className="text-sm font-bold text-slate-900">
                  {isBn ? 'লাইভ ও মেন্টর জয়েন ডেস্ক' : 'Live & Mentor Join Desk'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isBn
                    ? 'ক্লাস চলাকালীন ১৫-মিনিটের অগ্রাধিকার জয়েন ডেস্ক'
                    : '15-minute priority join desk during class hours'}
                </p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-600">
              {isBn
                ? 'সক্রিয় লাইভ ব্যাচ এবং ১-অন-১ মেন্টর শিক্ষার্থীরা ফাস্ট-ট্র্যাক হোয়াটসঅ্যাপ সাপোর্ট এবং তাৎক্ষণিক ক্লাসে যুক্ত হওয়ার সহায়তা পান।'
                : 'Active Live Batch and 1-on-1 Mentor students enjoy fast-track WhatsApp escalation and immediate class join assistance.'}
            </p>
            <div className="mt-4">
              <Link href="/app/plan">
                <Button variant="outline" size="sm" className="w-full text-xs font-semibold">
                  {isBn
                    ? 'স্টাডি প্ল্যান ও জয়েন লিংক খুলুন'
                    : 'Open Study Plan & Join Links'}
                </Button>
              </Link>
            </div>
          </Card>
        </section>

        {/* Legal & Compliance Notice */}
        <div className="mt-12 text-center">
          <p className="text-xs text-slate-500">
            {isBn ? 'অফিসিয়াল আইনি নীতিমালা:' : 'Official legal documentation:'}{' '}
            <Link href="/legal/terms" className="font-medium text-slate-700 underline hover:text-slate-900">
              {isBn ? 'ব্যবহারের শর্তাবলি' : 'Terms of Service'}
            </Link>
            {' • '}
            <Link href="/legal/privacy" className="font-medium text-slate-700 underline hover:text-slate-900">
              {isBn ? 'গোপনীয়তা নীতি' : 'Privacy Policy'}
            </Link>
            {' • '}
            <Link href="/legal/refund-policy" className="font-medium text-slate-700 underline hover:text-slate-900">
              {isBn ? 'রিফান্ড নীতিমালা' : 'Refund Policy'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
