/** @purpose Staff Support Console Service and Masked PII Display (docs/27 §16, D4) */
import { assertCan, type Actor } from '../auth/index';
import { maskEmail, maskPhone } from './masking';
import type {
  SupportTicket,
  MaskedSupportTicket,
  SupportTicketStatus,
  SupportPriority,
} from './types';
import { getMacroByCode } from './macros';

// Seed demo tickets for staff console stub
const IN_MEMORY_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-101',
    userId: 'usr-bangla-901',
    userEmail: 'tanvir.ahmed.bd@gmail.com',
    userPhone: '+8801711234567',
    subject: 'bKash payment completed but course still locked (TrxID: 9JK8L1M2)',
    categoryCode: 'PAY-01',
    priority: 'p0',
    tier: 'live',
    status: 'open',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    slaDueHours: 4,
    messages: [
      {
        id: 'msg-1',
        sender: 'user',
        senderName: 'Tanvir Ahmed',
        text: 'I sent 4500 BDT via bKash TrxID 9JK8L1M2 for GRE Live Batch, but the dashboard still asks me to enroll. Please verify!',
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'tkt-102',
    userId: 'usr-student-402',
    userEmail: 'ayman.gre.learner@outlook.com',
    userPhone: '+8801819876543',
    subject: 'Score dispute on GRE Issue Essay evaluation',
    categoryCode: 'AIS-02',
    priority: 'p1',
    tier: 'plus',
    status: 'open',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    slaDueHours: 24,
    messages: [
      {
        id: 'msg-2',
        sender: 'user',
        senderName: 'Ayman R.',
        text: 'The AI gave my Analytical Writing essay a 3.5 citing weak development, but I followed the ETS 5.0 guide with 3 distinct paragraphs and counterarguments. Requesting human grader re-evaluation.',
        createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'tkt-103',
    userId: 'usr-ielts-305',
    userEmail: 'nusrat.jahan.ielts@yahoo.com',
    userPhone: '+8801912340987',
    subject: 'Disconnection during IELTS Academic Reading Mock Test',
    categoryCode: 'EXM-01',
    priority: 'p1',
    tier: 'mentor',
    status: 'pending_staff',
    createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    slaDueHours: 4,
    messages: [
      {
        id: 'msg-3',
        sender: 'user',
        senderName: 'Nusrat Jahan',
        text: 'My Wi-Fi dropped for 6 minutes during section 2. Can I get a test credit void so I can restart?',
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'tkt-104',
    userId: 'usr-core-112',
    userEmail: 'rahim.chowdhury@northsouth.edu',
    userPhone: '+8801678901234',
    subject: 'Refund request for GRE Express Mock Pack',
    categoryCode: 'REF-01',
    priority: 'p2',
    tier: 'core',
    status: 'resolved',
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    slaDueHours: 48,
    messages: [
      {
        id: 'msg-4',
        sender: 'user',
        senderName: 'Rahim Chowdhury',
        text: 'Purchased yesterday, haven taken any mock tests yet. Would like to refund.',
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'msg-5',
        sender: 'agent',
        senderName: 'Support Desk',
        text: 'Eligibility verified (0% consumed, 0 mocks). Refund initiated through SSLCommerz.',
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
    ],
  },
];

/**
 * Lists tickets with PII masked by default (docs/27 §16)
 * Enforces `assertCan(actor, 'support:read')`.
 */
export function listStaffSupportTickets(
  actor: Actor,
  filter?: {
    search?: string;
    status?: SupportTicketStatus;
    priority?: SupportPriority;
  }
): MaskedSupportTicket[] {
  // Server-authoritative permission check
  assertCan(actor, 'support:read');

  let results = [...IN_MEMORY_TICKETS];

  if (filter?.status) {
    results = results.filter((t) => t.status === filter.status);
  }

  if (filter?.priority) {
    results = results.filter((t) => t.priority === filter.priority);
  }

  if (filter?.search) {
    const q = filter.search.toLowerCase().trim();
    results = results.filter(
      (t) =>
        t.subject.toLowerCase().includes(q) ||
        t.id.toLowerCase().includes(q) ||
        t.categoryCode.toLowerCase().includes(q) ||
        t.userEmail.toLowerCase().includes(q)
    );
  }

  // Map to MaskedSupportTicket to ensure PII is never inadvertently exposed
  return results.map((t) => ({
    id: t.id,
    userId: t.userId,
    maskedEmail: maskEmail(t.userEmail),
    maskedPhone: t.userPhone ? maskPhone(t.userPhone) : undefined,
    subject: t.subject,
    categoryCode: t.categoryCode,
    priority: t.priority,
    tier: t.tier,
    status: t.status,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
    slaDueHours: t.slaDueHours,
    messages: t.messages,
  }));
}

/**
 * Retrieves a single ticket with masked PII for staff console inspection
 */
export function getStaffSupportTicket(
  actor: Actor,
  ticketId: string
): MaskedSupportTicket {
  assertCan(actor, 'support:read');

  const ticket = IN_MEMORY_TICKETS.find((t) => t.id === ticketId);
  if (!ticket) {
    throw new Error(`Support ticket '${ticketId}' not found`);
  }

  return {
    id: ticket.id,
    userId: ticket.userId,
    maskedEmail: maskEmail(ticket.userEmail),
    maskedPhone: ticket.userPhone ? maskPhone(ticket.userPhone) : undefined,
    subject: ticket.subject,
    categoryCode: ticket.categoryCode,
    priority: ticket.priority,
    tier: ticket.tier,
    status: ticket.status,
    createdAt: ticket.createdAt,
    updatedAt: ticket.updatedAt,
    slaDueHours: ticket.slaDueHours,
    messages: ticket.messages,
  };
}

/**
 * Applies a canned macro response to an active support ticket
 */
export function applySupportMacro(
  actor: Actor,
  ticketId: string,
  macroCode: string,
  replacements?: Record<string, string>
): MaskedSupportTicket {
  assertCan(actor, 'support:manage');

  const ticket = IN_MEMORY_TICKETS.find((t) => t.id === ticketId);
  if (!ticket) {
    throw new Error(`Support ticket '${ticketId}' not found`);
  }

  const macro = getMacroByCode(macroCode);
  if (!macro) {
    throw new Error(`Macro code '${macroCode}' not found`);
  }

  let replyText = macro.template;
  if (replacements) {
    for (const [key, value] of Object.entries(replacements)) {
      replyText = replyText.replace(new RegExp(`{{${key}}}`, 'g'), value);
    }
  }

  ticket.messages.push({
    id: `msg-${Date.now()}`,
    sender: 'agent',
    senderName: `Support Agent (${actor.id})`,
    text: replyText,
    createdAt: new Date().toISOString(),
  });
  ticket.status = 'pending_customer';
  ticket.updatedAt = new Date().toISOString();

  return getStaffSupportTicket(actor, ticketId);
}
