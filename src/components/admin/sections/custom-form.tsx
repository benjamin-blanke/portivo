"use client";

import { Field, TextInput, TextArea } from "@/components/admin/ui/form";
import { ImagePicker } from "@/components/admin/ui/image-picker";
import type { CustomSectionData } from "@/lib/types";

export function CustomSectionForm({
  data,
  onChange,
}: {
  data: CustomSectionData;
  onChange: (patch: Partial<CustomSectionData>) => void;
}) {
  return (
    <>
      <Field label="Body" hint="Plain text, one paragraph per line.">
        <TextArea rows={6} value={data.body} onChange={(e) => onChange({ body: e.target.value })} />
      </Field>
      <ImagePicker label="Image" value={data.imageUrl} onChange={(v) => onChange({ imageUrl: v })} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Button label">
          <TextInput value={data.ctaLabel} onChange={(e) => onChange({ ctaLabel: e.target.value })} />
        </Field>
        <Field label="Button URL">
          <TextInput value={data.ctaUrl} onChange={(e) => onChange({ ctaUrl: e.target.value })} />
        </Field>
      </div>
    </>
  );
}
