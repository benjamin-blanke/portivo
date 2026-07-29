import type { PageSectionBlock } from "@/lib/types";

export function PageBlockRenderer({ block, accentColor }: { block: PageSectionBlock; accentColor: string }) {
  const body = typeof block.data.body === "string" ? block.data.body : "";
  const paragraphs = body.split("\n").map((p) => p.trim()).filter(Boolean);

  return (
    <section className="mx-auto max-w-3xl px-6 py-12">
      {block.title ? <h2 className="text-2xl font-semibold tracking-tight text-white">{block.title}</h2> : null}

      {block.type === "richtext" && (
        <div className="mt-4 space-y-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-neutral-400">
              {p}
            </p>
          ))}
        </div>
      )}

      {block.type === "image" && typeof block.data.imageUrl === "string" && block.data.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={block.data.imageUrl} alt={block.title} className="mt-4 w-full rounded-2xl border border-white/10 object-cover" />
      ) : null}

      {block.type === "cta" && (
        <div className="mt-4">
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-neutral-400">
              {p}
            </p>
          ))}
          {typeof block.data.ctaLabel === "string" && block.data.ctaLabel ? (
            <a
              href={typeof block.data.ctaUrl === "string" ? block.data.ctaUrl : "#"}
              className="mt-6 inline-block rounded-lg px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              {block.data.ctaLabel}
            </a>
          ) : null}
        </div>
      )}
    </section>
  );
}
