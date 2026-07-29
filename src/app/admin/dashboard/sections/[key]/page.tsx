"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-client";
import { Field, TextInput, ToggleField, SaveBar, SectionCard, Button } from "@/components/admin/ui/form";
import { HeroForm } from "@/components/admin/sections/hero-form";
import { AboutForm } from "@/components/admin/sections/about-form";
import { ProjectsForm } from "@/components/admin/sections/projects-form";
import { SkillsForm } from "@/components/admin/sections/skills-form";
import { ExperienceForm } from "@/components/admin/sections/experience-form";
import { ContactForm } from "@/components/admin/sections/contact-form";
import { CustomSectionForm } from "@/components/admin/sections/custom-form";
import {
  emptyHero,
  emptyAbout,
  emptyProjects,
  emptySkills,
  emptyExperience,
  emptyContact,
  emptyCustomSection,
} from "@/lib/types";

interface SectionData {
  key: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
  visible: boolean;
  isFixed: boolean;
}

const TITLES: Record<string, string> = {
  hero: "Hero",
  about: "About",
  projects: "Projects",
  skills: "Skills",
  experience: "Experience",
  contact: "Contact",
};

export default function SectionEditorPage() {
  const params = useParams<{ key: string }>();
  const router = useRouter();
  const key = params.key;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [section, setSection] = useState<SectionData | null>(null);

  useEffect(() => {
    adminApi
      .get<SectionData>(`/api/admin/sections/${key}`)
      .then(setSection)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [key]);

  function updateData(patch: Record<string, unknown>) {
    setSection((prev) => (prev ? { ...prev, data: { ...prev.data, ...patch } } : prev));
    setMessage(null);
  }

  async function handleSave() {
    if (!section) return;
    setSaving(true);
    setError(null);
    setMessage(null);
    try {
      const updated = await adminApi.put<SectionData>(`/api/admin/sections/${key}`, {
        title: section.title,
        visible: section.visible,
        data: section.data,
      });
      setSection(updated);
      setMessage("Saved");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!section || section.isFixed) return;
    if (!confirm(`Delete the "${section.title}" section? This cannot be undone.`)) return;
    try {
      await adminApi.del(`/api/admin/sections/${key}`);
      router.push("/admin/dashboard/sections");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete section");
    }
  }

  if (loading) return <p className="text-sm text-neutral-400">Loading…</p>;
  if (error && !section) return <p className="text-sm text-red-600">{error}</p>;
  if (!section) return null;

  const heading = TITLES[section.type] ?? section.title ?? "Custom section";

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{heading}</h1>
          <p className="mt-1 text-sm text-neutral-500">
            {section.isFixed ? "Edit the content shown in this homepage section." : "Custom homepage section."}
          </p>
        </div>
        {!section.isFixed ? (
          <Button variant="danger" onClick={handleDelete} className="self-start sm:self-auto">
            Delete section
          </Button>
        ) : null}
      </div>

      <div className="mt-6 space-y-6">
        <SectionCard title="Visibility">
          <ToggleField
            label="Show this section on the website"
            checked={section.visible}
            onChange={(visible) => setSection((prev) => (prev ? { ...prev, visible } : prev))}
          />
        </SectionCard>

        {!section.isFixed ? (
          <SectionCard title="Heading">
            <Field label="Section heading" hint="Shown as the title of this section on your website.">
              <TextInput
                value={section.title}
                onChange={(e) => setSection((prev) => (prev ? { ...prev, title: e.target.value } : prev))}
              />
            </Field>
          </SectionCard>
        ) : null}

        <SectionCard title="Content">
          {section.type === "hero" && (
            <HeroForm data={{ ...emptyHero, ...section.data }} onChange={updateData} />
          )}
          {section.type === "about" && (
            <AboutForm data={{ ...emptyAbout, ...section.data }} onChange={updateData} />
          )}
          {section.type === "projects" && (
            <ProjectsForm data={{ ...emptyProjects, ...section.data }} onChange={updateData} />
          )}
          {section.type === "skills" && (
            <SkillsForm data={{ ...emptySkills, ...section.data }} onChange={updateData} />
          )}
          {section.type === "experience" && (
            <ExperienceForm data={{ ...emptyExperience, ...section.data }} onChange={updateData} />
          )}
          {section.type === "contact" && (
            <ContactForm data={{ ...emptyContact, ...section.data }} onChange={updateData} />
          )}
          {section.type === "custom" && (
            <CustomSectionForm data={{ ...emptyCustomSection, ...section.data }} onChange={updateData} />
          )}
        </SectionCard>
      </div>

      <SaveBar onSave={handleSave} saving={saving} message={message} error={error} />
    </div>
  );
}
