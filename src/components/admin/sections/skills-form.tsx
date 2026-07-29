"use client";

import { Field, TextInput, TextArea } from "@/components/admin/ui/form";
import { Repeater } from "@/components/admin/ui/repeater";
import type { SkillsData, SkillItem } from "@/lib/types";

function newSkill(): SkillItem {
  return { id: crypto.randomUUID(), name: "", category: "", level: 3 };
}

export function SkillsForm({ data, onChange }: { data: SkillsData; onChange: (patch: Partial<SkillsData>) => void }) {
  return (
    <>
      <Field label="Heading">
        <TextInput value={data.heading} onChange={(e) => onChange({ heading: e.target.value })} placeholder="Skills" />
      </Field>
      <Field label="Intro">
        <TextArea rows={2} value={data.intro} onChange={(e) => onChange({ intro: e.target.value })} />
      </Field>

      <Repeater
        items={data.items}
        onChange={(items) => onChange({ items })}
        createItem={newSkill}
        itemLabel={(item) => item.name}
        addLabel="Add skill"
        emptyLabel="No skills yet."
        renderItem={(item, update) => (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Name">
                <TextInput value={item.name} onChange={(e) => update({ name: e.target.value })} placeholder="TypeScript" />
              </Field>
              <Field label="Category" hint="Optional grouping, e.g. Frontend">
                <TextInput value={item.category} onChange={(e) => update({ category: e.target.value })} />
              </Field>
            </div>
            <Field label={`Proficiency (${item.level}/5)`}>
              <input
                type="range"
                min={1}
                max={5}
                value={item.level}
                onChange={(e) => update({ level: Number(e.target.value) })}
                className="w-full accent-neutral-900"
              />
            </Field>
          </>
        )}
      />
    </>
  );
}
