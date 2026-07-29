export interface NavItem {
  id: string;
  label: string;
  url: string;
  openInNewTab: boolean;
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface FooterData {
  text: string;
  showYear: boolean;
  links: FooterLink[];
  socialLinks: SocialLink[];
}

export const emptyFooter: FooterData = {
  text: "",
  showYear: true,
  links: [],
  socialLinks: [],
};

export interface HeroData {
  eyebrow: string;
  heading: string;
  subheading: string;
  ctaLabel: string;
  ctaUrl: string;
  secondaryCtaLabel: string;
  secondaryCtaUrl: string;
  imageUrl: string;
}

export const emptyHero: HeroData = {
  eyebrow: "",
  heading: "",
  subheading: "",
  ctaLabel: "",
  ctaUrl: "",
  secondaryCtaLabel: "",
  secondaryCtaUrl: "",
  imageUrl: "",
};

export interface AboutData {
  heading: string;
  body: string;
  imageUrl: string;
}

export const emptyAbout: AboutData = {
  heading: "",
  body: "",
  imageUrl: "",
};

export interface ProjectItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  url: string;
  repoUrl: string;
  tags: string[];
  featured: boolean;
}

export interface ProjectsData {
  heading: string;
  intro: string;
  items: ProjectItem[];
}

export const emptyProjects: ProjectsData = {
  heading: "",
  intro: "",
  items: [],
};

export interface SkillItem {
  id: string;
  name: string;
  category: string;
  level: number;
}

export interface SkillsData {
  heading: string;
  intro: string;
  items: SkillItem[];
}

export const emptySkills: SkillsData = {
  heading: "",
  intro: "",
  items: [],
};

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface ExperienceData {
  heading: string;
  intro: string;
  items: ExperienceItem[];
}

export const emptyExperience: ExperienceData = {
  heading: "",
  intro: "",
  items: [],
};

export interface ContactData {
  heading: string;
  intro: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: SocialLink[];
}

export const emptyContact: ContactData = {
  heading: "",
  intro: "",
  email: "",
  phone: "",
  location: "",
  socialLinks: [],
};

export interface CustomSectionData {
  body: string;
  imageUrl: string;
  ctaLabel: string;
  ctaUrl: string;
}

export const emptyCustomSection: CustomSectionData = {
  body: "",
  imageUrl: "",
  ctaLabel: "",
  ctaUrl: "",
};

export interface PageSectionBlock {
  id: string;
  type: "richtext" | "image" | "cta";
  title: string;
  data: Record<string, unknown>;
  order: number;
  visible: boolean;
}
