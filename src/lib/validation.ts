import { z } from "zod";

const url = z.string().trim().max(2000).default("");
const shortText = z.string().trim().max(200).default("");
const longText = z.string().trim().max(20000).default("");

export const navItemSchema = z.object({
  id: z.string().min(1),
  label: shortText,
  url: url,
  openInNewTab: z.boolean().default(false),
});

export const footerLinkSchema = z.object({
  id: z.string().min(1),
  label: shortText,
  url: url,
});

export const socialLinkSchema = z.object({
  id: z.string().min(1),
  platform: shortText,
  url: url,
});

export const footerDataSchema = z.object({
  text: longText,
  showYear: z.boolean().default(true),
  links: z.array(footerLinkSchema).max(50).default([]),
  socialLinks: z.array(socialLinkSchema).max(50).default([]),
});

export const siteUpdateSchema = z.object({
  title: shortText.optional(),
  tagline: shortText.optional(),
  logoUrl: url.optional(),
  faviconUrl: url.optional(),
  accentColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{3,8}$/)
    .optional(),
  seoTitle: shortText.optional(),
  seoDescription: longText.optional(),
  seoImageUrl: url.optional(),
  navigation: z.array(navItemSchema).max(50).optional(),
  footer: footerDataSchema.optional(),
});

export const sectionUpdateSchema = z.object({
  title: shortText.optional(),
  visible: z.boolean().optional(),
  order: z.number().int().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const createCustomSectionSchema = z.object({
  title: shortText,
  data: z.record(z.string(), z.unknown()).optional(),
});

export const reorderSectionsSchema = z.object({
  order: z
    .array(
      z.object({
        key: z.string().min(1),
        order: z.number().int(),
      })
    )
    .min(1),
});

const slugSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only");

const pageSectionBlockSchema = z.object({
  id: z.string().min(1),
  type: z.enum(["richtext", "image", "cta"]),
  title: shortText,
  data: z.record(z.string(), z.unknown()).default({}),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const pageCreateSchema = z.object({
  slug: slugSchema,
  title: shortText.pipe(z.string().min(1, "Title is required")),
  seoTitle: shortText.optional(),
  seoDescription: longText.optional(),
  published: z.boolean().default(false),
  sections: z.array(pageSectionBlockSchema).max(100).default([]),
});

export const pageUpdateSchema = pageCreateSchema.partial();

export const mediaUploadSchema = z.object({
  filename: z.string().trim().min(1).max(255),
  mimeType: z
    .string()
    .trim()
    .regex(/^image\/(png|jpeg|jpg|webp|gif|svg\+xml)$/, "Unsupported image type"),
  dataUrl: z.string().min(1),
  alt: shortText.optional(),
});

export const loginSchema = z.object({
  password: z.string().min(1).max(500),
});
