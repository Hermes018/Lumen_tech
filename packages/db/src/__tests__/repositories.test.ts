import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  createRepositories,
  createMemoryRepositories,
  getRepositories,
  setRepositories,
  resetRepositories,
  type OrderRecord,
  type CreditLedgerEntry,
} from '../repositories';

describe('Repository Dual-Mode Adapter Layer (P1-33)', () => {
  const originalEnv = { ...process.env };

  beforeEach(() => {
    resetRepositories();
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = { ...originalEnv };
    resetRepositories();
  });

  describe('Production Guard & Fail-Fast Behavior', () => {
    it('throws fatal error in production when DATABASE_URL is missing', () => {
      process.env.NODE_ENV = 'production';
      delete process.env.DATABASE_URL;

      expect(() => createRepositories()).toThrowError(
        /FATAL: DATABASE_URL is missing in production environment/
      );
    });

    it('creates memory repositories when forced or in test environment', () => {
      process.env.NODE_ENV = 'test';
      delete process.env.DATABASE_URL;

      const repos = createRepositories();
      expect(repos).toBeDefined();
      expect(repos.orders).toBeDefined();
      expect(repos.payments).toBeDefined();
      expect(repos.entitlements).toBeDefined();
      expect(repos.ledger).toBeDefined();
      expect(repos.unitOfWork).toBeDefined();
    });

    it('manages singleton lifecycle with getRepositories and setRepositories', () => {
      const initial = getRepositories();
      expect(initial).toBeDefined();

      const custom = createMemoryRepositories();
      setRepositories(custom);
      expect(getRepositories()).toBe(custom);

      resetRepositories();
      expect(getRepositories()).not.toBe(custom);
    });
  });

  describe('In-Memory Repository CRUD & Invariants', () => {
    it('persists and retrieves orders with unique providerRef constraint', async () => {
      const repos = createMemoryRepositories();

      const order1: OrderRecord = {
        id: 'ord-1',
        userId: 'user-1',
        providerRef: 'TRAN_REF_001',
        productSlug: 'gre-self-paced',
        productName: 'GRE Self Paced',
        amountMinor: 399000,
        currency: 'BDT',
        status: 'pending',
        customer: { name: 'Ayman', email: 'ayman@example.com', phone: '01711111111' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      await repos.orders.save(order1);

      const retrieved = await repos.orders.findById('ord-1');
      expect(retrieved?.id).toBe('ord-1');
      expect(retrieved?.providerRef).toBe('TRAN_REF_001');

      const byRef = await repos.orders.findByProviderRef('TRAN_REF_001');
      expect(byRef?.id).toBe('ord-1');

      // Attempt to save another order with duplicate providerRef must throw
      const duplicateOrder: OrderRecord = {
        ...order1,
        id: 'ord-2',
      };

      await expect(repos.orders.save(duplicateOrder)).rejects.toThrowError(
        /Unique constraint violation: providerRef 'TRAN_REF_001'/
      );
    });

    it('enforces append-only ledger uniqueness and balance calculation', async () => {
      const repos = createMemoryRepositories();

      const entry1: CreditLedgerEntry = {
        id: 'led-1',
        userId: 'user-1',
        kind: 'ai_credit',
        delta: 20,
        balanceAfter: 20,
        reason: 'purchase_grant',
        idempotencyKey: 'key-purchase-01',
        createdAt: new Date().toISOString(),
      };

      await repos.ledger.save(entry1);

      const bal1 = await repos.ledger.getBalance('user-1', 'ai_credit');
      expect(bal1).toBe(20);

      // Duplicate idempotencyKey must throw
      const duplicateEntry: CreditLedgerEntry = {
        ...entry1,
        id: 'led-2',
      };
      await expect(repos.ledger.save(duplicateEntry)).rejects.toThrowError(
        /Unique constraint violation: idempotencyKey 'key-purchase-01'/
      );

      // Consume credit
      const entry2: CreditLedgerEntry = {
        id: 'led-3',
        userId: 'user-1',
        kind: 'ai_credit',
        delta: -1,
        balanceAfter: 19,
        reason: 'writing_evaluation',
        idempotencyKey: 'key-eval-01',
        createdAt: new Date().toISOString(),
      };
      await repos.ledger.save(entry2);

      const bal2 = await repos.ledger.getBalance('user-1', 'ai_credit');
      expect(bal2).toBe(19);
    });

    it('rolls back transactional mutations when an error is thrown in transaction', async () => {
      const repos = createMemoryRepositories();

      const initialOrder: OrderRecord = {
        id: 'ord-initial',
        userId: 'user-1',
        providerRef: 'INITIAL_REF',
        productSlug: 'gre-live',
        productName: 'GRE Live',
        amountMinor: 899000,
        currency: 'BDT',
        status: 'pending',
        customer: { name: 'Test', email: 'test@example.com', phone: '01800000000' },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await repos.orders.save(initialOrder);

      // Execute transaction that fails midway
      await expect(
        repos.unitOfWork.transaction(async (tx) => {
          await tx.orders.update('ord-initial', { status: 'paid' });

          const newOrder: OrderRecord = {
            id: 'ord-tx-rollback',
            userId: 'user-1',
            providerRef: 'TX_ROLLBACK_REF',
            productSlug: 'gre-live',
            productName: 'GRE Live',
            amountMinor: 899000,
            currency: 'BDT',
            status: 'paid',
            customer: { name: 'Rollback', email: 'rb@example.com', phone: '01800000000' },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          await tx.orders.save(newOrder);

          // Force failure
          throw new Error('Simulated crash during payment fulfillment');
        })
      ).rejects.toThrowError('Simulated crash during payment fulfillment');

      // Invariant: initialOrder status must still be 'pending' (not 'paid')
      const orderAfterRollback = await repos.orders.findById('ord-initial');
      expect(orderAfterRollback?.status).toBe('pending');

      // Invariant: newOrder must not exist
      const rolledBackOrder = await repos.orders.findById('ord-tx-rollback');
      expect(rolledBackOrder).toBeNull();
    });

    it('commits transactional mutations when transaction finishes successfully', async () => {
      const repos = createMemoryRepositories();

      await repos.unitOfWork.transaction(async (tx) => {
        await tx.ledger.save({
          id: 'tx-led-1',
          userId: 'user-tx',
          kind: 'mock_attempt',
          delta: 5,
          balanceAfter: 5,
          reason: 'promo',
          idempotencyKey: 'tx-promo-1',
          createdAt: new Date().toISOString(),
        });
      });

      const balance = await repos.ledger.getBalance('user-tx', 'mock_attempt');
      expect(balance).toBe(5);
    });
  });
});
