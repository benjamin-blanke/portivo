import { NextRequest, NextResponse } from "next/server";
import { getSectionByKey, updateSection, deleteCustomSection } from "@/lib/db/sections";
import { parseJsonBody, errorResponse } from "@/lib/api";
import { sectionUpdateSchema } from "@/lib/validation";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const section = await getSectionByKey(key);
  if (!section) return errorResponse(404, "Section not found");
  return NextResponse.json(section);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const parsed = await parseJsonBody(request, sectionUpdateSchema);
  if (!parsed.success) return parsed.response;

  try {
    const section = await updateSection(key, parsed.data);
    return NextResponse.json(section);
  } catch (err) {
    console.error(err);
    return errorResponse(404, "Section not found");
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  try {
    await deleteCustomSection(key);
    return NextResponse.json({ success: true });
  } catch (err) {
    return errorResponse(400, err instanceof Error ? err.message : "Failed to delete section");
  }
}
