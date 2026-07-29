import type { SkillsData } from "@/lib/types";

export function SkillsSection({ data, accentColor }: { data: SkillsData; accentColor: string }) {
  if (data.items.length === 0 && !data.heading) return null;

  const groups = new Map<string, typeof data.items>();
  for (const item of data.items) {
    const key = item.category || "Skills";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-20">
      {data.heading ? <h2 className="text-2xl font-semibold tracking-tight text-white">{data.heading}</h2> : null}
      {data.intro ? <p className="mt-3 max-w-2xl text-base text-neutral-400">{data.intro}</p> : null}

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {[...groups.entries()].map(([category, items]) => (
          <div key={category}>
            <h3 className="text-xs font-medium uppercase tracking-wider text-neutral-500">{category}</h3>
            <div className="mt-3 space-y-3">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4">
                  <span className="text-sm text-neutral-200">{item.name}</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <span
                        key={i}
                        className="h-1.5 w-4 rounded-full"
                        style={{ backgroundColor: i < item.level ? accentColor : "rgba(255,255,255,0.1)" }}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
