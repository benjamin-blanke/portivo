import { getSite } from "@/lib/db/site";
import { getVisibleSections } from "@/lib/db/sections";
import { SectionRenderer } from "@/components/public/section-renderer";

export default async function HomePage() {
  const [site, sections] = await Promise.all([getSite(), getVisibleSections()]);

  return (
    <main>
      {sections.map((section) => (
        <SectionRenderer key={section.key} section={section} accentColor={site.accentColor} />
      ))}
    </main>
  );
}
