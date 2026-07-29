import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { SITE_SINGLETON_ID } from "@/lib/constants";
import type { NavItem, FooterData } from "@/lib/types";
import { emptyFooter } from "@/lib/types";
import type { Prisma } from "@prisma/client";

export interface SiteView {
  id: string;
  title: string;
  tagline: string;
  logoUrl: string;
  faviconUrl: string;
  accentColor: string;
  seoTitle: string;
  seoDescription: string;
  seoImageUrl: string;
  navigation: NavItem[];
  footer: FooterData;
  updatedAt: Date;
}

export const getSite = cache(async function getSite(): Promise<SiteView> {
  const site = await prisma.site.upsert({
    where: { id: SITE_SINGLETON_ID },
    update: {},
    create: { id: SITE_SINGLETON_ID },
  });

  return {
    id: site.id,
    title: site.title,
    tagline: site.tagline,
    logoUrl: site.logoUrl ?? "",
    faviconUrl: site.faviconUrl ?? "",
    accentColor: site.accentColor,
    seoTitle: site.seoTitle ?? "",
    seoDescription: site.seoDescription ?? "",
    seoImageUrl: site.seoImageUrl ?? "",
    navigation: Array.isArray(site.navigation) ? (site.navigation as unknown as NavItem[]) : [],
    footer: (site.footer && typeof site.footer === "object"
      ? { ...emptyFooter, ...(site.footer as object) }
      : emptyFooter) as FooterData,
    updatedAt: site.updatedAt,
  };
});

export interface SiteUpdateInput {
  title?: string;
  tagline?: string;
  logoUrl?: string;
  faviconUrl?: string;
  accentColor?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoImageUrl?: string;
  navigation?: NavItem[];
  footer?: FooterData;
}

export async function updateSite(input: SiteUpdateInput): Promise<SiteView> {
  const data: Record<string, unknown> = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.tagline !== undefined) data.tagline = input.tagline;
  if (input.logoUrl !== undefined) data.logoUrl = input.logoUrl;
  if (input.faviconUrl !== undefined) data.faviconUrl = input.faviconUrl;
  if (input.accentColor !== undefined) data.accentColor = input.accentColor;
  if (input.seoTitle !== undefined) data.seoTitle = input.seoTitle;
  if (input.seoDescription !== undefined) data.seoDescription = input.seoDescription;
  if (input.seoImageUrl !== undefined) data.seoImageUrl = input.seoImageUrl;
  if (input.navigation) data.navigation = input.navigation;
  if (input.footer) data.footer = input.footer;

  await prisma.site.upsert({
    where: { id: SITE_SINGLETON_ID },
    update: data as Prisma.SiteUpdateInput,
    create: { id: SITE_SINGLETON_ID, ...data } as Prisma.SiteCreateInput,
  });

  return getSite();
}
