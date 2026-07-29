"use client";

import { useState } from "react";
import { MediaLibraryModal } from "./media-library-modal";
import { Button, Field } from "./form";

export function ImagePicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Field label={label}>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-neutral-300 bg-neutral-50">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-[10px] text-neutral-400">No image</span>
          )}
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => setOpen(true)}>
            Choose image
          </Button>
          {value ? (
            <Button type="button" variant="ghost" onClick={() => onChange("")}>
              Remove
            </Button>
          ) : null}
        </div>
      </div>

      {open ? (
        <MediaLibraryModal
          onSelect={(dataUrl) => {
            onChange(dataUrl);
            setOpen(false);
          }}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </Field>
  );
}
