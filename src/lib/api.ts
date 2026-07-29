import { NextResponse } from "next/server";
import type { ZodType } from "zod";

export function errorResponse(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

type ParseResult<T> = { success: true; data: T } | { success: false; response: NextResponse };

export async function parseJsonBody<T>(request: Request, schema: ZodType<T>): Promise<ParseResult<T>> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return { success: false, response: errorResponse(400, "Invalid JSON body") };
  }

  const result = schema.safeParse(body);
  if (!result.success) {
    const message = result.error.issues.map((issue) => issue.message).join("; ") || "Invalid request body";
    return { success: false, response: errorResponse(400, message) };
  }

  return { success: true, data: result.data };
}
