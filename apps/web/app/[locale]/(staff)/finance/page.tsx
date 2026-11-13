/** @purpose Finance Portal (/finance) with Revenue ledger, Mushak 6.3 VAT export, refund queue, and guarantee promises (docs/10 §6, docs/17 §2.2a) */

import React from 'react';
import { FinanceConsoleClient } from './FinanceConsoleClient';

export default async function FinancePage() {
  const actor = {
    name: 'Ayman Rahman',
    role: 'finance',
    hasTwoFactor: true,
  };

  return <FinanceConsoleClient actor={actor} />;
}
