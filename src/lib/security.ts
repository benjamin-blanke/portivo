const encoder = new TextEncoder();

/**
 * Constant-time byte comparison. Used for password/API-key checks so
 * response timing doesn't leak how many leading bytes matched.
 */
function timingSafeEqualBytes(a: Uint8Array, b: Uint8Array): boolean {
  const length = Math.max(a.length, b.length);
  let diff = a.length === b.length ? 0 : 1;
  for (let i = 0; i < length; i++) {
    diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  }
  return diff === 0;
}

function timingSafeEqualStrings(candidate: string, expected: string): boolean {
  return timingSafeEqualBytes(encoder.encode(candidate), encoder.encode(expected));
}

/** Verifies a candidate password against ADMIN_PASSWORD. */
export function verifyAdminPassword(candidate: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  if (typeof candidate !== "string" || candidate.length === 0) return false;
  return timingSafeEqualStrings(candidate, expected);
}

/** Verifies a candidate key against the private API_KEY. */
export function verifyApiKey(candidate: string | null | undefined): boolean {
  const expected = process.env.API_KEY;
  if (!expected) {
    throw new Error("API_KEY environment variable is not set");
  }
  if (!candidate) return false;
  return timingSafeEqualStrings(candidate, expected);
}
