import { NextRequest, NextResponse } from "next/server";
import { getSite, updateSite } from "@/lib/db/site";
import { parseJsonBody, errorResponse } from "@/lib/api";
import { siteUpdateSchema } from "@/lib/validation";

export async function GET() {
  const site = await getSite();
  return NextResponse.json(site);
}

export async function PUT(request: NextRequest) {
  const parsed = await parseJsonBody(request, siteUpdateSchema);
  if (!parsed.success) return parsed.response;

  try {
    const site = await updateSite(parsed.data);
    return NextResponse.json(site);
  } catch (err) {
    console.error(err);
    return errorResponse(500, "Failed to update site settings");
  }
}
