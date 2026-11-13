/** @purpose Domain types for Support, Trust Operations, SLA badges, and Masked PII (docs/27) */

export type SupportTier = 'free' | 'core' | 'plus' | 'live' | 'mentor' | 'org';

export type SupportPriority = 'p0' | 'p1' | 'p2' | 'p3';

export type SupportTicketStatus =
  | 'open'
  | 'pending_customer'
  | 'pending_staff'
  | 'resolved'
  | 'closed';

export interface SupportTicketMessage {
  id: string;
  sender: 'user' | 'agent' | 'system';
  senderName: string;
  text: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userEmail: string;
  userPhone?: string;
  subject: string;
  categoryCode: string;
  priority: SupportPriority;
  tier: SupportTier;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  slaDueHours: number;
  messages: SupportTicketMessage[];
}

export interface MaskedSupportTicket {
  id: string;
  userId: string;
  maskedEmail: string;
  maskedPhone?: string;
  subject: string;
  categoryCode: string;
  priority: SupportPriority;
  tier: SupportTier;
  status: SupportTicketStatus;
  createdAt: string;
  updatedAt: string;
  slaDueHours: number;
  messages: SupportTicketMessage[];
}

export interface SupportFaqItem {
  id: string;
  category: 'billing' | 'ai-scoring' | 'technical' | 'live-batches' | 'refunds';
  categoryLabel: string;
  question: string;
  answer: string;
  tags: string[];
}

export interface SupportMacro {
  id: string;
  code: string;
  category: string;
  title: string;
  template: string;
}

export interface SupportTierSla {
  tier: SupportTier;
  badgeLabel: string;
  firstResponseHours: number;
  resolutionHours: number;
  description: string;
}
