import type { HeroData } from "@/lib/types";

export function HeroSection({ data, accentColor }: { data: HeroData; accentColor: string }) {
  return (
    <section id="hero" className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-24 sm:py-32 lg:flex-row">
      <div className="flex-1 text-center lg:text-left">
        {data.eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">{data.eyebrow}</p>
        ) : null}
        {data.heading ? (
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white sm:text-5xl">{data.heading}</h1>
        ) : null}
        {data.subheading ? (
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-neutral-400 lg:mx-0">
            {data.subheading}
          </p>
        ) : null}

        {(data.ctaLabel || data.secondaryCtaLabel) && (
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            {data.ctaLabel ? (
              <a
                href={data.ctaUrl || "#"}
                className="rounded-lg px-5 py-2.5 text-sm font-medium text-black transition hover:opacity-90"
                style={{ backgroundColor: accentColor }}
              >
                {data.ctaLabel}
              </a>
            ) : null}
            {data.secondaryCtaLabel ? (
              <a
                href={data.secondaryCtaUrl || "#"}
                className="rounded-lg border border-white/20 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-white/10"
              >
                {data.secondaryCtaLabel}
              </a>
            ) : null}
          </div>
        )}
      </div>

      {data.imageUrl ? (
        <div className="flex-1">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.imageUrl}
            alt={data.heading || "Hero"}
            className="mx-auto aspect-square w-full max-w-sm rounded-2xl border border-white/10 object-cover"
          />
        </div>
      ) : null}
    </section>
  );
}
