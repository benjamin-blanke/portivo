import { NextResponse } from "next/server";

/** Reaching this handler means middleware already validated the session cookie. */
export async function GET() {
  return NextResponse.json({ authenticated: true });
}
