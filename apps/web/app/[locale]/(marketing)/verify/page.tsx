/** @purpose Public Certificate Search & Verification directory page */
'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import { Award, Search, ShieldCheck } from 'lucide-react';

export default function CertificateSearchPage() {
  const [certInput, setCertInput] = React.useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (certInput.trim()) {
      router.push(`/verify/${certInput.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-xl w-full space-y-8 text-center">
        <Badge variant="outline" className="border-accent text-accent text-xs">
          Official Registry
        </Badge>
        <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
          Verify a Certificate
        </h1>
        <p className="text-sm text-fg-muted">
          Enter the unique Certificate ID (e.g. <span className="font-mono">LUMEN-CERT-7B9F12A4</span>) to verify its authenticity and accreditation status.
        </p>

        <Card className="border-border bg-surface text-left">
          <CardHeader>
            <CardTitle className="text-base font-bold text-fg flex items-center gap-2">
              <Award className="h-5 w-5 text-accent" /> Certificate Lookup
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="space-y-1.5">
                <label htmlFor="certIdInput" className="text-xs font-semibold text-fg">
                  Certificate Identifier
                </label>
                <div className="relative">
                  <input
                    id="certIdInput"
                    type="text"
                    value={certInput}
                    onChange={(e) => setCertInput(e.target.value)}
                    placeholder="e.g. LUMEN-CERT-7B9F12A4"
                    className="w-full rounded-md border border-border bg-canvas px-3.5 py-2.5 text-sm font-mono text-fg uppercase focus:border-accent focus:outline-none"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 font-semibold">
                <Search className="h-4 w-4" /> Verify Credential
              </Button>
            </form>

            <div className="mt-6 border-t border-border/60 pt-4 text-xs text-fg-subtle space-y-2">
              <div className="font-semibold text-fg-muted">Sample Test Credentials:</div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/verify/LUMEN-CERT-7B9F12A4"
                  className="rounded border border-border bg-canvas px-2.5 py-1 text-accent hover:underline font-mono text-[11px]"
                >
                  LUMEN-CERT-7B9F12A4 (Valid)
                </Link>
                <Link
                  href="/verify/LUMEN-CERT-REVOKED1"
                  className="rounded border border-border bg-canvas px-2.5 py-1 text-danger hover:underline font-mono text-[11px]"
                >
                  LUMEN-CERT-REVOKED1 (Revoked)
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="pt-2 text-xs text-fg-muted flex items-center justify-center gap-2">
          <ShieldCheck className="h-4 w-4 text-accent" />
          <span>Deterministic Verification • Immediate Status Reporting</span>
        </div>
      </div>
    </div>
  );
}
