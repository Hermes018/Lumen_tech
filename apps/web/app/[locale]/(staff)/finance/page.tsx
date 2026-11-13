/** @purpose Finance Portal (/finance) with Revenue ledger, Mushak 6.3 VAT export, refund queue, and guarantee promises (docs/10 §6, docs/17 §2.2a) */

import React from 'react';
import { requireServerActor, assertCan } from '@lumen/core';
import { FinanceConsoleClient } from './FinanceConsoleClient';

export default async function FinancePage() {
  const srv = await requireServerActor({ requireTwoFactor: true, roles: ['finance'] });
  assertCan(srv, 'finance:read');
  const actor = {
    name: srv.name ?? 'Finance',
    role: srv.roles[0] ?? 'finance',
    hasTwoFactor: srv.twoFactorVerified === true,
  };

  return <FinanceConsoleClient actor={actor} />;
}
