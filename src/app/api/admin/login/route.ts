import { NextRequest, NextResponse } from "next/server";
import { verifyAdminPassword } from "@/lib/security";
import { createSessionToken, SESSION_COOKIE_NAME, SESSION_MAX_AGE_SECONDS } from "@/lib/session";
import { parseJsonBody, errorResponse } from "@/lib/api";
import { loginSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, loginSchema);
  if (!parsed.success) return parsed.response;

  let isValid: boolean;
  try {
    isValid = verifyAdminPassword(parsed.data.password);
  } catch {
    return errorResponse(500, "Admin panel is not configured. Set ADMIN_PASSWORD.");
  }

  if (!isValid) {
    return errorResponse(401, "Incorrect password");
  }

  const token = await createSessionToken();
  const response = NextResponse.json({ success: true });
  response.cookies.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return response;
}
