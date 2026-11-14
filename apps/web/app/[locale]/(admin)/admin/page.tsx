/** @purpose Admin platform overview, user role management with super_admin guard, and audit logging */

import React from 'react';
import { requireServerActor, assertCan } from '@lumen/core';
import { AdminConsoleClient } from './AdminConsoleClient';

export default async function AdminOverviewPage() {
  const srv = await requireServerActor({ requireTwoFactor: true, roles: ['admin'] });
  assertCan(srv, 'user:manage');
  assertCan(srv, 'audit:view');

  const currentActor = {
    id: srv.id,
    name: srv.name ?? 'Admin',
    role: srv.roles.includes('super_admin') ? ('super_admin' as const) : ('admin' as const),
    hasTwoFactor: srv.twoFactorVerified === true,
  };

  return <AdminConsoleClient currentActor={currentActor} />;
}
