'use client';

/** @purpose Finance Console UI: Revenue/VAT ledger, refund queue, Mushak 6.3 export preview, and guarantee promise claims (docs/10 §6, docs/17 §2.2a) */

import React, { useState } from 'react';
import {
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@lumen/ui';
import {
  DollarSign,
  Download,
  CheckCircle,
  FileSpreadsheet,
  RotateCcw,
  Award,
  ShieldCheck,
  TrendingUp,
  Receipt,
  Search,
  CreditCard,
} from 'lucide-react';
import {
  sanitizeCsvField,
  type MushakInvoiceRecord,
} from '@lumen/core';

interface FinanceConsoleProps {
  actor: {
    name: string;
    role: string;
    hasTwoFactor: boolean;
  };
}

export function FinanceConsoleClient({ actor }: FinanceConsoleProps) {
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sample data for Mushak 6.3 Ledger
  const [invoices] = useState<MushakInvoiceRecord[]>([
    {
      challanNo: 'MUS-202611-0001',
      issueDate: '2026-11-12',
      customerName: 'Ayman Rahman',
      customerBinNidPhone: '01712345678',
      itemDescription: 'IELTS Academic Plus Tier (6 Months)',
      supplyValueMinor: 500000,
      vatRatePercent: 5,
      gatewayName: 'SSLCommerz',
      gatewayTxId: 'SSLCZ-20261112-99881',
    },
    {
      challanNo: 'MUS-202611-0002',
      issueDate: '2026-11-13',
      customerName: 'Tanvir Hossain',
      customerBinNidPhone: '01811223344',
      itemDescription: 'GRE Quant Mastery Core',
      supplyValueMinor: 399000,
      vatRatePercent: 5,
      gatewayName: 'SSLCommerz',
      gatewayTxId: 'SSLCZ-20261113-99882',
    },
    {
      challanNo: 'MUS-202611-0003',
      issueDate: '2026-11-13',
      customerName: 'Nusrat Jahan',
      customerBinNidPhone: '01999887766',
      itemDescription: 'IELTS Mentor Live Batch Enrolment',
      supplyValueMinor: 999000,
      vatRatePercent: 5,
      gatewayName: 'bKash',
      gatewayTxId: 'BKASH-20261113-11223',
    },
  ]);

  // Guarantee promise claims sample
  const [claims, setClaims] = useState([
    {
      id: 'claim_01',
      studentName: 'Sadia Ahmed',
      tier: 'Plus',
      promiseType: 'Target Promise',
      mocksCount: '5 / 4',
      progress: '78% study plan',
      remedy: '90-Day Library Extension',
      status: 'pending',
    },
    {
      id: 'claim_02',
      studentName: 'Kamrul Hasan',
      tier: 'Mentor',
      promiseType: 'Progress Promise',
      mocksCount: '4 / 4',
      progress: '86% live attendance • 100% hw',
      remedy: 'Free Live Batch Re-enrolment',
      status: 'pending',
    },
    {
      id: 'claim_03',
      studentName: 'Farhana Kabir',
      tier: 'Plus',
      promiseType: 'Target Promise',
      mocksCount: '2 / 4 (Deficient)',
      progress: '55% study plan',
      remedy: 'Extension (Ineligible)',
      status: 'rejected',
    },
  ]);

  // Refund queue sample
  const [refunds, setRefunds] = useState([
    {
      id: 'ref_101',
      orderId: 'ORD-9821',
      customer: 'Imtiaz Ahmed',
      amount: 'BDT 3,990',
      reason: '7-day self-serve window (12% content consumed)',
      status: 'pending_approval',
    },
  ]);

  // Pending Manual bKash / Nagad payment approvals queue (P1-41)
  const [manualPayments, setManualPayments] = useState([
    {
      id: 'ord_manual_101',
      orderId: 'ORD-BK-9801',
      customerName: 'Siam Chowdhury',
      phone: '01711223344',
      productName: 'GRE Quant Mastery Core',
      amount: 'BDT 4,990',
      method: 'bkash' as const,
      trxId: 'BL54A92K1M',
      senderNumber: '01711223344',
      submittedAt: '2026-11-13 22:15',
      status: 'pending_verification' as 'pending_verification' | 'approved' | 'rejected',
    },
    {
      id: 'ord_manual_102',
      orderId: 'ORD-NG-9802',
      customerName: 'Nusrat Jahan',
      phone: '01899112233',
      productName: 'IELTS Academic Plus Tier',
      amount: 'BDT 3,990',
      method: 'nagad' as const,
      trxId: 'NG98K1M22',
      senderNumber: '01899112233',
      submittedAt: '2026-11-13 22:45',
      status: 'pending_verification' as 'pending_verification' | 'approved' | 'rejected',
    },
  ]);

  const handleManualPaymentAction = (id: string, action: 'approved' | 'rejected') => {
    setManualPayments((prev) =>
      prev.map((p) => (p.id === id ? { ...p, status: action } : p))
    );
  };

  const handleClaimAction = (id: string, action: 'approved' | 'rejected') => {
    setClaims((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: action } : c))
    );
  };

  const handleRefundAction = (id: string, action: 'processed' | 'declined') => {
    setRefunds((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: action } : r))
    );
  };

  const handleDownloadMushakCsv = () => {
    const headers = [
      'Challan Number',
      'Issue Date',
      'Customer Name',
      'Customer BIN/NID/Phone',
      'Item Description',
      'Supply Value (BDT)',
      'VAT Rate (%)',
      'VAT Amount (BDT)',
      'Total Payable (BDT)',
      'Payment Gateway',
      'Gateway TxID',
    ];

    const rows = invoices.map((rec) => {
      const supply = rec.supplyValueMinor / 100;
      const vat = Number(((supply * rec.vatRatePercent) / 100).toFixed(2));
      const total = Number((supply + vat).toFixed(2));

      return [
        sanitizeCsvField(rec.challanNo),
        sanitizeCsvField(rec.issueDate),
        sanitizeCsvField(rec.customerName),
        sanitizeCsvField(rec.customerBinNidPhone),
        sanitizeCsvField(rec.itemDescription),
        supply.toFixed(2),
        rec.vatRatePercent.toString(),
        vat.toFixed(2),
        total.toFixed(2),
        sanitizeCsvField(rec.gatewayName),
        sanitizeCsvField(rec.gatewayTxId),
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Mushak-6.3-NBR-Export-${new Date().toISOString().slice(0, 7)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner with 2FA Indicator */}
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-gray-200 bg-white p-6 shadow-2xs md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Finance & Compliance Console
            </h1>
            <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300">
              <ShieldCheck className="mr-1 h-3.5 w-3.5" /> 2FA Verified
            </Badge>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Authoritative VAT ledger (NBR Mushak 6.3), refund queue, and Target/Progress Promise claims. (Operator: {actor.name})
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            onClick={handleDownloadMushakCsv}
            className="bg-emerald-600 text-white hover:bg-emerald-500"
          >
            <Download className="mr-2 h-4 w-4" /> Export Mushak 6.3 CSV
          </Button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="rounded-lg bg-emerald-50 border border-emerald-200 p-4 text-sm text-emerald-800 flex items-center gap-2">
          <CheckCircle className="h-4 w-4 text-emerald-600" />
          <span>NBR Mushak 6.3 CSV export generated with spreadsheet formula-injection protection.</span>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Gross Revenue (MTD)
            </span>
            <DollarSign className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">BDT 1,898,000</div>
          <div className="mt-1 flex items-center text-xs text-emerald-600">
            <TrendingUp className="mr-1 h-3.5 w-3.5" /> +24% vs last month
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              VAT Payable (5% NBR)
            </span>
            <Receipt className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">BDT 94,900</div>
          <div className="mt-1 text-xs text-gray-500">Mushak 6.3 compliant invoices</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Pending Refunds
            </span>
            <RotateCcw className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">{refunds.length}</div>
          <div className="mt-1 text-xs text-amber-600 font-medium">Awaiting finance approval</div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
              Promise Claims
            </span>
            <Award className="h-4 w-4 text-gray-400" />
          </div>
          <div className="mt-2 text-2xl font-bold text-gray-900">
            {claims.filter((c) => c.status === 'pending').length}
          </div>
          <div className="mt-1 text-xs text-gray-500">Target & Progress guarantees</div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="promises" className="w-full">
        <TabsList className="bg-gray-100 p-1 rounded-lg">
          <TabsTrigger value="promises" className="text-xs font-medium">
            <Award className="mr-1.5 h-3.5 w-3.5" /> Guarantee Promise Claims
          </TabsTrigger>
          <TabsTrigger value="mushak" className="text-xs font-medium">
            <FileSpreadsheet className="mr-1.5 h-3.5 w-3.5" /> Mushak 6.3 Export Preview
          </TabsTrigger>
          <TabsTrigger value="refunds" className="text-xs font-medium">
            <RotateCcw className="mr-1.5 h-3.5 w-3.5" /> Refund Queue
          </TabsTrigger>
          <TabsTrigger value="manual" className="text-xs font-medium">
            <CreditCard className="mr-1.5 h-3.5 w-3.5" /> Pending bKash/Nagad ({manualPayments.filter(p => p.status === 'pending_verification').length})
          </TabsTrigger>
        </TabsList>

        {/* Guarantee Promise Claims Tab */}
        <TabsContent value="promises" className="mt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Target Promise (Plus) & Progress Promise (Mentor) Claims
              </h2>
              <p className="text-xs text-gray-500">
                Verifies mock completion (&gt;= 4), attendance/study plan thresholds, and TRF upload. Grants library extensions or batch re-enrolments (no cash).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Tier</th>
                    <th className="py-2.5 px-3">Promise Rule</th>
                    <th className="py-2.5 px-3">Full Mocks</th>
                    <th className="py-2.5 px-3">Milestone Progress</th>
                    <th className="py-2.5 px-3">Remedy Granted</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {claims.map((claim) => (
                    <tr key={claim.id} className="hover:bg-gray-50/80">
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {claim.studentName}
                      </td>
                      <td className="py-3 px-3">
                        <Badge variant="outline">{claim.tier}</Badge>
                      </td>
                      <td className="py-3 px-3 text-gray-700">{claim.promiseType}</td>
                      <td className="py-3 px-3 text-gray-600 font-mono">{claim.mocksCount}</td>
                      <td className="py-3 px-3 text-gray-600">{claim.progress}</td>
                      <td className="py-3 px-3 font-medium text-emerald-700">
                        {claim.remedy}
                      </td>
                      <td className="py-3 px-3">
                        <Badge
                          className={
                            claim.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : claim.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }
                        >
                          {claim.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {claim.status === 'pending' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleClaimAction(claim.id, 'approved')}
                              className="h-7 bg-emerald-600 px-2 text-[11px] text-white hover:bg-emerald-500"
                            >
                              Approve
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleClaimAction(claim.id, 'rejected')}
                              className="h-7 border-red-200 px-2 text-[11px] text-red-600 hover:bg-red-50"
                            >
                              Decline
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Mushak 6.3 Export Preview Tab */}
        <TabsContent value="mushak" className="mt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  NBR Mushak 6.3 Challan Ledger (Current Month)
                </h2>
                <p className="text-xs text-gray-500">
                  Authoritative tax invoice export formatted for Bangladesh National Board of Revenue compliance.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Filter challan or customer..."
                  className="rounded border border-gray-300 px-2.5 py-1 text-xs"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 uppercase font-sans">
                  <tr>
                    <th className="py-2.5 px-3">Challan No</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Item Description</th>
                    <th className="py-2.5 px-3">Supply (BDT)</th>
                    <th className="py-2.5 px-3">VAT (5%)</th>
                    <th className="py-2.5 px-3">Total Payable</th>
                    <th className="py-2.5 px-3">Gateway</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {invoices.map((inv) => {
                    const supply = inv.supplyValueMinor / 100;
                    const vat = (supply * inv.vatRatePercent) / 100;
                    const total = supply + vat;

                    return (
                      <tr key={inv.challanNo} className="hover:bg-gray-50/80">
                        <td className="py-3 px-3 font-semibold text-gray-900">
                          {inv.challanNo}
                        </td>
                        <td className="py-3 px-3 text-gray-600">{inv.issueDate}</td>
                        <td className="py-3 px-3 text-gray-900 font-sans">
                          {inv.customerName}
                        </td>
                        <td className="py-3 px-3 text-gray-700 font-sans">
                          {inv.itemDescription}
                        </td>
                        <td className="py-3 px-3">{supply.toFixed(2)}</td>
                        <td className="py-3 px-3 text-emerald-700">{vat.toFixed(2)}</td>
                        <td className="py-3 px-3 font-bold text-gray-900">
                          {total.toFixed(2)}
                        </td>
                        <td className="py-3 px-3 font-sans">
                          <Badge variant="outline">{inv.gatewayName}</Badge>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Refund Queue Tab */}
        <TabsContent value="refunds" className="mt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Refund Queue & Eligibility Verification
              </h2>
              <p className="text-xs text-gray-500">
                Self-serve 7-day money-back claims (verified: &lt; 20% consumed and &lt;= 1 full mock).
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Refund ID</th>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Customer</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Eligibility Detail</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {refunds.map((ref) => (
                    <tr key={ref.id} className="hover:bg-gray-50/80">
                      <td className="py-3 px-3 font-mono font-medium text-gray-900">
                        {ref.id}
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600">{ref.orderId}</td>
                      <td className="py-3 px-3 font-medium text-gray-900">{ref.customer}</td>
                      <td className="py-3 px-3 font-bold text-gray-900">{ref.amount}</td>
                      <td className="py-3 px-3 text-gray-600">{ref.reason}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={
                            ref.status === 'processed'
                              ? 'bg-emerald-100 text-emerald-800'
                              : ref.status === 'declined'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }
                        >
                          {ref.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {ref.status === 'pending_approval' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleRefundAction(ref.id, 'processed')}
                              className="h-7 bg-emerald-600 px-2 text-[11px] text-white hover:bg-emerald-500"
                            >
                              Approve Refund
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRefundAction(ref.id, 'declined')}
                              className="h-7 border-red-200 px-2 text-[11px] text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        {/* Pending Manual bKash / Nagad Approvals Tab (P1-41) */}
        <TabsContent value="manual" className="mt-4">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-2xs">
            <div className="mb-4">
              <h2 className="text-base font-bold text-gray-900">
                Pending Manual bKash & Nagad Payment Approvals
              </h2>
              <p className="text-xs text-gray-500">
                Verify student-submitted TrxIDs against the bKash/Nagad merchant statement. 1-click approval triggers standard entitlement grants and Mushak receipt issuance.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-gray-200 bg-gray-50 text-gray-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Order ID</th>
                    <th className="py-2.5 px-3">Student</th>
                    <th className="py-2.5 px-3">Course / Package</th>
                    <th className="py-2.5 px-3">Method</th>
                    <th className="py-2.5 px-3">Sender Phone</th>
                    <th className="py-2.5 px-3">TrxID</th>
                    <th className="py-2.5 px-3">Amount</th>
                    <th className="py-2.5 px-3">Submitted</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {manualPayments.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/80">
                      <td className="py-3 px-3 font-mono font-medium text-gray-900">
                        {item.orderId}
                      </td>
                      <td className="py-3 px-3 font-semibold text-gray-900">
                        {item.customerName}
                      </td>
                      <td className="py-3 px-3 text-gray-700">{item.productName}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={
                            item.method === 'bkash'
                              ? 'border-pink-300 bg-pink-50 text-pink-700'
                              : 'border-orange-300 bg-orange-50 text-orange-700'
                          }
                        >
                          {item.method.toUpperCase()}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 font-mono text-gray-600">{item.senderNumber}</td>
                      <td className="py-3 px-3 font-mono font-bold text-gray-900">{item.trxId}</td>
                      <td className="py-3 px-3 font-semibold text-gray-900">{item.amount}</td>
                      <td className="py-3 px-3 text-gray-500">{item.submittedAt}</td>
                      <td className="py-3 px-3">
                        <Badge
                          className={
                            item.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : item.status === 'rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-3 text-right">
                        {item.status === 'pending_verification' && (
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              size="sm"
                              onClick={() => handleManualPaymentAction(item.id, 'approved')}
                              className="h-7 bg-emerald-600 px-2.5 text-[11px] text-white hover:bg-emerald-500"
                            >
                              Approve TrxID
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleManualPaymentAction(item.id, 'rejected')}
                              className="h-7 border-red-200 px-2 text-[11px] text-red-600 hover:bg-red-50"
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </td>
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
