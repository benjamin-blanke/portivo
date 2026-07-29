"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-client";
import { Field, TextInput, TextArea, ToggleField, SaveBar, SectionCard } from "@/components/admin/ui/form";
import { Repeater } from "@/components/admin/ui/repeater";
import type { FooterData, FooterLink, SocialLink } from "@/lib/types";
import { emptyFooter } from "@/lib/types";

function newLink(): FooterLink {
  return { id: crypto.randomUUID(), label: "", url: "" };
}

function newSocial(): SocialLink {
  return { id: crypto.randomUUID(), platform: "", url: "" };
}

export default function FooterPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState<FooterData>(emptyFooter);

  useEffect(() => {
    adminApi
      .get<{ footer: FooterData }>("/api/admin/site")
      .then((site) => setForm(site.footer))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function update(patch: Partial<FooterData>) {
    setForm((prev) => ({ ...prev, ...patch }));
    setMessage(null);
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await adminApi.put("/api/admin/site", { footer: form });
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
      <h1 className="text-xl font-semibold text-neutral-900">Footer</h1>
      <p className="mt-1 text-sm text-neutral-500">Shown at the bottom of every page.</p>

      <div className="mt-6 space-y-6">
        <SectionCard title="Footer text">
          <Field label="Text" hint="e.g. a short closing note.">
            <TextArea rows={2} value={form.text} onChange={(e) => update({ text: e.target.value })} />
          </Field>
          <ToggleField label="Show current year (e.g. © 2026)" checked={form.showYear} onChange={(v) => update({ showYear: v })} />
        </SectionCard>

        <SectionCard title="Links">
          <Repeater
            items={form.links}
            onChange={(links) => update({ links })}
            createItem={newLink}
            itemLabel={(item) => item.label}
            addLabel="Add link"
            renderItem={(item, u) => (
              <>
                <Field label="Label">
                  <TextInput value={item.label} onChange={(e) => u({ label: e.target.value })} placeholder="Privacy" />
                </Field>
                <Field label="URL">
                  <TextInput value={item.url} onChange={(e) => u({ url: e.target.value })} placeholder="/privacy" />
                </Field>
              </>
            )}
          />
        </SectionCard>

        <SectionCard title="Social links">
          <Repeater
            items={form.socialLinks}
            onChange={(socialLinks) => update({ socialLinks })}
            createItem={newSocial}
            itemLabel={(item) => item.platform}
            addLabel="Add social link"
            renderItem={(item, u) => (
              <>
                <Field label="Platform">
                  <TextInput value={item.platform} onChange={(e) => u({ platform: e.target.value })} placeholder="GitHub" />
                </Field>
                <Field label="URL">
                  <TextInput value={item.url} onChange={(e) => u({ url: e.target.value })} placeholder="https://github.com/…" />
                </Field>
              </>
            )}
          />
        </SectionCard>
      </div>

      <SaveBar onSave={handleSave} saving={saving} message={message} error={error} />
    </div>
  );
}
