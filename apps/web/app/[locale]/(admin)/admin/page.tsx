/** @purpose Admin platform overview, user role management with super_admin guard (D4), and audit logging */

import React from 'react';
import { AdminConsoleClient } from './AdminConsoleClient';
import type { Role } from '@lumen/auth';

export default async function AdminOverviewPage() {
  const currentActor: {
    id: string;
    name: string;
    role: Role;
    hasTwoFactor: boolean;
  } = {
    id: 'usr_super_admin_01',
    name: 'Ayman Rahman',
    role: 'super_admin',
    hasTwoFactor: true,
  };

  return <AdminConsoleClient currentActor={currentActor} />;
}
