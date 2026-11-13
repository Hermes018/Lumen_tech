/**
 * @purpose Web Crypto HMAC-SHA256 cookie signing and verification for PDPO consent and session security (P1-E, P1-F)
 */

const encoder = new TextEncoder();

function getSecret(explicitSecret?: string): string {
  return (
    explicitSecret ||
    process.env.BETTER_AUTH_SECRET ||
    'development-better-auth-secret-32-chars-min'
  );
}

export async function signHmacSha256(value: string, secret?: string): Promise<string> {
  const keySecret = getSecret(secret);
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(keySecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sig = await crypto.subtle.sign('HMAC', key, encoder.encode(value));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function verifyHmacSha256(
  value: string,
  signatureHex: string,
  secret?: string
): Promise<boolean> {
  if (!signatureHex || typeof signatureHex !== 'string') return false;
  const keySecret = getSecret(secret);
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(keySecret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    const bytes = signatureHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) ?? [];
    const sigBytes = new Uint8Array(bytes);
    return await crypto.subtle.verify('HMAC', key, sigBytes, encoder.encode(value));
  } catch {
    return false;
  }
}

/**
 * Produces a signed cookie payload in the format `${value}.${signatureHex}`.
 */
export async function signPdpoCookie(value: string, secret?: string): Promise<string> {
  const sig = await signHmacSha256(value, secret);
  return `${value}.${sig}`;
}

/**
 * Verifies a signed cookie and returns the untampered value, or null if forged/invalid.
 */
export async function verifyPdpoCookie(
  signedValue: string | undefined | null,
  secret?: string
): Promise<string | null> {
  if (!signedValue || typeof signedValue !== 'string') return null;
  const lastDot = signedValue.lastIndexOf('.');
  if (lastDot === -1) return null;
  const value = signedValue.slice(0, lastDot);
  const sig = signedValue.slice(lastDot + 1);
  const isValid = await verifyHmacSha256(value, sig, secret);
  return isValid ? value : null;
}
