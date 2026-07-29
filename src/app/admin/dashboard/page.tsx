import Link from "next/link";

const QUICK_LINKS = [
  { href: "/admin/dashboard/site", label: "Site settings", description: "Title, tagline, logo, favicon, accent color" },
  { href: "/admin/dashboard/sections", label: "Homepage sections", description: "Hero, About, Projects, Skills, Experience, Contact" },
  { href: "/admin/dashboard/navigation", label: "Navigation", description: "Header menu links" },
  { href: "/admin/dashboard/footer", label: "Footer", description: "Footer text and links" },
  { href: "/admin/dashboard/seo", label: "SEO", description: "Search engine title, description, and preview image" },
  { href: "/admin/dashboard/pages", label: "Custom pages", description: "Create additional pages beyond the homepage" },
  { href: "/admin/dashboard/media", label: "Media library", description: "Upload and manage images" },
];

export default function DashboardOverviewPage() {
  return (
    <div>
      <h1 className="text-xl font-semibold text-neutral-900">Welcome back</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Everything on your website is managed from here. Pick a section below to get started.
      </p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {QUICK_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:border-neutral-400 hover:shadow-md"
          >
            <p className="font-medium text-neutral-900">{link.label}</p>
            <p className="mt-1 text-sm text-neutral-500">{link.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
