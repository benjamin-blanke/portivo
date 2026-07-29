"use client";

import { Field, TextInput, TextArea } from "@/components/admin/ui/form";
import { ImagePicker } from "@/components/admin/ui/image-picker";
import type { AboutData } from "@/lib/types";

export function AboutForm({ data, onChange }: { data: AboutData; onChange: (patch: Partial<AboutData>) => void }) {
  return (
    <>
      <Field label="Heading">
        <TextInput value={data.heading} onChange={(e) => onChange({ heading: e.target.value })} placeholder="About me" />
      </Field>
      <Field label="Body" hint="A few paragraphs about you. Plain text, one paragraph per line.">
        <TextArea rows={8} value={data.body} onChange={(e) => onChange({ body: e.target.value })} />
      </Field>
      <ImagePicker label="Photo" value={data.imageUrl} onChange={(v) => onChange({ imageUrl: v })} />
    </>
  );
}
