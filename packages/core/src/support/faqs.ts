/** @purpose Searchable FAQ repository for Public Help Center (docs/27 §8) */
import type { SupportFaqItem } from './types';

export const SUPPORT_FAQS: SupportFaqItem[] = [
  // 1. Billing & Mushak 6.3
  {
    id: 'faq-bill-01',
    category: 'billing',
    categoryLabel: 'Billing & Invoicing',
    question: 'How do I obtain an official Mushak 6.3 VAT invoice for my purchase in Bangladesh?',
    answer:
      'All courses and mock test purchases in Bangladesh include statutory 15% VAT under NBR regulations. After completing your payment via SSLCommerz, bKash, or Nagad, your Mushak 6.3 tax invoice is automatically generated and downloadable from your Account Orders page (/orders). For institutional or corporate BIN invoicing, contact our support team.',
    tags: ['billing', 'vat', 'mushak', 'tax', 'invoice', 'bkash', 'sslcommerz'],
  },
  {
    id: 'faq-bill-02',
    category: 'billing',
    categoryLabel: 'Billing & Invoicing',
    question: 'Can I pay in installments via bKash or local cards?',
    answer:
      'Yes. Selected Live and Mentor packages offer an interest-free 2-part or 3-part installment schedule via bKash or credit card checkout. The second installment is due before class 3. Failure to settle scheduled payments may pause course access until reconciled.',
    tags: ['installment', 'bkash', 'payment', 'partial', 'cards'],
  },

  // 2. AI Scoring Disclaimer
  {
    id: 'faq-ai-01',
    category: 'ai-scoring',
    categoryLabel: 'AI Scoring & Assessment',
    question: 'Are AI-evaluated essay and speech scores officially endorsed by ETS or IELTS?',
    answer:
      'No. All AI evaluations, diagnostic scores, and band predictions are proprietary formative estimates developed to guide your preparation. They are strictly not certified by, affiliated with, or endorsed by ETS (GRE) or Cambridge/IDP/British Council (IELTS). Official test scores are issued exclusively by the respective test administrators.',
    tags: ['ai', 'scoring', 'disclaimer', 'ets', 'ielts', 'gre', 'trademarks'],
  },
  {
    id: 'faq-ai-02',
    category: 'ai-scoring',
    categoryLabel: 'AI Scoring & Assessment',
    question: 'What if I disagree with an AI-generated essay score or feedback?',
    answer:
      'If you believe an automated scoring assessment is inaccurate, you can submit a score dispute directly from your exam review screen. A certified human grader will review your submission against the official rubric within 48 hours (standard) or 24 hours (priority tiers) and provide written override rationale.',
    tags: ['dispute', 're-grade', 'human grader', 'rubric', 'essay'],
  },

  // 3. Technical Issues & Browser CBT Shell
  {
    id: 'faq-tech-01',
    category: 'technical',
    categoryLabel: 'Technical & Exam Shell',
    question: 'What happens if my internet connection drops during an exam mock test?',
    answer:
      'Our CBT exam shell includes automatic local autosave and an offline tolerance queue. If your connection drops for more than 2 minutes in exam mode, you may utilize the self-serve "I lost connection" void option once per attempt. Your mock credit will be restored to re-take the attempt with a fresh question seed.',
    tags: ['offline', 'disruption', 'connection', 'cbt', 'autosave', 'void'],
  },
  {
    id: 'faq-tech-02',
    category: 'technical',
    categoryLabel: 'Technical & Exam Shell',
    question: 'Which browsers and devices are supported for computer-based mock tests?',
    answer:
      'We recommend modern desktop versions of Chrome, Edge, Safari, or Firefox. While study materials and vocabulary flashcards are fully optimized for mobile devices, full-length CBT mock tests require a laptop or desktop with a physical keyboard and minimum 1366x768 screen resolution to replicate official ETS/IELTS test conditions.',
    tags: ['browser', 'requirements', 'cbt', 'desktop', 'screen'],
  },

  // 4. Live Batches & Zoom
  {
    id: 'faq-live-01',
    category: 'live-batches',
    categoryLabel: 'Live Batches & Mentorship',
    question: 'How do I access live Zoom sessions and class recordings?',
    answer:
      'Enrolled students in Live or Mentor batches can access Zoom join links directly from their study plan calendar (/app/plan) 15 minutes before scheduled class time. Secure class recordings are processed, dynamically watermarked, and uploaded to your portal within 24 hours of session completion.',
    tags: ['zoom', 'live', 'recording', 'schedule', 'join'],
  },
  {
    id: 'faq-live-02',
    category: 'live-batches',
    categoryLabel: 'Live Batches & Mentorship',
    question: 'What if I miss a scheduled live class or interactive workshop?',
    answer:
      'All live sessions are recorded and archived with chapter markers and downloadable slide decks. In addition, students can attend weekly live open Q&A office hours or ask questions asynchronously through the tutor portal.',
    tags: ['missed class', 'recording', 'attendance', 'office hours'],
  },

  // 5. Refunds & Self-Serve Eligibility (D12 C13b)
  {
    id: 'faq-ref-01',
    category: 'refunds',
    categoryLabel: 'Refund Policy & Eligibility',
    question: 'What are the rules and deadlines for requesting a course or mock pack refund?',
    answer:
      'Per our transparent policy (D12 C13b), refund requests must be initiated within 7 days of purchase (or 72 hours for express mock packs; before class 3 for 10-week live batches; before class 2 for 4-week crash courses). To remain eligible, you must have consumed less than 20% of course content and completed no more than 1 full mock test. You can check your eligibility meter and initiate an instant refund at /orders.',
    tags: ['refund', 'eligibility', '7 days', '20 percent', 'mocks', 'self-serve'],
  },
  {
    id: 'faq-ref-02',
    category: 'refunds',
    categoryLabel: 'Refund Policy & Eligibility',
    question: 'Are consumed AI credits refunded when an order is cancelled?',
    answer:
      'No. Consumed AI credits used for automated essay grading, speech evaluations, or tutor queries reflect non-recoverable cloud compute costs. The minor-unit value of consumed credits is deducted from your refund amount. Any issued diagnostic certificates or credentials associated with refunded orders are automatically revoked.',
    tags: ['ai credits', 'deduction', 'certificates', 'revocation', 'cost'],
  },
];

/**
 * Searches FAQs by query string across question, answer, and tags
 */
export function searchFaqs(query?: string, category?: string): SupportFaqItem[] {
  let results = SUPPORT_FAQS;

  if (category && category !== 'all') {
    results = results.filter((item) => item.category === category);
  }

  if (!query || query.trim().length === 0) {
    return results;
  }

  const cleanQuery = query.trim().toLowerCase();
  return results.filter(
    (item) =>
      item.question.toLowerCase().includes(cleanQuery) ||
      item.answer.toLowerCase().includes(cleanQuery) ||
      item.tags.some((t) => t.toLowerCase().includes(cleanQuery))
  );
}
