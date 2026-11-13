/** @purpose Staff Support Desk & Trust Operations Console with Masked PII (docs/27 §16, D4) */
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Button,
  Input,
  Callout,
} from '@lumen/ui';
import {
  ShieldCheck,
  Search,
  Clock,
  Send,
  MessageSquare,
  RotateCw,
  Lock,
  Zap,
} from 'lucide-react';
import {
  listStaffSupportTicketsAction,
  applySupportMacroAction,
  listAvailableMacrosAction,
} from '@/app/actions/support';
import type {
  MaskedSupportTicket,
  SupportMacro,
  SupportTicketStatus,
  SupportPriority,
} from '@lumen/core';

export default function StaffSupportConsolePage() {
  const [tickets, setTickets] = useState<MaskedSupportTicket[]>([]);
  const [macros, setMacros] = useState<SupportMacro[]>([]);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedMacroCode, setSelectedMacroCode] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const fetchTickets = () => {
    startTransition(async () => {
      try {
        setError(null);
        const filter: {
          search?: string;
          status?: SupportTicketStatus;
        } = {};
        if (searchQuery.trim()) filter.search = searchQuery.trim();
        if (statusFilter !== 'all') {
          filter.status = statusFilter as SupportTicketStatus;
        }

        const [tList, mList] = await Promise.all([
          listStaffSupportTicketsAction(filter),
          listAvailableMacrosAction(),
        ]);
        setTickets(tList);
        setMacros(mList);
        if (!selectedTicketId && tList.length > 0) {
          setSelectedTicketId(tList[0]?.id ?? null);
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Access denied: Requires staff support role and verified 2FA.'
        );
      }
    });
  };

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  const activeTicket = tickets.find((t) => t.id === selectedTicketId) ?? null;

  const handleApplyMacro = () => {
    if (!activeTicket || !selectedMacroCode) return;

    startTransition(async () => {
      try {
        setError(null);
        const updated = await applySupportMacroAction({
          ticketId: activeTicket.id,
          macroCode: selectedMacroCode,
        });

        setTickets((prev) =>
          prev.map((t) => (t.id === updated.id ? updated : t))
        );
        setSuccessMsg(`Macro ${selectedMacroCode} applied successfully.`);
        setTimeout(() => setSuccessMsg(null), 4000);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to apply macro');
      }
    });
  };

  const getPriorityBadgeVariant = (
    priority: SupportPriority
  ): 'danger' | 'default' | 'outline' => {
    switch (priority) {
      case 'p0':
        return 'danger';
      case 'p1':
        return 'default';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Security Status */}
      <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-xs sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-slate-900">
              Staff Support Desk & Trust Operations
            </h2>
            <Badge variant="outline" className="border-emerald-300 bg-emerald-50 text-emerald-800">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> D4 2FA Verified
            </Badge>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Strict PII masking enabled per privacy policy. All data reveals and macro responses are audit-logged.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchTickets}
            disabled={isPending}
            className="text-xs"
          >
            <RotateCw className={`mr-1.5 h-3.5 w-3.5 ${isPending ? 'animate-spin' : ''}`} />
            Refresh Queue
          </Button>
        </div>
      </div>

      {error && (
        <Callout type="trap" title="Security Alert" className="border-red-200 bg-red-50 text-red-900">
          <span className="font-semibold">{error}</span>
        </Callout>
      )}

      {successMsg && (
        <Callout type="solution" title="Success" className="border-emerald-200 bg-emerald-50 text-emerald-900">
          <span>{successMsg}</span>
        </Callout>
      )}

      {/* Main Console Split View */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Left Column: Ticket List */}
        <div className="space-y-4 lg:col-span-5">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="p-4 pb-3">
              <CardTitle className="text-sm font-bold text-slate-900">
                Incoming Inquiries ({tickets.length})
              </CardTitle>
              <div className="mt-2 space-y-2">
                <div className="relative">
                  <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search by ID, email, category..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchTickets()}
                    className="h-9 pl-9 text-xs"
                  />
                </div>
                <div className="flex gap-1.5 overflow-x-auto text-xs">
                  {['all', 'open', 'pending_staff', 'pending_customer', 'resolved'].map(
                    (st) => (
                      <button
                        key={st}
                        type="button"
                        onClick={() => setStatusFilter(st)}
                        className={`rounded-md px-2.5 py-1 text-2xs font-semibold capitalize transition-colors ${
                          statusFilter === st
                            ? 'bg-slate-900 text-white'
                            : 'border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        {st.replace('_', ' ')}
                      </button>
                    )
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="divide-y divide-slate-100 p-0">
              {tickets.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500">
                  No support tickets match the current criteria.
                </div>
              ) : (
                tickets.map((t) => {
                  const isSelected = selectedTicketId === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedTicketId(t.id)}
                      className={`block w-full p-4 text-left transition-colors ${
                        isSelected
                          ? 'bg-blue-50/70 border-l-4 border-l-blue-600'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-xs font-bold text-slate-900">
                            {t.id}
                          </span>
                          <span className="rounded bg-slate-100 px-1.5 py-0.2 text-2xs font-semibold uppercase text-slate-600">
                            {t.categoryCode}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Badge variant={getPriorityBadgeVariant(t.priority)} className="text-2xs uppercase">
                            {t.priority}
                          </Badge>
                          <Badge variant="outline" className="text-2xs uppercase">
                            {t.tier}
                          </Badge>
                        </div>
                      </div>

                      <h4 className="mt-1 line-clamp-1 text-xs font-semibold text-slate-800">
                        {t.subject}
                      </h4>

                      <div className="mt-2 flex items-center justify-between text-2xs text-slate-500">
                        <span className="flex items-center gap-1 font-mono">
                          <Lock className="h-3 w-3 text-slate-400" />
                          {t.maskedEmail}
                        </span>
                        <span className="flex items-center gap-0.5 text-slate-400">
                          <Clock className="h-3 w-3" />
                          &le; {t.slaDueHours}h SLA
                        </span>
                      </div>
                    </button>
                  );
                })
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Ticket Detail & Macro Operations */}
        <div className="space-y-4 lg:col-span-7">
          {activeTicket ? (
            <Card className="border-slate-200 bg-white">
              <CardHeader className="border-b p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-slate-900">
                        {activeTicket.id}
                      </span>
                      <Badge variant="outline" className="text-xs uppercase">
                        {activeTicket.categoryCode}
                      </Badge>
                      <span className="text-xs font-medium capitalize text-slate-500">
                        Status: <strong className="text-slate-800">{activeTicket.status.replace('_', ' ')}</strong>
                      </span>
                    </div>
                    <h3 className="mt-1 text-base font-bold text-slate-900">
                      {activeTicket.subject}
                    </h3>
                  </div>

                  <div className="text-right">
                    <span className="inline-flex items-center gap-1 rounded-md bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 border border-amber-200">
                      <Clock className="h-3.5 w-3.5" />
                      SLA Target: {activeTicket.slaDueHours}h
                    </span>
                  </div>
                </div>

                {/* Masked PII Panel */}
                <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50/80 p-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    <div>
                      <span className="text-slate-400">Learner User ID:</span>
                      <p className="font-mono font-medium text-slate-700">{activeTicket.userId}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Masked Email:</span>
                      <p className="font-mono font-medium text-slate-700">{activeTicket.maskedEmail}</p>
                    </div>
                    <div>
                      <span className="text-slate-400">Masked Phone:</span>
                      <p className="font-mono font-medium text-slate-700">
                        {activeTicket.maskedPhone ?? 'Not on file'}
                      </p>
                    </div>
                  </div>
                </div>
              </CardHeader>

              {/* Message Thread */}
              <CardContent className="space-y-4 p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Conversation Thread
                </h4>
                <div className="space-y-3">
                  {activeTicket.messages.map((msg) => {
                    const isAgent = msg.sender === 'agent';
                    return (
                      <div
                        key={msg.id}
                        className={`rounded-lg p-3.5 text-xs leading-relaxed ${
                          isAgent
                            ? 'border border-blue-200 bg-blue-50/50 text-slate-800'
                            : 'border border-slate-200 bg-white text-slate-700'
                        }`}
                      >
                        <div className="mb-1 flex items-center justify-between text-2xs">
                          <span className="font-bold text-slate-900">{msg.senderName}</span>
                          <span className="text-slate-400">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p>{msg.text}</p>
                      </div>
                    );
                  })}
                </div>

                {/* Macro Response Dispatcher */}
                <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50/60 p-4">
                  <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700">
                    <Zap className="h-3.5 w-3.5 text-amber-500" />
                    Standard Support Macros (docs/27 §5)
                  </h4>
                  <p className="mt-0.5 text-2xs text-slate-500">
                    Applying an authorized macro inserts template copy, sets status to pending_customer, and timestamps the response.
                  </p>

                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <select
                      value={selectedMacroCode}
                      onChange={(e) => setSelectedMacroCode(e.target.value)}
                      className="h-9 grow rounded-md border border-slate-300 bg-white px-3 text-xs shadow-2xs focus:border-blue-600 focus:outline-none"
                    >
                      <option value="">Select a macro to apply...</option>
                      {macros.map((m) => (
                        <option key={m.code} value={m.code}>
                          [{m.category}] {m.title} ({m.code})
                        </option>
                      ))}
                    </select>

                    <Button
                      size="sm"
                      onClick={handleApplyMacro}
                      disabled={isPending || !selectedMacroCode}
                      className="text-xs"
                    >
                      <Send className="mr-1.5 h-3.5 w-3.5" />
                      Send Macro Reply
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="p-12 text-center text-slate-400">
              <MessageSquare className="mx-auto mb-2 h-8 w-8 text-slate-300" />
              <p className="text-xs">Select a ticket from the left panel to inspect details and apply macros.</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
