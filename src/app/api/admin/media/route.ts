import { NextRequest, NextResponse } from "next/server";
import { listMedia, createMedia } from "@/lib/db/media";
import { parseJsonBody, errorResponse } from "@/lib/api";
import { mediaUploadSchema } from "@/lib/validation";

const MAX_MEDIA_BYTES = 4 * 1024 * 1024;

export async function GET() {
  const media = await listMedia();
  return NextResponse.json(media);
}

export async function POST(request: NextRequest) {
  const parsed = await parseJsonBody(request, mediaUploadSchema);
  if (!parsed.success) return parsed.response;

  const { filename, mimeType, dataUrl, alt } = parsed.data;

  const base64Marker = "base64,";
  const markerIndex = dataUrl.indexOf(base64Marker);
  if (!dataUrl.startsWith("data:") || markerIndex === -1) {
    return errorResponse(400, "dataUrl must be a base64 data URI");
  }

  const base64 = dataUrl.slice(markerIndex + base64Marker.length);
  const approxBytes = Math.floor((base64.length * 3) / 4);
  if (approxBytes === 0) {
    return errorResponse(400, "Empty image data");
  }
  if (approxBytes > MAX_MEDIA_BYTES) {
    return errorResponse(413, "Image is too large (max 4MB)");
  }

  try {
    const media = await createMedia({ filename, mimeType, size: approxBytes, dataUrl, alt });
    return NextResponse.json(media, { status: 201 });
  } catch (err) {
    console.error(err);
    return errorResponse(500, "Failed to save image");
  }
}
