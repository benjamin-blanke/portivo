"use client";

import { useEffect, useRef, useState } from "react";
import { adminApi, fileToDataUrl } from "@/lib/admin-client";
import { Button } from "./form";

interface MediaItem {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  dataUrl: string;
  alt: string;
  createdAt: string;
}

export function MediaLibraryModal({
  onSelect,
  onClose,
}: {
  onSelect: (dataUrl: string) => void;
  onClose: () => void;
}) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    adminApi
      .get<MediaItem[]>("/api/admin/media")
      .then(setItems)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
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
      onSelect(media.dataUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await adminApi.del(`/api/admin/media/${id}`);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete image");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h3 className="text-base font-semibold text-neutral-900">Media library</h3>
          <button onClick={onClose} className="text-neutral-400 hover:text-neutral-700" aria-label="Close">
            ✕
          </button>
        </div>

        <div className="border-b border-neutral-200 px-5 py-4">
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
            {uploading ? "Uploading…" : "Upload new image"}
          </Button>
          <span className="ml-3 text-xs text-neutral-400">PNG, JPEG, WEBP, GIF, or SVG — max 4MB</span>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <p className="text-sm text-neutral-400">Loading…</p>
          ) : items.length === 0 ? (
            <p className="text-sm text-neutral-400">No images uploaded yet.</p>
          ) : (
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
              {items.map((item) => (
                <div key={item.id} className="group relative overflow-hidden rounded-lg border border-neutral-200">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.dataUrl}
                    alt={item.alt || item.filename}
                    className="aspect-square w-full cursor-pointer object-cover"
                    onClick={() => onSelect(item.dataUrl)}
                  />
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="absolute right-1 top-1 rounded bg-black/60 px-1.5 py-0.5 text-xs text-white opacity-0 transition group-hover:opacity-100"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
