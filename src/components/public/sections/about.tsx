import type { AboutData } from "@/lib/types";

export function AboutSection({ data }: { data: AboutData }) {
  const paragraphs = data.body.split("\n").map((p) => p.trim()).filter(Boolean);

  return (
    <section id="about" className="mx-auto max-w-5xl px-6 py-20">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-3">
        {data.imageUrl ? (
          <div className="lg:col-span-1">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={data.imageUrl} alt={data.heading || "About"} className="aspect-square w-full rounded-2xl border border-white/10 object-cover" />
          </div>
        ) : null}

        <div className={data.imageUrl ? "lg:col-span-2" : "lg:col-span-3"}>
          {data.heading ? <h2 className="text-2xl font-semibold tracking-tight text-white">{data.heading}</h2> : null}
          <div className="mt-4 space-y-4">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-neutral-400">
                {p}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
