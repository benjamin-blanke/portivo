"use client";

import { Field, TextInput, TextArea, ToggleField } from "@/components/admin/ui/form";
import { ImagePicker } from "@/components/admin/ui/image-picker";
import { Repeater } from "@/components/admin/ui/repeater";
import type { ProjectsData, ProjectItem } from "@/lib/types";

function newProject(): ProjectItem {
  return {
    id: crypto.randomUUID(),
    title: "",
    description: "",
    imageUrl: "",
    url: "",
    repoUrl: "",
    tags: [],
    featured: false,
  };
}

export function ProjectsForm({ data, onChange }: { data: ProjectsData; onChange: (patch: Partial<ProjectsData>) => void }) {
  return (
    <>
      <Field label="Heading">
        <TextInput value={data.heading} onChange={(e) => onChange({ heading: e.target.value })} placeholder="Projects" />
      </Field>
      <Field label="Intro" hint="Optional short paragraph under the heading.">
        <TextArea rows={2} value={data.intro} onChange={(e) => onChange({ intro: e.target.value })} />
      </Field>

      <Repeater
        items={data.items}
        onChange={(items) => onChange({ items })}
        createItem={newProject}
        itemLabel={(item) => item.title}
        addLabel="Add project"
        emptyLabel="No projects yet."
        renderItem={(item, update) => (
          <>
            <Field label="Title">
              <TextInput value={item.title} onChange={(e) => update({ title: e.target.value })} />
            </Field>
            <Field label="Description">
              <TextArea rows={3} value={item.description} onChange={(e) => update({ description: e.target.value })} />
            </Field>
            <ImagePicker label="Screenshot" value={item.imageUrl} onChange={(v) => update({ imageUrl: v })} />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Live URL">
                <TextInput value={item.url} onChange={(e) => update({ url: e.target.value })} placeholder="https://…" />
              </Field>
              <Field label="Repository URL">
                <TextInput value={item.repoUrl} onChange={(e) => update({ repoUrl: e.target.value })} placeholder="https://github.com/…" />
              </Field>
            </div>
            <Field label="Tags" hint="Comma separated, e.g. React, TypeScript, Postgres">
              <TextInput
                value={item.tags.join(", ")}
                onChange={(e) =>
                  update({ tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
                }
              />
            </Field>
            <ToggleField label="Featured" checked={item.featured} onChange={(v) => update({ featured: v })} />
          </>
        )}
      />
    </>
  );
}
