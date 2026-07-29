"use client";

import { Field, TextInput, TextArea, ToggleField } from "@/components/admin/ui/form";
import { Repeater } from "@/components/admin/ui/repeater";
import type { ExperienceData, ExperienceItem } from "@/lib/types";

function newExperience(): ExperienceItem {
  return {
    id: crypto.randomUUID(),
    role: "",
    company: "",
    location: "",
    startDate: "",
    endDate: "",
    current: false,
    description: "",
  };
}

export function ExperienceForm({
  data,
  onChange,
}: {
  data: ExperienceData;
  onChange: (patch: Partial<ExperienceData>) => void;
}) {
  return (
    <>
      <Field label="Heading">
        <TextInput value={data.heading} onChange={(e) => onChange({ heading: e.target.value })} placeholder="Experience" />
      </Field>
      <Field label="Intro">
        <TextArea rows={2} value={data.intro} onChange={(e) => onChange({ intro: e.target.value })} />
      </Field>

      <Repeater
        items={data.items}
        onChange={(items) => onChange({ items })}
        createItem={newExperience}
        itemLabel={(item) => (item.role && item.company ? `${item.role} · ${item.company}` : item.role)}
        addLabel="Add position"
        emptyLabel="No experience yet."
        renderItem={(item, update) => (
          <>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Role">
                <TextInput value={item.role} onChange={(e) => update({ role: e.target.value })} placeholder="Senior Engineer" />
              </Field>
              <Field label="Company">
                <TextInput value={item.company} onChange={(e) => update({ company: e.target.value })} />
              </Field>
            </div>
            <Field label="Location">
              <TextInput value={item.location} onChange={(e) => update({ location: e.target.value })} placeholder="Remote" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Start date">
                <TextInput value={item.startDate} onChange={(e) => update({ startDate: e.target.value })} placeholder="2022" />
              </Field>
              <Field label="End date">
                <TextInput
                  value={item.endDate}
                  onChange={(e) => update({ endDate: e.target.value })}
                  placeholder="Present"
                  disabled={item.current}
                />
              </Field>
            </div>
            <ToggleField label="Current position" checked={item.current} onChange={(v) => update({ current: v })} />
            <Field label="Description">
              <TextArea rows={3} value={item.description} onChange={(e) => update({ description: e.target.value })} />
            </Field>
          </>
        )}
      />
    </>
  );
}
