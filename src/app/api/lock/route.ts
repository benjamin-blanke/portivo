import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/security";
import { getSiteLock, setSiteLock } from "@/lib/db/lock";

/**
 * Private endpoint used only by the site owner to manually disable the
 * public website with a visible reason (e.g. maintenance, a policy issue).
 * Authenticated with API_KEY, same as /api/payment, but kept fully
 * independent from the payment lock. Never called by the admin panel or
 * the public site itself.
 */

function extractApiKey(request: NextRequest): string | null {
  const headerKey = request.headers.get("x-api-key");
  if (headerKey) return headerKey;

  const authHeader = request.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    return authHeader.slice(7).trim();
  }

  return null;
}

function isAuthorized(request: NextRequest): boolean {
  try {
    return verifyApiKey(extractApiKey(request));
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const status = await getSiteLock();
  return NextResponse.json(status);
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body" }, { status: 400 });
  }

  const parsed = body as { locked?: unknown; reason?: unknown };
  if (typeof parsed.locked !== "boolean") {
    return NextResponse.json({ error: "'locked' must be a boolean" }, { status: 400 });
  }

  const reason = typeof parsed.reason === "string" ? parsed.reason.trim() : "";
  if (parsed.locked && !reason) {
    return NextResponse.json({ error: "'reason' is required when locking the site" }, { status: 400 });
  }

  const status = await setSiteLock(parsed.locked, parsed.locked ? reason : "");
  return NextResponse.json(status);
}
