"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { adminApi } from "@/lib/admin-client";

const NAV_GROUPS: { title: string; items: { href: string; label: string }[] }[] = [
  { title: "", items: [{ href: "/admin/dashboard", label: "Overview" }] },
  {
    title: "General",
    items: [
      { href: "/admin/dashboard/site", label: "Site settings" },
      { href: "/admin/dashboard/navigation", label: "Navigation" },
      { href: "/admin/dashboard/footer", label: "Footer" },
      { href: "/admin/dashboard/seo", label: "SEO" },
    ],
  },
  {
    title: "Homepage",
    items: [{ href: "/admin/dashboard/sections", label: "Sections" }],
  },
  {
    title: "Content",
    items: [
      { href: "/admin/dashboard/pages", label: "Custom pages" },
      { href: "/admin/dashboard/media", label: "Media library" },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await adminApi.post("/api/admin/logout");
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-neutral-800 bg-black">
      <div className="border-b border-neutral-800 px-5 py-5">
        <p className="text-sm font-semibold text-white">Admin panel</p>
        <p className="text-xs text-neutral-500">Manage your website</p>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {NAV_GROUPS.map((group, i) => (
          <div key={i}>
            {group.title ? (
              <p className="mb-1.5 px-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-600">
                {group.title}
              </p>
            ) : null}
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={
                      "block rounded-md px-2.5 py-2 text-sm transition " +
                      (active ? "bg-white text-black font-medium" : "text-neutral-300 hover:bg-neutral-900")
                    }
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-neutral-800 px-3 py-4">
        <Link
          href="/"
          target="_blank"
          className="block rounded-md px-2.5 py-2 text-sm text-neutral-300 hover:bg-neutral-900"
        >
          View website ↗
        </Link>
        <button
          onClick={handleLogout}
          className="w-full rounded-md px-2.5 py-2 text-left text-sm text-neutral-300 hover:bg-neutral-900"
        >
          Log out
        </button>
      </div>
    </aside>
  );
}
