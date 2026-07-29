import { prisma } from "@/lib/prisma";

export interface MediaView {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  alt: string;
  createdAt: Date;
}

export async function listMedia(): Promise<MediaView[]> {
  return prisma.mediaAsset.findMany({ orderBy: { createdAt: "desc" } });
}

export async function createMedia(input: {
  filename: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  alt?: string;
}): Promise<MediaView> {
  return prisma.mediaAsset.create({
    data: {
      filename: input.filename,
      mimeType: input.mimeType,
      size: input.size,
      dataUrl: input.dataUrl,
      alt: input.alt ?? "",
    },
  });
}

export async function deleteMedia(id: string): Promise<void> {
  await prisma.mediaAsset.delete({ where: { id } });
}
