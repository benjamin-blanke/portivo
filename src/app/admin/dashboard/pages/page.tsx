"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-client";
import { Button, Field, TextInput } from "@/components/admin/ui/form";

interface PageRow {
  id: string;
  slug: string;
  title: string;
  published: boolean;
  updatedAt: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PagesListPage() {
  const router = useRouter();
  const [pages, setPages] = useState<PageRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [title, setTitle] = useState("");
  const [creating, setCreating] = useState(false);

  function load() {
    adminApi
      .get<PageRow[]>("/api/admin/pages")
      .then(setPages)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function handleCreate() {
    if (!title.trim()) return;
    setCreating(true);
    setError(null);
    try {
      const page = await adminApi.post<PageRow>("/api/admin/pages", {
        title: title.trim(),
        slug: slugify(title),
      });
      router.push(`/admin/dashboard/pages/${page.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create page");
      setCreating(false);
    }
  }

  async function handleDelete(page: PageRow) {
    if (!confirm(`Delete the page "${page.title}"? This cannot be undone.`)) return;
    try {
      await adminApi.del(`/api/admin/pages/${page.id}`);
      setPages((prev) => prev.filter((p) => p.id !== page.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete page");
    }
  }

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Custom pages</h1>
      <p className="mt-1 text-sm text-neutral-500">Additional pages beyond your homepage, e.g. /uses or /blog.</p>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
        {loading ? (
          <p className="px-4 py-4 text-sm text-neutral-400">Loading…</p>
        ) : pages.length === 0 ? (
          <p className="px-4 py-4 text-sm text-neutral-400">No custom pages yet.</p>
        ) : (
          pages.map((page) => (
            <div key={page.id} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-neutral-900">{page.title}</p>
                <p className="text-xs text-neutral-400">
                  /{page.slug} · {page.published ? "Published" : "Draft"}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Link href={`/admin/dashboard/pages/${page.id}`}>
                  <Button variant="secondary">Edit</Button>
                </Link>
                <Button variant="ghost" onClick={() => handleDelete(page)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-6">
        {showCreate ? (
          <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-end">
            <div className="flex-1">
              <Field label="Page title">
                <TextInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Uses" autoFocus />
              </Field>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate} disabled={creating}>
                Create
              </Button>
              <Button variant="ghost" onClick={() => setShowCreate(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setShowCreate(true)}>
            + Add page
          </Button>
        )}
      </div>
    </div>
  );
}
