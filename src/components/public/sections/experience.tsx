import type { ExperienceData } from "@/lib/types";

export function ExperienceSection({ data }: { data: ExperienceData }) {
  if (data.items.length === 0 && !data.heading) return null;

  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-20">
      {data.heading ? <h2 className="text-2xl font-semibold tracking-tight text-white">{data.heading}</h2> : null}
      {data.intro ? <p className="mt-3 max-w-2xl text-base text-neutral-400">{data.intro}</p> : null}

      <div className="mt-10 space-y-8 border-l border-white/10 pl-6">
        {data.items.map((item) => (
          <div key={item.id} className="relative">
            <span className="absolute -left-[27px] top-1.5 h-2.5 w-2.5 rounded-full bg-white" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-medium text-white">
                {item.role}
                {item.company ? <span className="text-neutral-400"> · {item.company}</span> : null}
              </h3>
              <span className="text-xs text-neutral-500">
                {item.startDate} — {item.current ? "Present" : item.endDate}
              </span>
            </div>
            {item.location ? <p className="mt-0.5 text-xs text-neutral-500">{item.location}</p> : null}
            {item.description ? <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.description}</p> : null}
          </div>
        ))}
      </div>
    </section>
  );
}
