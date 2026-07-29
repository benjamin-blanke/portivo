import { SignJWT, jwtVerify } from "jose";

export const SESSION_COOKIE_NAME = "admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

let cachedKey: Uint8Array | null = null;

/**
 * Derives the JWT signing key from ADMIN_PASSWORD via SHA-256. This keeps
 * the deployment surface to a single secret (ADMIN_PASSWORD) while still
 * using a proper fixed-length key for HMAC signing, and works identically
 * in the Node.js runtime (API routes) and the Edge runtime (middleware)
 * since it only relies on the standard Web Crypto API.
 */
async function getSecretKey(): Promise<Uint8Array> {
  if (cachedKey) return cachedKey;
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    throw new Error("ADMIN_PASSWORD environment variable is not set");
  }
  const digest = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(`admin-session-key:${password}`)
  );
  cachedKey = new Uint8Array(digest);
  return cachedKey;
}

export async function createSessionToken(): Promise<string> {
  const key = await getSecretKey();
  return new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .sign(key);
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    const key = await getSecretKey();
    const { payload } = await jwtVerify(token, key);
    return payload.role === "admin";
  } catch {
    return false;
  }
}
