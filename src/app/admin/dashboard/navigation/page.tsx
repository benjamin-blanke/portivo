"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/lib/admin-client";
import { Field, TextInput, ToggleField, SaveBar, SectionCard } from "@/components/admin/ui/form";
import { Repeater } from "@/components/admin/ui/repeater";
import type { NavItem } from "@/lib/types";

function newNavItem(): NavItem {
  return { id: crypto.randomUUID(), label: "", url: "", openInNewTab: false };
}

export default function NavigationPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [items, setItems] = useState<NavItem[]>([]);

  useEffect(() => {
    adminApi
      .get<{ navigation: NavItem[] }>("/api/admin/site")
      .then((site) => setItems(site.navigation))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      await adminApi.put("/api/admin/site", { navigation: items });
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
      <h1 className="text-xl font-semibold text-neutral-900">Navigation</h1>
      <p className="mt-1 text-sm text-neutral-500">The links shown in your site&apos;s header menu.</p>

      <div className="mt-6">
        <SectionCard title="Menu items">
          <Repeater
            items={items}
            onChange={(next) => {
              setItems(next);
              setMessage(null);
            }}
            createItem={newNavItem}
            itemLabel={(item) => item.label}
            addLabel="Add menu item"
            emptyLabel="No menu items yet."
            renderItem={(item, update) => (
              <>
                <Field label="Label">
                  <TextInput value={item.label} onChange={(e) => update({ label: e.target.value })} placeholder="About" />
                </Field>
                <Field label="URL" hint="Use #about for an in-page anchor, or a full https:// link.">
                  <TextInput value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="#about" />
                </Field>
                <ToggleField
                  label="Open in new tab"
                  checked={item.openInNewTab}
                  onChange={(v) => update({ openInNewTab: v })}
                />
              </>
            )}
          />
        </SectionCard>
      </div>

      <SaveBar onSave={handleSave} saving={saving} message={message} error={error} />
    </div>
  );
}
