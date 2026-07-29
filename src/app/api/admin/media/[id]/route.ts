import { NextRequest, NextResponse } from "next/server";
import { deleteMedia } from "@/lib/db/media";
import { errorResponse } from "@/lib/api";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await deleteMedia(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return errorResponse(404, "Media not found");
  }
}
