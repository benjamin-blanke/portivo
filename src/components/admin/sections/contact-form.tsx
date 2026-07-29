"use client";

import { Field, TextInput, TextArea } from "@/components/admin/ui/form";
import { Repeater } from "@/components/admin/ui/repeater";
import type { ContactData, SocialLink } from "@/lib/types";

function newSocial(): SocialLink {
  return { id: crypto.randomUUID(), platform: "", url: "" };
}

export function ContactForm({ data, onChange }: { data: ContactData; onChange: (patch: Partial<ContactData>) => void }) {
  return (
    <>
      <Field label="Heading">
        <TextInput value={data.heading} onChange={(e) => onChange({ heading: e.target.value })} placeholder="Get in touch" />
      </Field>
      <Field label="Intro">
        <TextArea rows={2} value={data.intro} onChange={(e) => onChange({ intro: e.target.value })} />
      </Field>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Email">
          <TextInput type="email" value={data.email} onChange={(e) => onChange({ email: e.target.value })} placeholder="you@example.com" />
        </Field>
        <Field label="Phone">
          <TextInput value={data.phone} onChange={(e) => onChange({ phone: e.target.value })} />
        </Field>
      </div>
      <Field label="Location">
        <TextInput value={data.location} onChange={(e) => onChange({ location: e.target.value })} placeholder="Berlin, Germany" />
      </Field>

      <Repeater
        items={data.socialLinks}
        onChange={(socialLinks) => onChange({ socialLinks })}
        createItem={newSocial}
        itemLabel={(item) => item.platform}
        addLabel="Add social link"
        renderItem={(item, update) => (
          <>
            <Field label="Platform">
              <TextInput value={item.platform} onChange={(e) => update({ platform: e.target.value })} placeholder="LinkedIn" />
            </Field>
            <Field label="URL">
              <TextInput value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://…" />
            </Field>
          </>
        )}
      />
    </>
  );
}
