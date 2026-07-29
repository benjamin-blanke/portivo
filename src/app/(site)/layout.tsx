import type { Metadata } from "next";
import { getSite } from "@/lib/db/site";
import { isSitePaid } from "@/lib/db/payment";
import { Header } from "@/components/public/header";
import { Footer } from "@/components/public/footer";
import { DisabledPage } from "@/components/public/disabled-page";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const paid = await isSitePaid();
  if (!paid) {
    return { title: "Website unavailable", robots: { index: false, follow: false } };
  }

  const site = await getSite();
  const title = site.seoTitle || site.title || "Portfolio";
  const description = site.seoDescription || undefined;

  return {
    title,
    description,
    icons: site.faviconUrl ? { icon: site.faviconUrl } : undefined,
    openGraph: {
      title,
      description,
      images: site.seoImageUrl ? [site.seoImageUrl] : undefined,
    },
  };
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const paid = await isSitePaid();
  if (!paid) {
    return <DisabledPage />;
  }

  const site = await getSite();

  return (
    <>
      <Header title={site.title} logoUrl={site.logoUrl} navigation={site.navigation} />
      {children}
      <Footer footer={site.footer} title={site.title} />
    </>
  );
}
