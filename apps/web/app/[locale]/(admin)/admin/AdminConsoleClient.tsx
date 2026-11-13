'use client';

/** @purpose Admin Console UI: Platform health KPIs, User & Role Inspector with super_admin guard (D4), and Append-only Audit Log Viewer (docs/06 §1, docs/09 §4) */

import React, { useState } from 'react';
import {
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@lumen/ui';
import {
  ShieldAlert,
  ShieldCheck,
  Users,
  Activity,
  DollarSign,
  Search,
  UserCheck,
  AlertTriangle,
  FileText,
  Clock,
  Server,
} from 'lucide-react';
import { type Role, ROLES, ROLES_REQUIRING_2FA } from '@lumen/auth';
import { changeUserRoleAction } from '../../../actions/admin';

interface AdminConsoleProps {
  currentActor: {
    id: string;
    name: string;
    role: Role;
    hasTwoFactor: boolean;
  };
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: Role;
  hasTwoFactor: boolean;
  createdAt: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  actorId: string;
  actorRole: string;
  action: string;
  ipHash: string;
  status: 'success' | 'denied' | 'flagged';
  details: string;
}

export function AdminConsoleClient({ currentActor }: AdminConsoleProps) {
  const [users, setUsers] = useState<UserRecord[]>([
    {
      id: 'usr_001',
      name: 'Ayman Rahman',
      email: 'aymanrahman30@gmail.com',
      role: 'super_admin',
      hasTwoFactor: true,
      createdAt: '2026-11-01',
    },
    {
      id: 'usr_002',
      name: 'Nusrat Jahan',
      email: 'nusrat@lumen.academy',
      role: 'instructor',
      hasTwoFactor: true,
      createdAt: '2026-11-05',
    },
    {
      id: 'usr_003',
      name: 'Tanvir Hossain',
      email: 'tanvir@example.com',
      role: 'student',
      hasTwoFactor: false,
      createdAt: '2026-11-08',
    },
    {
      id: 'usr_004',
      name: 'Kamrul Hasan',
      email: 'kamrul.finance@lumen.academy',
      role: 'finance',
      hasTwoFactor: true,
      createdAt: '2026-11-09',
    },
    {
      id: 'usr_005',
      name: 'Zubair Ahmed',
      email: 'zubair.grader@lumen.academy',
      role: 'grader',
      hasTwoFactor: false, // Flagged: grader requires 2FA!
      createdAt: '2026-11-10',
    },
  ]);

  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([
    {
      id: 'log_901',
      timestamp: '2026-11-13 14:32:10 UTC',
      actorId: 'usr_001',
      actorRole: 'super_admin',
      action: 'mushak:export_csv',
      ipHash: 'ip_h_89ab32',
      status: 'success',
      details: 'Generated monthly NBR Mushak 6.3 VAT ledger export',
    },
    {
      id: 'log_902',
      timestamp: '2026-11-13 13:15:02 UTC',
      actorId: 'usr_004',
      actorRole: 'finance',
      action: 'guarantee:approve_target_promise',
      ipHash: 'ip_h_ff29a1',
      status: 'success',
      details: 'Granted 90-day library extension to usr_student_1',
    },
    {
      id: 'log_903',
      timestamp: '2026-11-13 11:04:19 UTC',
      actorId: 'usr_unauth_9',
      actorRole: 'student',
      action: 'user:role_update',
      ipHash: 'ip_h_12de77',
      status: 'denied',
      details: 'Unauthorized privilege escalation attempt to admin role',
    },
  ]);

  const [roleChangeNotice, setRoleChangeNotice] = useState<string | null>(null);

  const handleRoleChange = async (userId: string, newRole: Role) => {
    const result = await changeUserRoleAction({ userId, targetRole: newRole });

    if (!result.ok) {
      const msg =
        result.error ??
        `Security Violation: Only super_admin can grant administrative roles (${newRole}). Attempt blocked.`;
      setRoleChangeNotice(msg);

      setAuditLogs((prev) => [
        {
          id: result.auditEntry.id,
          timestamp: result.auditEntry.createdAt,
          actorId: currentActor.id,
          actorRole: currentActor.role,
          action: result.auditEntry.action,
          ipHash: 'server-verified',
          status: 'denied',
          details: `Blocked attempt by ${currentActor.role} to grant ${newRole} to ${userId}`,
        },
        ...prev,
      ]);
      return;
    }

    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );

    const successMsg = `Successfully updated role of user ${userId} to ${newRole}.`;
    setRoleChangeNotice(successMsg);

    setAuditLogs((prev) => [
      {
        id: result.auditEntry.id,
        timestamp: result.auditEntry.createdAt,
        actorId: currentActor.id,
        actorRole: currentActor.role,
        action: result.auditEntry.action,
        ipHash: 'server-verified',
        status: 'success',
        details: `Updated role of user ${userId} to ${newRole}`,
      },
      ...prev,
    ]);

    setTimeout(() => setRoleChangeNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-2xs md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Admin & Operations Console
            </h1>
            <Badge className="bg-purple-100 text-purple-800 border-purple-300">
              Role: {currentActor.role.toUpperCase()}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Platform health monitoring, RBAC security inspector (D4), and append-only audit log viewer.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
            <Server className="mr-1 h-3.5 w-3.5" /> All Services Nominal
          </Badge>
        </div>
      </div>

      {roleChangeNotice && (
        <div
          className={`rounded-lg border p-4 text-xs font-medium flex items-center gap-2 ${
            roleChangeNotice.includes('Violation')
              ? 'bg-red-50 text-red-800 border-red-200'
              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
          }`}
        >
          {roleChangeNotice.includes('Violation') ? (
            <AlertTriangle className="h-4 w-4 text-red-600" />
          ) : (
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
          )}
          <span>{roleChangeNotice}</span>
        </div>
      )}

      {/* Platform Health KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Active Learners Today
            </span>
            <Users className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">1,428</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">98.2% session retention</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              CBT Attempts Completed
            </span>
            <Activity className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">342</div>
          <div className="mt-1 text-xs text-gray-500">GRE Section Adaptive + IELTS</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              AI Daily Spend / Budget
            </span>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">$0.84 / $2.00</div>
          <div className="mt-1 text-xs text-emerald-600 font-medium">Within target ceiling (42%)</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Uptime SLA
            </span>
            <Clock className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">99.98%</div>
          <div className="mt-1 text-xs text-gray-500">Last incident: None in 30 days</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="users" className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="users" className="text-xs font-medium">
            <UserCheck className="mr-1.5 h-3.5 w-3.5" /> User & Role Management
          </TabsTrigger>
          <TabsTrigger value="audit" className="text-xs font-medium">
            <FileText className="mr-1.5 h-3.5 w-3.5" /> Append-Only Audit Log
          </TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="mt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  User Accounts & 2FA Enforcement
                </h2>
                <p className="text-xs text-gray-500">
                  Staff roles (instructor, grader, editor, support, finance, admin) strictly require 2FA per D4.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search user or email..."
                  className="rounded border border-gray-300 px-2.5 py-1 text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">User</th>
                    <th className="py-2.5 px-3">Email</th>
                    <th className="py-2.5 px-3">Current Role</th>
                    <th className="py-2.5 px-3">2FA Status</th>
                    <th className="py-2.5 px-3">Registered</th>
                    <th className="py-2.5 px-3 text-right">Assign Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((u) => {
                    const needs2fa = ROLES_REQUIRING_2FA.has(u.role);
                    const is2faCompliant = !needs2fa || u.hasTwoFactor;

                    return (
                      <tr key={u.id} className="hover:bg-gray-50/80">
                        <td className="py-3 px-3 font-semibold text-gray-900">{u.name}</td>
                        <td className="py-3 px-3 text-gray-600 font-mono">{u.email}</td>
                        <td className="py-3 px-3">
                          <Badge variant="outline" className="font-mono text-[11px]">
                            {u.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-3">
                          {is2faCompliant ? (
                            <Badge className="bg-emerald-100 text-emerald-800">
                              <ShieldCheck className="mr-1 h-3 w-3" /> Enabled
                            </Badge>
                          ) : (
                            <Badge className="bg-red-100 text-red-800">
                              <ShieldAlert className="mr-1 h-3 w-3" /> 2FA Mandatory
                            </Badge>
                          )}
                        </td>
                        <td className="py-3 px-3 text-gray-500">{u.createdAt}</td>
                        <td className="py-3 px-3 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.id, e.target.value as Role)}
                            className="rounded border border-gray-300 bg-white px-2 py-1 text-xs text-gray-800 outline-none"
                          >
                            {ROLES.map((r) => (
                              <option key={r} value={r}>
                                {r}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Audit Log Tab */}
        <TabsContent value="audit" className="mt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Append-Only Security Audit Log
              </h2>
              <p className="text-xs text-gray-500">
                Immutable record of administrative actions, role assignments, financial exports, and security blocks.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 uppercase font-sans">
                  <tr>
                    <th className="py-2.5 px-3">Log ID</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Actor (ID • Role)</th>
                    <th className="py-2.5 px-3">Action</th>
                    <th className="py-2.5 px-3">IP Salt Hash</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Event Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50/80">
                      <td className="py-3 px-3 font-semibold text-gray-900">{log.id}</td>
                      <td className="py-3 px-3 text-gray-600">{log.timestamp}</td>
                      <td className="py-3 px-3 text-gray-800">
                        {log.actorId} ({log.actorRole})
                      </td>
                      <td className="py-3 px-3 font-semibold text-blue-700">{log.action}</td>
                      <td className="py-3 px-3 text-gray-500">{log.ipHash}</td>
                      <td className="py-3 px-3 font-sans">
                        <Badge
                          className={
                            log.status === 'success'
                              ? 'bg-emerald-100 text-emerald-800'
                              : log.status === 'denied'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-gray-700 font-sans">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
