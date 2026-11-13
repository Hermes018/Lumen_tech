/** @purpose Public Certificate Verification page with validity and revocation badges (docs/02 §7.1, docs/17 §11) */
import Link from 'next/link';
import {
  verifyCertificate,
  type CertificateRecord,
} from '@lumen/core';
import { Button, Badge, Card, CardHeader, CardContent } from '@lumen/ui';
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  ShieldAlert,
  Award,
  Calendar,
  User,
  GraduationCap,
  ArrowRight,
} from 'lucide-react';

// Seeded sample database for public verification demos
const SEEDED_CERTIFICATE_DB = new Map<string, CertificateRecord>([
  [
    'LUMEN-CERT-7B9F12A4',
    {
      certId: 'LUMEN-CERT-7B9F12A4',
      userId: 'usr_grad_101',
      recipientName: 'Tanjim Ahmed',
      courseSlug: 'gre-core',
      courseName: 'GRE® General Test Core Mastery',
      exam: 'gre',
      issueDate: new Date('2026-10-15T00:00:00Z'),
      status: 'valid',
      verificationUrl: '/verify/LUMEN-CERT-7B9F12A4',
    },
  ],
  [
    'LUMEN-CERT-8C21EA55',
    {
      certId: 'LUMEN-CERT-8C21EA55',
      userId: 'usr_grad_102',
      recipientName: 'Farhana Chowdhury',
      courseSlug: 'ielts-academic-plus',
      courseName: 'IELTS® Academic Plus Comprehensive Track',
      exam: 'ielts_academic',
      issueDate: new Date('2026-11-01T00:00:00Z'),
      status: 'valid',
      verificationUrl: '/verify/LUMEN-CERT-8C21EA55',
    },
  ],
  [
    'LUMEN-CERT-REVOKED1',
    {
      certId: 'LUMEN-CERT-REVOKED1',
      userId: 'usr_refund_202',
      recipientName: 'Sadia Islam',
      courseSlug: 'ielts-academic-core',
      courseName: 'IELTS® Academic Core',
      exam: 'ielts_academic',
      issueDate: new Date('2026-09-10T00:00:00Z'),
      status: 'revoked',
      revocationReason: 'Course enrollment refunded under 7-day money-back guarantee (docs/02 §7.1)',
      revokedAt: new Date('2026-09-14T00:00:00Z'),
      verificationUrl: '/verify/LUMEN-CERT-REVOKED1',
    },
  ],
]);

interface PageProps {
  params: Promise<{
    locale: string;
    certId: string;
  }>;
}

export default async function CertificateVerificationPage({ params }: PageProps) {
  const { certId } = await params;
  const verification = verifyCertificate(certId, SEEDED_CERTIFICATE_DB);
  const cert = verification.certificate;

  return (
    <div className="flex flex-col items-center px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-3xl w-full space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <Badge variant="outline" className="border-accent text-accent text-xs">
            Public Credential Registry
          </Badge>
          <h1 className="text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">
            Certificate Verification
          </h1>
          <p className="text-sm text-fg-muted">
            Official authenticity verification for Lumen Academy course completion credentials.
          </p>
        </div>

        {/* Certificate Status Card */}
        {verification.exists && cert ? (
          <Card className={`border-2 bg-surface shadow-md ${cert.status === 'valid' ? 'border-success/60' : 'border-danger/60'}`}>
            <CardHeader className="border-b border-border/60 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-fg">
                  <Award className="h-5 w-5 text-accent" />
                  <span>{cert.certId}</span>
                </div>

                {cert.status === 'valid' ? (
                  <Badge variant="default" className="bg-success text-success-fg gap-1 px-3 py-1 text-xs">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Verified & Valid
                  </Badge>
                ) : (
                  <Badge variant="default" className="bg-danger text-danger-fg gap-1 px-3 py-1 text-xs">
                    <XCircle className="h-3.5 w-3.5" /> Revoked Credential
                  </Badge>
                )}
              </div>
            </CardHeader>

            <CardContent className="space-y-6 pt-6">
              {/* Recipient Details */}
              <div className="grid gap-4 sm:grid-cols-2 text-sm">
                <div className="space-y-1">
                  <div className="text-xs text-fg-muted font-medium flex items-center gap-1.5">
                    <User className="h-4 w-4 text-accent" /> Recipient Name
                  </div>
                  <div className="text-lg font-bold text-fg">{cert.recipientName}</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-fg-muted font-medium flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-accent" /> Issue Date
                  </div>
                  <div className="text-base font-semibold text-fg">
                    {cert.issueDate.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <div className="text-xs text-fg-muted font-medium flex items-center gap-1.5">
                    <GraduationCap className="h-4 w-4 text-accent" /> Course / Examination Track
                  </div>
                  <div className="text-base font-bold text-accent">{cert.courseName}</div>
                </div>
              </div>

              {/* Revocation Alert if Revoked */}
              {cert.status === 'revoked' && (
                <div className="rounded-xl border border-danger/40 bg-danger-soft p-4 text-xs text-fg space-y-1.5">
                  <div className="flex items-center gap-2 font-bold text-danger">
                    <ShieldAlert className="h-4 w-4" />
                    <span>Credential Revoked</span>
                  </div>
                  <p className="text-fg-muted leading-relaxed">
                    Reason: {cert.revocationReason || 'Course enrollment was refunded or cancelled.'}
                  </p>
                  <p className="text-fg-subtle text-[11px]">
                    Per Lumen Academy policy (docs/02 §7.1 & docs/17 §11), course completion
                    certificates are permanently invalidated upon refund issuance.
                  </p>
                </div>
              )}

              {/* Authenticity Notice */}
              {cert.status === 'valid' && (
                <div className="rounded-xl border border-success/30 bg-success-soft/40 p-4 text-xs text-fg flex items-start gap-3">
                  <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <div className="font-semibold text-success">Authentic Lumen Academy Credential</div>
                    <p className="text-fg-muted text-[11px] leading-relaxed">
                      This certificate confirms that the student named above successfully completed all
                      prescribed curriculum modules, computer-based adaptive mock examinations, and
                      evaluation criteria.
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Not Found Card */
          <Card className="border-warning/50 bg-surface shadow-md">
            <CardContent className="p-8 text-center space-y-4">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-warning/20 text-warning">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-fg">Certificate Not Found</h3>
                <p className="text-xs text-fg-muted max-w-md mx-auto">
                  No certificate record was found matching ID <span className="font-mono font-semibold text-fg">{certId}</span>.
                  Please verify the identifier printed on the bottom of the certificate.
                </p>
              </div>

              <div className="pt-2 text-xs text-fg-subtle">
                Demo sample IDs to test:
                <div className="mt-2 flex justify-center gap-3 font-mono">
                  <Link href="/verify/LUMEN-CERT-7B9F12A4" className="text-accent underline">
                    LUMEN-CERT-7B9F12A4 (Valid)
                  </Link>
                  <Link href="/verify/LUMEN-CERT-REVOKED1" className="text-danger underline">
                    LUMEN-CERT-REVOKED1 (Revoked)
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Back Link */}
        <div className="flex justify-center pt-4">
          <Link href="/">
            <Button variant="outline" size="sm" className="gap-2">
              Back to Home <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
