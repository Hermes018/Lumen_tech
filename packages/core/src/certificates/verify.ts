/** @purpose Certificate Issuance and Public Verification with refund revocation rules (docs/02 §7.1, docs/17 §11) */

export interface CertificateRecord {
  certId: string; // e.g. "LUMEN-CERT-7B9F12A4"
  userId: string;
  recipientName: string;
  courseSlug: string;
  courseName: string;
  exam: 'gre' | 'ielts_academic' | 'ielts_gt';
  issueDate: Date;
  status: 'valid' | 'revoked';
  revocationReason?: string;
  revokedAt?: Date;
  verificationUrl: string;
}

export interface CertificateVerificationResult {
  exists: boolean;
  certificate?: CertificateRecord;
  isValid: boolean;
  message: string;
}

/**
 * Deterministically generates or formats a Lumen Certificate identifier.
 */
export function generateCertificateId(userId: string, courseSlug: string, seedTime = Date.now()): string {
  // Deterministic hex hash chunk from userId + courseSlug + timestamp
  const raw = `${userId}-${courseSlug}-${seedTime}`;
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, '0').slice(0, 8);
  return `LUMEN-CERT-${hex}`;
}

/**
 * Issues an authentic course completion certificate.
 */
export function issueCertificate(params: {
  userId: string;
  recipientName: string;
  courseSlug: string;
  courseName: string;
  exam: 'gre' | 'ielts_academic' | 'ielts_gt';
  issueDate?: Date;
}): CertificateRecord {
  const {
    userId,
    recipientName,
    courseSlug,
    courseName,
    exam,
    issueDate = new Date(),
  } = params;

  const certId = generateCertificateId(userId, courseSlug, issueDate.getTime());

  return {
    certId,
    userId,
    recipientName,
    courseSlug,
    courseName,
    exam,
    issueDate,
    status: 'valid',
    verificationUrl: `/verify/${certId}`,
  };
}

/**
 * Revokes a certificate upon course refund (per docs/02 §7.1 and docs/17 §11).
 */
export function revokeCertificate(
  certificate: CertificateRecord,
  reason = 'Course enrollment refunded under 7-day money-back policy'
): CertificateRecord {
  return {
    ...certificate,
    status: 'revoked',
    revocationReason: reason,
    revokedAt: new Date(),
  };
}

/**
 * Looks up certificate validity for the public /verify/[certId] route.
 */
export function verifyCertificate(
  certId: string,
  database: Map<string, CertificateRecord>
): CertificateVerificationResult {
  const cleanId = certId.trim().toUpperCase();
  const cert = database.get(cleanId);

  if (!cert) {
    return {
      exists: false,
      isValid: false,
      message: 'Certificate not found. Please verify the ID on your document.',
    };
  }

  if (cert.status === 'revoked') {
    return {
      exists: true,
      certificate: cert,
      isValid: false,
      message: `Certificate was revoked: ${cert.revocationReason || 'Enrollment cancelled'}`,
    };
  }

  return {
    exists: true,
    certificate: cert,
    isValid: true,
    message: 'Official Lumen Academy Certificate is verified and valid.',
  };
}
