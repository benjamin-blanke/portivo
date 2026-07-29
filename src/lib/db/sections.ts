import { prisma } from "@/lib/prisma";
import { FIXED_SECTIONS, FIXED_SECTION_KEYS } from "@/lib/constants";
import type { Section, Prisma } from "@prisma/client";

export interface SectionView {
  id: string;
  key: string;
  type: string;
  title: string;
  data: Record<string, unknown>;
  order: number;
  visible: boolean;
  isFixed: boolean;
}

function toView(section: Section): SectionView {
  return {
    id: section.id,
    key: section.key,
    type: section.type,
    title: section.title,
    data: (section.data as Record<string, unknown>) ?? {},
    order: section.order,
    visible: section.visible,
    isFixed: (FIXED_SECTION_KEYS as readonly string[]).includes(section.key),
  };
}

/** Creates the fixed section rows (hero/about/…) the first time they're needed. */
async function ensureDefaultSections(): Promise<void> {
  await Promise.all(
    FIXED_SECTIONS.map((s) =>
      prisma.section.upsert({
        where: { key: s.key },
        update: {},
        create: {
          key: s.key,
          type: s.key,
          title: s.title,
          order: s.order,
          visible: false,
          data: {},
        },
      })
    )
  );
}

/** All sections (fixed + custom), for the admin panel. */
export async function getAllSections(): Promise<SectionView[]> {
  await ensureDefaultSections();
  const sections = await prisma.section.findMany({ orderBy: { order: "asc" } });
  return sections.map(toView);
}

/** Only visible sections, for public rendering. */
export async function getVisibleSections(): Promise<SectionView[]> {
  const sections = await prisma.section.findMany({
    where: { visible: true },
    orderBy: { order: "asc" },
  });
  return sections.map(toView);
}

export async function getSectionByKey(key: string): Promise<SectionView | null> {
  const section = await prisma.section.findUnique({ where: { key } });
  return section ? toView(section) : null;
}

export interface SectionPatch {
  title?: string;
  data?: Record<string, unknown>;
  visible?: boolean;
  order?: number;
}

export async function updateSection(key: string, patch: SectionPatch): Promise<SectionView> {
  const data: Prisma.SectionUpdateInput = {};
  if (patch.title !== undefined) data.title = patch.title;
  if (patch.data !== undefined) data.data = patch.data as Prisma.InputJsonValue;
  if (patch.visible !== undefined) data.visible = patch.visible;
  if (patch.order !== undefined) data.order = patch.order;

  const section = await prisma.section.update({ where: { key }, data });
  return toView(section);
}

export async function createCustomSection(input: {
  title: string;
  data?: Record<string, unknown>;
}): Promise<SectionView> {
  const count = await prisma.section.count();
  const key = `custom-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  const section = await prisma.section.create({
    data: {
      key,
      type: "custom",
      title: input.title,
      data: (input.data ?? {}) as Prisma.InputJsonValue,
      order: count,
      visible: false,
    },
  });
  return toView(section);
}

export async function deleteCustomSection(key: string): Promise<void> {
  if ((FIXED_SECTION_KEYS as readonly string[]).includes(key)) {
    throw new Error("Fixed sections cannot be deleted, only hidden.");
  }
  await prisma.section.delete({ where: { key } });
}

export async function reorderSections(order: { key: string; order: number }[]): Promise<void> {
  await prisma.$transaction(
    order.map((o) => prisma.section.update({ where: { key: o.key }, data: { order: o.order } }))
  );
}
