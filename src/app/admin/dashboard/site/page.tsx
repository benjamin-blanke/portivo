"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-client";
import { Field, TextInput, ColorInput, SaveBar, SectionCard } from "@/components/admin/ui/form";
import { ImagePicker } from "@/components/admin/ui/image-picker";

interface SiteSettings {
  title: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  accentColor: string;
}

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<SiteSettings>({
    title: "",
    tagline: "",
    logoUrl: "",
    faviconUrl: "",
    accentColor: "#e5e5e5",
  });

  useEffect(() => {
    adminApi
      .get<SiteSettings>("/api/admin/site")
      .then((site) => setForm(site))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function update(patch: Partial<SiteSettings>) {
    setForm((prev) => ({ ...prev, ...patch }));
    setMessage(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const site = await adminApi.put<SiteSettings>("/api/admin/site", form);
      setForm(site);
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
      <h1 className="text-xl font-semibold text-neutral-900">Site settings</h1>
      <p className="mt-1 text-sm text-neutral-500">Your website title and branding, shown across every page.</p>

      <div className="mt-6 space-y-6">
        <SectionCard title="Identity">
          <Field label="Website title" hint="Shown in the browser tab and as your main heading.">
            <TextInput value={form.title} onChange={(e) => update({ title: e.target.value })} placeholder="Jane Doe" />
          </Field>
          <Field label="Tagline" hint="A short line under your title, e.g. your role.">
            <TextInput
              value={form.tagline}
              onChange={(e) => update({ tagline: e.target.value })}
              placeholder="Full-stack developer"
            />
          </Field>
        </SectionCard>

        <SectionCard title="Branding">
          <ImagePicker label="Logo" value={form.logoUrl} onChange={(v) => update({ logoUrl: v })} />
          <ImagePicker label="Favicon" value={form.faviconUrl} onChange={(v) => update({ faviconUrl: v })} />
          <Field label="Accent color" hint="Used for buttons and highlights across the site.">
            <ColorInput value={form.accentColor} onChange={(v) => update({ accentColor: v })} />
          </Field>
        </SectionCard>
      </div>

      <SaveBar onSave={handleSave} saving={saving} message={message} error={error} />
    </div>
  );
}
