import type { ContactData } from "@/lib/types";

export function ContactSection({ data, accentColor }: { data: ContactData; accentColor: string }) {
  return (
    <section id="contact" className="mx-auto max-w-5xl px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        {data.heading ? <h2 className="text-2xl font-semibold tracking-tight text-white">{data.heading}</h2> : null}
        {data.intro ? <p className="mt-3 text-base text-neutral-400">{data.intro}</p> : null}

        <div className="mt-8 flex flex-col items-center gap-2 text-sm">
          {data.email ? (
            <a href={`mailto:${data.email}`} className="font-medium hover:opacity-80" style={{ color: accentColor }}>
              {data.email}
            </a>
          ) : null}
          {data.phone ? <p className="text-neutral-400">{data.phone}</p> : null}
          {data.location ? <p className="text-neutral-500">{data.location}</p> : null}
        </div>

        {data.socialLinks.length > 0 ? (
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            {data.socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-400 underline underline-offset-4 hover:text-white"
              >
                {social.platform}
              </a>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
