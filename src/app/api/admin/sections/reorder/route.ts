import { NextRequest, NextResponse } from "next/server";
import { reorderSections } from "@/lib/db/sections";
import { parseJsonBody, errorResponse } from "@/lib/api";
import { reorderSectionsSchema } from "@/lib/validation";

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, reorderSectionsSchema);
  if (!parsed.success) return parsed.response;

  try {
    await reorderSections(parsed.data.order);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return errorResponse(500, "Failed to reorder sections");
  }
}
