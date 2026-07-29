import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/security";
import { isSitePaid, setSitePaid } from "@/lib/db/payment";

/**
 * Private endpoint used only by the site owner to remotely enable/disable
 * the public website (e.g. for non-payment). Authenticated with API_KEY,
 * completely separate from the admin panel's session-cookie auth. Never
 * called by the admin panel or the public site itself.
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

  const isPaid = await isSitePaid();
  return NextResponse.json({ isPaid, status: isPaid ? "paid" : "unpaid" });
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let requestedStatus: "paid" | "unpaid" | undefined;
  try {
    const body = await request.json();
    if (body && (body.status === "paid" || body.status === "unpaid")) {
      requestedStatus = body.status;
    }
  } catch {
    // No/invalid JSON body is fine — falls back to toggling.
  }

  let nextIsPaid: boolean;
  if (requestedStatus) {
    nextIsPaid = requestedStatus === "paid";
  } else {
    const current = await isSitePaid();
    nextIsPaid = !current;
  }

  const isPaid = await setSitePaid(nextIsPaid);
  return NextResponse.json({ isPaid, status: isPaid ? "paid" : "unpaid" });
}
