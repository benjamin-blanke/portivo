import type { ProjectsData } from "@/lib/types";

export function ProjectsSection({ data, accentColor }: { data: ProjectsData; accentColor: string }) {
  if (data.items.length === 0 && !data.heading) return null;

  return (
    <section id="projects" className="mx-auto max-w-5xl px-6 py-20">
      {data.heading ? <h2 className="text-2xl font-semibold tracking-tight text-white">{data.heading}</h2> : null}
      {data.intro ? <p className="mt-3 max-w-2xl text-base text-neutral-400">{data.intro}</p> : null}

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2">
        {data.items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col overflow-hidden rounded-2xl border border-white/10 transition hover:border-white/30"
          >
            {item.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={item.imageUrl} alt={item.title} className="aspect-video w-full object-cover" />
            ) : null}
            <div className="flex flex-1 flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-white">{item.title}</h3>
                {item.featured ? (
                  <span
                    className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium text-black"
                    style={{ backgroundColor: accentColor }}
                  >
                    Featured
                  </span>
                ) : null}
              </div>
              {item.description ? <p className="mt-2 text-sm leading-relaxed text-neutral-400">{item.description}</p> : null}

              {item.tags.length > 0 ? (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {item.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] text-neutral-400">
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}

              {(item.url || item.repoUrl) && (
                <div className="mt-4 flex gap-4 text-sm">
                  {item.url ? (
                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-white underline underline-offset-4 hover:text-neutral-300">
                      Visit
                    </a>
                  ) : null}
                  {item.repoUrl ? (
                    <a href={item.repoUrl} target="_blank" rel="noopener noreferrer" className="text-neutral-400 underline underline-offset-4 hover:text-neutral-300">
                      Source
                    </a>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
