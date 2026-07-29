"use client";

import { Field, TextInput, TextArea } from "@/components/admin/ui/form";
import { ImagePicker } from "@/components/admin/ui/image-picker";
import type { HeroData } from "@/lib/types";

export function HeroForm({ data, onChange }: { data: HeroData; onChange: (patch: Partial<HeroData>) => void }) {
  return (
    <>
      <Field label="Eyebrow" hint="Small label above the heading, e.g. 'Available for work'.">
        <TextInput value={data.eyebrow} onChange={(e) => onChange({ eyebrow: e.target.value })} />
      </Field>
      <Field label="Heading">
        <TextInput value={data.heading} onChange={(e) => onChange({ heading: e.target.value })} placeholder="Hi, I'm Jane." />
      </Field>
      <Field label="Subheading">
        <TextArea rows={3} value={data.subheading} onChange={(e) => onChange({ subheading: e.target.value })} />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Primary button label">
          <TextInput value={data.ctaLabel} onChange={(e) => onChange({ ctaLabel: e.target.value })} placeholder="View my work" />
        </Field>
        <Field label="Primary button URL">
          <TextInput value={data.ctaUrl} onChange={(e) => onChange({ ctaUrl: e.target.value })} placeholder="#projects" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Secondary button label">
          <TextInput value={data.secondaryCtaLabel} onChange={(e) => onChange({ secondaryCtaLabel: e.target.value })} placeholder="Contact me" />
        </Field>
        <Field label="Secondary button URL">
          <TextInput value={data.secondaryCtaUrl} onChange={(e) => onChange({ secondaryCtaUrl: e.target.value })} placeholder="#contact" />
        </Field>
      </div>
      <ImagePicker label="Portrait / hero image" value={data.imageUrl} onChange={(v) => onChange({ imageUrl: v })} />
    </>
  );
}
