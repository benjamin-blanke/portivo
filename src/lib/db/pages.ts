import { prisma } from "@/lib/prisma";
import type { Page, Prisma } from "@prisma/client";
import type { PageSectionBlock } from "@/lib/types";

export interface PageView {
  id: string;
  slug: string;
  title: string;
  seoTitle: string;
  seoDescription: string;
  published: boolean;
  sections: PageSectionBlock[];
  createdAt: Date;
  updatedAt: Date;
}

function toView(page: Page): PageView {
  return {
    id: page.id,
    slug: page.slug,
    title: page.title,
    seoTitle: page.seoTitle ?? "",
    seoDescription: page.seoDescription ?? "",
    published: page.published,
    sections: Array.isArray(page.sections) ? (page.sections as unknown as PageSectionBlock[]) : [],
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
}

export async function listPages(): Promise<PageView[]> {
  const pages = await prisma.page.findMany({ orderBy: { createdAt: "asc" } });
  return pages.map(toView);
}

export async function getPageBySlug(slug: string): Promise<PageView | null> {
  const page = await prisma.page.findUnique({ where: { slug } });
  return page ? toView(page) : null;
}

export async function getPageById(id: string): Promise<PageView | null> {
  const page = await prisma.page.findUnique({ where: { id } });
  return page ? toView(page) : null;
}

export interface PageInput {
  slug: string;
  title: string;
  seoTitle?: string;
  seoDescription?: string;
  published?: boolean;
  sections?: PageSectionBlock[];
}

export async function createPage(input: PageInput): Promise<PageView> {
  const page = await prisma.page.create({
    data: {
      slug: input.slug,
      title: input.title,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      published: input.published ?? false,
      sections: (input.sections ?? []) as unknown as Prisma.InputJsonValue,
    },
  });
  return toView(page);
}

export async function updatePage(id: string, input: Partial<PageInput>): Promise<PageView> {
  const data: Prisma.PageUpdateInput = {};
  if (input.slug !== undefined) data.slug = input.slug;
  if (input.title !== undefined) data.title = input.title;
  if (input.seoTitle !== undefined) data.seoTitle = input.seoTitle;
  if (input.seoDescription !== undefined) data.seoDescription = input.seoDescription;
  if (input.published !== undefined) data.published = input.published;
  if (input.sections !== undefined) data.sections = input.sections as unknown as Prisma.InputJsonValue;

  const page = await prisma.page.update({ where: { id }, data });
  return toView(page);
}

export async function deletePage(id: string): Promise<void> {
  await prisma.page.delete({ where: { id } });
}
