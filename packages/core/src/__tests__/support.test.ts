/** @purpose Unit tests for Support & Trust domain: SLA badges, PII masking, FAQs, and staff authorization (docs/27) */
import { describe, it, expect } from 'vitest';
import {
  maskEmail,
  maskPhone,
  maskName,
  getPublicSlaBadges,
  SUPPORT_TIER_SLAS,
  searchFaqs,
  SUPPORT_MACROS,
  getMacroByCode,
  listStaffSupportTickets,
  getStaffSupportTicket,
  applySupportMacro,
  AuthorizationError,
  TwoFactorRequiredError,
  type Actor,
} from '../index';

describe('Support & Trust Domain (docs/27, P1-65)', () => {
  describe('PII Masking (D4, doc 27 §16)', () => {
    it('masks email addresses correctly', () => {
      expect(maskEmail('aymanrahman30@gmail.com')).toBe('a*****0@gmail.com');
      expect(maskEmail('tanvir@bangladesh.org')).toBe('t****r@bangladesh.org');
      expect(maskEmail('ab@domain.com')).toBe('a*@domain.com');
      expect(maskEmail('invalid-email')).toBe('***@***');
    });

    it('masks phone numbers correctly', () => {
      expect(maskPhone('01712345678')).toBe('01******678');
      expect(maskPhone('+8801812345678')).toBe('+8801******678');
      expect(maskPhone('123')).toBe('01******000');
    });

    it('masks user full names correctly', () => {
      expect(maskName('Ayman Rahman')).toBe('A**** R*****');
      expect(maskName('Tanvir')).toBe('T*****');
      expect(maskName('')).toBe('Anonymous');
    });
  });

  describe('SLA Badges by Tier (doc 27 §4.2)', () => {
    it('provides canonical SLA badges: Mentor 4h, Live 12h, Plus 24h, Core 48h', () => {
      const badges = getPublicSlaBadges();
      expect(badges.map((b) => b.badgeLabel)).toEqual([
        'Mentor 4h',
        'Live 12h',
        'Plus 24h',
        'Core 48h',
      ]);
      expect(SUPPORT_TIER_SLAS.mentor.resolutionHours).toBe(4);
      expect(SUPPORT_TIER_SLAS.live.resolutionHours).toBe(12);
      expect(SUPPORT_TIER_SLAS.plus.resolutionHours).toBe(24);
      expect(SUPPORT_TIER_SLAS.core.resolutionHours).toBe(48);
    });
  });

  describe('Searchable FAQs (doc 27 §8)', () => {
    it('searches FAQs across billing, ai-scoring, technical, live-batches, refunds', () => {
      const billingFaqs = searchFaqs('', 'billing');
      expect(billingFaqs.length).toBeGreaterThan(0);
      expect(billingFaqs.some((f) => f.tags.includes('mushak'))).toBe(true);

      const aiFaqs = searchFaqs('disclaimer');
      expect(aiFaqs.length).toBeGreaterThan(0);
      expect(aiFaqs[0]?.category).toBe('ai-scoring');

      const refundFaqs = searchFaqs('20%');
      expect(refundFaqs.length).toBeGreaterThan(0);
      expect(refundFaqs[0]?.answer).toContain('less than 20%');

      const liveFaqs = searchFaqs('zoom', 'live-batches');
      expect(liveFaqs.length).toBeGreaterThan(0);
    });
  });

  describe('Support Macros (doc 27 §5)', () => {
    it('retrieves macros by code', () => {
      expect(SUPPORT_MACROS.length).toBeGreaterThan(0);
      const trxMacro = getMacroByCode('PAY-TRX-CHECK');
      expect(trxMacro).toBeDefined();
      expect(trxMacro?.category).toBe('Billing');

      const disputeMacro = getMacroByCode('AIS-DISPUTE-ACK');
      expect(disputeMacro).toBeDefined();

      const voidMacro = getMacroByCode('EXM-VOID-RESIT');
      expect(voidMacro).toBeDefined();

      const refundMacro = getMacroByCode('REF-SELF-SERVE');
      expect(refundMacro).toBeDefined();
    });
  });

  describe('Staff Console Authorization & Masked PII Display', () => {
    const validStaffActor: Actor = {
      id: 'staff-supp-01',
      roles: ['support'],
      hasTwoFactorEnabled: true,
    };

    const studentActor: Actor = {
      id: 'student-01',
      roles: ['student'],
      hasTwoFactorEnabled: false,
    };

    const staffWithout2FA: Actor = {
      id: 'staff-supp-unverified',
      roles: ['support'],
      hasTwoFactorEnabled: false,
    };

    it('rejects unauthenticated or non-staff actors from reading staff tickets', () => {
      expect(() => listStaffSupportTickets(studentActor)).toThrow(AuthorizationError);
    });

    it('rejects staff actors who have not satisfied mandatory D4 2FA', () => {
      expect(() => listStaffSupportTickets(staffWithout2FA)).toThrow(TwoFactorRequiredError);
    });

    it('returns tickets with masked PII for authorized 2FA staff', () => {
      const tickets = listStaffSupportTickets(validStaffActor);
      expect(tickets.length).toBeGreaterThan(0);

      // Verify that every returned ticket has masked email and phone
      for (const t of tickets) {
        expect(t.maskedEmail).not.toContain('tanvir.ahmed.bd@gmail.com');
        expect(t.maskedEmail).toContain('@');
        expect(t.maskedEmail).toContain('*');
        if (t.maskedPhone) {
          expect(t.maskedPhone).toContain('******');
          expect(t.maskedPhone).not.toBe('+8801711234567');
        }
      }
    });

    it('allows support staff to inspect individual ticket with masked PII', () => {
      const ticket = getStaffSupportTicket(validStaffActor, 'tkt-101');
      expect(ticket.id).toBe('tkt-101');
      expect(ticket.maskedEmail).toContain('*');
    });

    it('allows support staff to apply response macros', () => {
      const updated = applySupportMacro(
        validStaffActor,
        'tkt-101',
        'PAY-TRX-CHECK',
        { trxId: '9JK8L1M2' }
      );
      expect(updated.status).toBe('pending_customer');
      const lastMsg = updated.messages[updated.messages.length - 1];
      expect(lastMsg?.text).toContain('TrxID 9JK8L1M2');
      expect(lastMsg?.sender).toBe('agent');
    });
  });
});
