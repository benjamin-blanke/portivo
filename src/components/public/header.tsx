"use client";

import { useState } from "react";
import Link from "next/link";
import type { NavItem } from "@/lib/types";

export function Header({ title, logoUrl, navigation }: { title: string; logoUrl: string; navigation: NavItem[] }) {
  const [open, setOpen] = useState(false);

  if (!title && !logoUrl && navigation.length === 0) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-tight text-white">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={title} className="h-7 w-7 rounded object-cover" />
          ) : null}
          {title ? <span>{title}</span> : null}
        </Link>

        {navigation.length > 0 ? (
          <>
            <nav className="hidden items-center gap-6 sm:flex">
              {navigation.map((item) => (
                <a
                  key={item.id}
                  href={item.url}
                  target={item.openInNewTab ? "_blank" : undefined}
                  rel={item.openInNewTab ? "noopener noreferrer" : undefined}
                  className="text-sm text-neutral-300 transition hover:text-white"
                >
                  {item.label}
                </a>
              ))}
            </nav>

            <button
              onClick={() => setOpen((v) => !v)}
              className="text-neutral-300 sm:hidden"
              aria-label="Toggle menu"
            >
              {open ? "✕" : "☰"}
            </button>
          </>
        ) : null}
      </div>

      {open && navigation.length > 0 ? (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-6 py-3 sm:hidden">
          {navigation.map((item) => (
            <a
              key={item.id}
              href={item.url}
              target={item.openInNewTab ? "_blank" : undefined}
              rel={item.openInNewTab ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="py-1.5 text-sm text-neutral-300 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}
