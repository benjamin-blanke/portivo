import type { SectionView } from "@/lib/db/sections";
import {
  emptyHero,
  emptyAbout,
  emptyProjects,
  emptySkills,
  emptyExperience,
  emptyContact,
  emptyCustomSection,
} from "@/lib/types";
import { HeroSection } from "@/components/public/sections/hero";
import { AboutSection } from "@/components/public/sections/about";
import { ProjectsSection } from "@/components/public/sections/projects";
import { SkillsSection } from "@/components/public/sections/skills";
import { ExperienceSection } from "@/components/public/sections/experience";
import { ContactSection } from "@/components/public/sections/contact";
import { CustomSection } from "@/components/public/sections/custom";

export function SectionRenderer({ section, accentColor }: { section: SectionView; accentColor: string }) {
  switch (section.type) {
    case "hero":
      return <HeroSection data={{ ...emptyHero, ...section.data }} accentColor={accentColor} />;
    case "about":
      return <AboutSection data={{ ...emptyAbout, ...section.data }} />;
    case "projects":
      return <ProjectsSection data={{ ...emptyProjects, ...section.data }} accentColor={accentColor} />;
    case "skills":
      return <SkillsSection data={{ ...emptySkills, ...section.data }} accentColor={accentColor} />;
    case "experience":
      return <ExperienceSection data={{ ...emptyExperience, ...section.data }} />;
    case "contact":
      return <ContactSection data={{ ...emptyContact, ...section.data }} accentColor={accentColor} />;
    case "custom":
      return (
        <CustomSection title={section.title} data={{ ...emptyCustomSection, ...section.data }} accentColor={accentColor} />
      );
    default:
      return null;
  }
}
