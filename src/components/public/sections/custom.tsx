import type { CustomSectionData } from "@/lib/types";

export function CustomSection({
  title,
  data,
  accentColor,
}: {
  title: string;
  data: CustomSectionData;
  accentColor: string;
}) {
  const paragraphs = data.body.split("\n").map((p) => p.trim()).filter(Boolean);

  return (
    <section className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3">
        {data.imageUrl ? (
          <div className="lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt={title} className="aspect-square w-full rounded-2xl border border-white/10 object-cover" />
          </div>
        ) : null}

        <div className={data.imageUrl ? "lg:col-span-2" : "lg:col-span-3"}>
          {title ? <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2> : null}
          <div className="mt-4 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-neutral-400">
                {p}
              </p>
            ))}
          </div>

          {data.ctaLabel ? (
            <a
              href={data.ctaUrl || "#"}
              className="mt-6 inline-block rounded-lg px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              {data.ctaLabel}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
