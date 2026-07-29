"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-client";
import { Field, TextInput, TextArea, SaveBar, SectionCard } from "@/components/admin/ui/form";
import { ImagePicker } from "@/components/admin/ui/image-picker";

interface SeoSettings {
  seoTitle: string;
  seoDescription: string;
  seoImageUrl: string;
}

export default function SeoSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<SeoSettings>({ seoTitle: "", seoDescription: "", seoImageUrl: "" });

  useEffect(() => {
    adminApi
      .get<SeoSettings>("/api/admin/site")
      .then((site) => setForm({ seoTitle: site.seoTitle, seoDescription: site.seoDescription, seoImageUrl: site.seoImageUrl }))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function update(patch: Partial<SeoSettings>) {
    setForm((prev) => ({ ...prev, ...patch }));
    setMessage(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await adminApi.put("/api/admin/site", form);
      setMessage("Saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">SEO</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Controls how your site appears in search results and social media previews.
      </p>

      <div className="mt-6 space-y-6">
        <SectionCard title="Search & social preview">
          <Field label="SEO title" hint="Falls back to the website title if left blank.">
            <TextInput value={form.seoTitle} onChange={(e) => update({ seoTitle: e.target.value })} />
          </Field>
          <Field label="Meta description" hint="1–2 sentences summarizing your site for search results.">
            <TextArea rows={3} value={form.seoDescription} onChange={(e) => update({ seoDescription: e.target.value })} />
          </Field>
          <ImagePicker label="Preview image" value={form.seoImageUrl} onChange={(v) => update({ seoImageUrl: v })} />
        </SectionCard>
      </div>

      <SaveBar onSave={handleSave} saving={saving} message={message} error={error} />
    </div>
  );
}
