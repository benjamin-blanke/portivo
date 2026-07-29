export const SITE_SINGLETON_ID = "singleton";
export const PAYMENT_SINGLETON_ID = "singleton";

export type FixedSectionKey =
  | "hero"
  | "about"
  | "projects"
  | "skills"
  | "experience"
  | "contact";

export const FIXED_SECTIONS: { key: FixedSectionKey; title: string; order: number }[] = [
  { key: "hero", title: "Hero", order: 0 },
  { key: "about", title: "About", order: 1 },
  { key: "projects", title: "Projects", order: 2 },
  { key: "skills", title: "Skills", order: 3 },
  { key: "experience", title: "Experience", order: 4 },
  { key: "contact", title: "Contact", order: 5 },
];

export const FIXED_SECTION_KEYS = FIXED_SECTIONS.map((s) => s.key);

/** Slugs that would collide with built-in app routes. */
export const RESERVED_PAGE_SLUGS = new Set(["admin", "api", "_next", "favicon.ico"]);
