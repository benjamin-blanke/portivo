"use client";

import { useEffect, useRef, useState } from "react";
import { adminApi, fileToDataUrl } from "@/lib/admin-client";
import { Button } from "@/components/admin/ui/form";

interface MediaItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  alt: string;
  createdAt: string;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function load() {
    adminApi
      .get<MediaItem[]>("/api/admin/media")
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    setError(null);
    try {
      if (file.size > 4 * 1024 * 1024) {
        throw new Error("Image is too large (max 4MB)");
      }
      const dataUrl = await fileToDataUrl(file);
      const media = await adminApi.post<MediaItem>("/api/admin/media", {
        filename: file.name,
        mimeType: file.type,
        dataUrl,
      });
      setItems((prev) => [media, ...prev]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this image? Sections currently using it will show a broken image.")) return;
    try {
      await adminApi.del(`/api/admin/media/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Media library</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Images you upload here can be reused across your hero, about, projects, and any other section.
      </p>

      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleUpload(file);
            e.target.value = "";
          }}
        />
        <Button type="button" onClick={() => fileInputRef.current?.click()} disabled={uploading}>
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        <span className="ml-3 text-xs text-neutral-400">PNG, JPEG, WEBP, GIF, or SVG — max 4MB</span>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </div>

      <div className="mt-6">
        {loading ? (
          <p className="text-sm text-neutral-400">Loading…</p>
        ) : items.length === 0 ? (
          <p className="text-sm text-neutral-400">No images uploaded yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {items.map((item) => (
              <div key={item.id} className="overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.dataUrl} alt={item.alt || item.filename} className="aspect-square w-full object-cover" />
                <div className="p-2.5">
                  <p className="truncate text-xs font-medium text-neutral-700" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[11px] text-neutral-400">{formatSize(item.size)}</p>
                  <Button variant="ghost" className="mt-1 w-full !px-0 text-red-500" onClick={() => handleDelete(item.id)}>
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
