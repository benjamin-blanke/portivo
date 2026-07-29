"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-client";
import { Field, TextInput, TextArea, ToggleField, SaveBar, SectionCard, Button } from "@/components/admin/ui/form";
import { ImagePicker } from "@/components/admin/ui/image-picker";
import { Repeater } from "@/components/admin/ui/repeater";
import type { PageSectionBlock } from "@/lib/types";

interface PageDetail {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  sections: PageSectionBlock[];
}

function newBlock(): PageSectionBlock {
  return { id: crypto.randomUUID(), type: "richtext", title: "", data: {}, order: 0, visible: true };
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function PageEditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [page, setPage] = useState<PageDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .get<PageDetail>(`/api/admin/pages/${params.id}`)
      .then(setPage)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  function update(patch: Partial<PageDetail>) {
    setPage((prev) => (prev ? { ...prev, ...patch } : prev));
    setMessage(null);
  }

  async function handleSave() {
    if (!page) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await adminApi.put<PageDetail>(`/api/admin/pages/${page.id}`, {
        slug: page.slug,
        title: page.title,
        seoTitle: page.seoTitle,
        seoDescription: page.seoDescription,
        published: page.published,
        sections: page.sections,
      });
      setPage(updated);
      setMessage("Saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!page) return;
    if (!confirm(`Delete the page "${page.title}"? This cannot be undone.`)) return;
    try {
      await adminApi.del(`/api/admin/pages/${page.id}`);
      router.push("/admin/dashboard/pages");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete page");
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;
  if (error && !page) return <p className="text-sm text-red-600">{error}</p>;
  if (!page) return null;

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{page.title || "Untitled page"}</h1>
          <p className="mt-1 text-sm text-neutral-500">/{page.slug}</p>
        </div>
        <Button variant="danger" onClick={handleDelete}>
          Delete page
        </Button>
      </div>

      <div className="mt-6 space-y-6">
        <SectionCard title="Page details">
          <Field label="Title">
            <TextInput value={page.title} onChange={(e) => update({ title: e.target.value })} />
          </Field>
          <Field label="URL slug" hint={`Your page will be available at /${page.slug || "…"}`}>
            <TextInput value={page.slug} onChange={(e) => update({ slug: slugify(e.target.value) })} />
          </Field>
          <ToggleField label="Published" checked={page.published} onChange={(v) => update({ published: v })} />
        </SectionCard>

        <SectionCard title="SEO">
          <Field label="SEO title">
            <TextInput value={page.seoTitle} onChange={(e) => update({ seoTitle: e.target.value })} />
          </Field>
          <Field label="Meta description">
            <TextArea rows={2} value={page.seoDescription} onChange={(e) => update({ seoDescription: e.target.value })} />
          </Field>
        </SectionCard>

        <SectionCard title="Page content" description="Add blocks to build your page, top to bottom.">
          <Repeater
            items={page.sections}
            onChange={(sections) => update({ sections })}
            createItem={newBlock}
            itemLabel={(item) => item.title || item.type}
            addLabel="Add block"
            emptyLabel="No content blocks yet."
            renderItem={(item, updateBlock) => (
              <>
                <Field label="Block type">
                  <select
                    value={item.type}
                    onChange={(e) => updateBlock({ type: e.target.value as PageSectionBlock["type"], data: {} })}
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 shadow-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
                  >
                    <option value="richtext">Text</option>
                    <option value="image">Image</option>
                    <option value="cta">Call to action</option>
                  </select>
                </Field>
                <Field label="Block title" hint="Optional heading shown above this block.">
                  <TextInput value={item.title} onChange={(e) => updateBlock({ title: e.target.value })} />
                </Field>

                {item.type === "richtext" && (
                  <Field label="Text">
                    <TextArea
                      rows={5}
                      value={(item.data.body as string) ?? ""}
                      onChange={(e) => updateBlock({ data: { ...item.data, body: e.target.value } })}
                    />
                  </Field>
                )}

                {item.type === "image" && (
                  <ImagePicker
                    label="Image"
                    value={(item.data.imageUrl as string) ?? ""}
                    onChange={(v) => updateBlock({ data: { ...item.data, imageUrl: v } })}
                  />
                )}

                {item.type === "cta" && (
                  <>
                    <Field label="Text">
                      <TextArea
                        rows={2}
                        value={(item.data.body as string) ?? ""}
                        onChange={(e) => updateBlock({ data: { ...item.data, body: e.target.value } })}
                      />
                    </Field>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Button label">
                        <TextInput
                          value={(item.data.ctaLabel as string) ?? ""}
                          onChange={(e) => updateBlock({ data: { ...item.data, ctaLabel: e.target.value } })}
                        />
                      </Field>
                      <Field label="Button URL">
                        <TextInput
                          value={(item.data.ctaUrl as string) ?? ""}
                          onChange={(e) => updateBlock({ data: { ...item.data, ctaUrl: e.target.value } })}
                        />
                      </Field>
                    </div>
                  </>
                )}

                <ToggleField label="Visible" checked={item.visible} onChange={(v) => updateBlock({ visible: v })} />
              </>
            )}
          />
        </SectionCard>
      </div>

      <SaveBar onSave={handleSave} saving={saving} message={message} error={error} />
    </div>
  );
}
