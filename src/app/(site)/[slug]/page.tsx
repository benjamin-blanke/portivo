import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/db/pages";
import { getSite } from "@/lib/db/site";
import { PageBlockRenderer } from "@/components/public/page-block-renderer";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  if (!page || !page.published) return {};

  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
  };
}

export default async function CustomPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [page, site] = await Promise.all([getPageBySlug(slug), getSite()]);

  if (!page || !page.published) {
    notFound();
  }

  const visibleBlocks = page.sections.filter((block) => block.visible).sort((a, b) => a.order - b.order);

  return (
    <main>
      <div className="mx-auto max-w-3xl px-6 pt-16">
        <h1 className="text-3xl font-semibold tracking-tight text-white">{page.title}</h1>
      </div>
      {visibleBlocks.map((block) => (
        <PageBlockRenderer key={block.id} block={block} accentColor={site.accentColor} />
      ))}
    </main>
  );
}
