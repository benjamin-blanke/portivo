import { NextRequest, NextResponse } from "next/server";
import { listPages, createPage, getPageBySlug } from "@/lib/db/pages";
import { parseJsonBody, errorResponse } from "@/lib/api";
import { pageCreateSchema } from "@/lib/validation";
import { RESERVED_PAGE_SLUGS } from "@/lib/constants";

export async function GET() {
  const pages = await listPages();
  return NextResponse.json(pages);
}

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, pageCreateSchema);
  if (!parsed.success) return parsed.response;

  if (RESERVED_PAGE_SLUGS.has(parsed.data.slug)) {
    return errorResponse(400, "That slug is reserved, please choose another");
  }

  const existing = await getPageBySlug(parsed.data.slug);
  if (existing) {
    return errorResponse(409, "A page with this slug already exists");
  }

  try {
    const page = await createPage(parsed.data);
    return NextResponse.json(page, { status: 201 });
  } catch (err) {
    console.error(err);
    return errorResponse(500, "Failed to create page");
  }
}
