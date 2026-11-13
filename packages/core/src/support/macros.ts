/** @purpose Support macros repository for support agents (docs/27 §5) */
import type { SupportMacro } from './types';

export const SUPPORT_MACROS: SupportMacro[] = [
  {
    id: 'macro-pay-01',
    code: 'PAY-TRX-CHECK',
    category: 'Billing',
    title: 'bKash / Nagad Transaction ID Verification',
    template:
      'Thank you for reaching out. We have received your payment query. We have initiated a transaction lookup with our gateway for TrxID {{trxId}}. Reconciliations run automatically every 5 minutes; if verified, your course access will be unlocked immediately and your Mushak 6.3 tax invoice will appear in your /orders tab.',
  },
  {
    id: 'macro-ais-01',
    code: 'AIS-DISPUTE-ACK',
    category: 'AI Scoring',
    title: 'AI Scoring Dispute Acknowledgement',
    template:
      'We have received your scoring dispute for submission {{submissionId}}. Our certified human grader panel has been assigned to re-evaluate your response against the official ETS/IELTS band rubric. You will receive an updated score and detailed feedback report within 48 hours (or 24 hours on priority tiers).',
  },
  {
    id: 'macro-exm-01',
    code: 'EXM-VOID-RESIT',
    category: 'Exam CBT',
    title: 'Exam Disruption Void & Resit Grant',
    template:
      'We apologize for the technical interruption during your mock test. In accordance with policy C30, we have verified the network disconnection (>2 min). Your disrupted attempt {{attemptId}} has been voided, and 1 full mock test credit has been refunded to your account so you can start a fresh attempt.',
  },
  {
    id: 'macro-ref-01',
    code: 'REF-SELF-SERVE',
    category: 'Refunds',
    title: 'Self-Serve Refund Eligibility Guidance',
    template:
      'You can review your refund eligibility status at any time on your account page at /orders. Per policy D12 C13b, refunds are processed within 7 days of purchase for accounts with < 20% course content consumed and <= 1 mock taken. Consumed AI credits are deducted at fair value, and any issued certificates will be revoked upon refund completion.',
  },
  {
    id: 'macro-bat-01',
    code: 'BAT-JOIN-DESK',
    category: 'Live Batches',
    title: 'Live Session Join Desk Assistance',
    template:
      'Hello! Our Live Operations join desk is active for your scheduled session. Please make sure you are logged into your account and click the secure Zoom launch link inside /app/plan. If you encounter passcode prompts, use the one-click credential token displayed on your class dashboard.',
  },
];

export function getMacroByCode(code: string): SupportMacro | undefined {
  return SUPPORT_MACROS.find((m) => m.code.toUpperCase() === code.toUpperCase());
}
