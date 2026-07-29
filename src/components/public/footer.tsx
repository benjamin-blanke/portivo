import type { FooterData } from "@/lib/types";

export function Footer({ footer, title }: { footer: FooterData; title: string }) {
  const hasContent = footer.text || footer.links.length > 0 || footer.socialLinks.length > 0 || footer.showYear;
  if (!hasContent) return null;

  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center">
        {footer.text ? <p className="text-sm text-neutral-400">{footer.text}</p> : null}

        {footer.links.length > 0 ? (
          <nav className="flex flex-wrap justify-center gap-4">
            {footer.links.map((link) => (
              <a key={link.id} href={link.url} className="text-sm text-neutral-400 transition hover:text-white">
                {link.label}
              </a>
            ))}
          </nav>
        ) : null}

        {footer.socialLinks.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-4">
            {footer.socialLinks.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-neutral-400 transition hover:text-white"
              >
                {social.platform}
              </a>
            ))}
          </div>
        ) : null}

        {footer.showYear ? (
          <p className="text-xs text-neutral-600">
            © {year} {title}
          </p>
        ) : null}
      </div>
    </footer>
  );
}
