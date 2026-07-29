import { NextRequest, NextResponse } from "next/server";
import { getPageById, updatePage, deletePage, getPageBySlug } from "@/lib/db/pages";
import { parseJsonBody, errorResponse } from "@/lib/api";
import { pageUpdateSchema } from "@/lib/validation";
import { RESERVED_PAGE_SLUGS } from "@/lib/constants";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const page = await getPageById(id);
  if (!page) return errorResponse(404, "Page not found");
  return NextResponse.json(page);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const parsed = await parseJsonBody(request, pageUpdateSchema);
  if (!parsed.success) return parsed.response;

  if (parsed.data.slug) {
    if (RESERVED_PAGE_SLUGS.has(parsed.data.slug)) {
      return errorResponse(400, "That slug is reserved, please choose another");
    }
    const existing = await getPageBySlug(parsed.data.slug);
    if (existing && existing.id !== id) {
      return errorResponse(409, "A page with this slug already exists");
    }
  }

  try {
    const page = await updatePage(id, parsed.data);
    return NextResponse.json(page);
  } catch (err) {
    console.error(err);
    return errorResponse(404, "Page not found");
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deletePage(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return errorResponse(404, "Page not found");
  }
}
