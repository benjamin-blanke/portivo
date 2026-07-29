import { NextRequest, NextResponse } from "next/server";
import { getAllSections, createCustomSection } from "@/lib/db/sections";
import { parseJsonBody, errorResponse } from "@/lib/api";
import { createCustomSectionSchema } from "@/lib/validation";

export async function GET() {
  const sections = await getAllSections();
  return NextResponse.json(sections);
}

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, createCustomSectionSchema);
  if (!parsed.success) return parsed.response;

  try {
    const section = await createCustomSection(parsed.data);
    return NextResponse.json(section, { status: 201 });
  } catch (err) {
    console.error(err);
    return errorResponse(500, "Failed to create section");
  }
}
