"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-client";
import { Button, TextInput } from "@/components/admin/ui/form";

interface SectionRow {
  id: string;
  key: string;
  type: string;
  title: string;
  order: number;
  visible: boolean;
  isFixed: boolean;
}

export default function SectionsOverviewPage() {
  const router = useRouter();
  const [sections, setSections] = useState<SectionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addingTitle, setAddingTitle] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [busyKey, setBusyKey] = useState<string | null>(null);

  function load() {
    adminApi
      .get<SectionRow[]>("/api/admin/sections")
      .then((data) => setSections(data.sort((a, b) => a.order - b.order)))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleVisible(section: SectionRow) {
    setBusyKey(section.key);
    const nextVisible = !section.visible;
    setSections((prev) => prev.map((s) => (s.key === section.key ? { ...s, visible: nextVisible } : s)));
    try {
      await adminApi.put(`/api/admin/sections/${section.key}`, { visible: nextVisible });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update");
      load();
    } finally {
      setBusyKey(null);
    }
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= sections.length) return;
    const next = sections.slice();
    [next[index], next[target]] = [next[target], next[index]];
    setSections(next);
    try {
      await adminApi.post("/api/admin/sections/reorder", {
        order: next.map((s, i) => ({ key: s.key, order: i })),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reorder");
      load();
    }
  }

  async function handleAddCustom() {
    if (!addingTitle.trim()) return;
    try {
      const section = await adminApi.post<SectionRow>("/api/admin/sections", { title: addingTitle.trim() });
      setShowAdd(false);
      setAddingTitle("");
      router.push(`/admin/dashboard/sections/${section.key}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create section");
    }
  }

  async function handleDelete(section: SectionRow) {
    if (!confirm(`Delete the "${section.title}" section? This cannot be undone.`)) return;
    try {
      await adminApi.del(`/api/admin/sections/${section.key}`);
      setSections((prev) => prev.filter((s) => s.key !== section.key));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete section");
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Homepage sections</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Turn sections on or off, reorder them, and edit their content. Hidden sections won&apos;t appear on your
        website.
      </p>

      {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white shadow-sm">
        {sections.map((section, index) => (
          <div key={section.key} className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex flex-1 items-center gap-3">
              <div className="flex flex-col">
                <button
                  onClick={() => move(index, -1)}
                  disabled={index === 0}
                  className="text-neutral-400 hover:text-neutral-800 disabled:opacity-20"
                  aria-label="Move up"
                >
                  ↑
                </button>
                <button
                  onClick={() => move(index, 1)}
                  disabled={index === sections.length - 1}
                  className="text-neutral-400 hover:text-neutral-800 disabled:opacity-20"
                  aria-label="Move down"
                >
                  ↓
                </button>
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-neutral-900">{section.title || section.key}</p>
                <p className="text-xs text-neutral-400">{section.isFixed ? "Built-in section" : "Custom section"}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 pl-8 sm:pl-0">
              <button
                onClick={() => toggleVisible(section)}
                disabled={busyKey === section.key}
                className={
                  "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors " +
                  (section.visible ? "bg-neutral-900" : "bg-neutral-300")
                }
                aria-label="Toggle visibility"
              >
                <span
                  className={
                    "inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow transition-transform " +
                    (section.visible ? "translate-x-6" : "translate-x-1")
                  }
                />
              </button>

              <Link href={`/admin/dashboard/sections/${section.key}`}>
                <Button variant="secondary">Edit</Button>
              </Link>

              {!section.isFixed ? (
                <Button variant="ghost" onClick={() => handleDelete(section)}>
                  Delete
                </Button>
              ) : null}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6">
        {showAdd ? (
          <div className="flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center">
            <TextInput
              value={addingTitle}
              onChange={(e) => setAddingTitle(e.target.value)}
              placeholder="Section title, e.g. Testimonials"
              autoFocus
              className="sm:flex-1"
            />
            <div className="flex gap-2">
              <Button onClick={handleAddCustom}>Create</Button>
              <Button variant="ghost" onClick={() => setShowAdd(false)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setShowAdd(true)}>
            + Add custom section
          </Button>
        )}
      </div>
    </div>
  );
}
