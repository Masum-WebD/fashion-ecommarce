import { Metadata } from "next";
import { notFound } from "next/navigation";
import { fetchBrandBySlug } from "@/lib/api/brands";
import BrandClient from "./BrandClient";
import { fetchMarketingConfig } from "@/lib/api/marketing";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const brand = await fetchBrandBySlug(resolvedParams.slug);
    const configs = await fetchMarketingConfig();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sirajtech.org";

    const title = `${brand.name} Products - Siraj Tech`;
    const description = `Buy high-quality products from ${brand.name} at Siraj Tech. Explore our premium collection of ${brand.name} garden materials and geotextiles.`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url: `${siteUrl}/brand/${brand.slug}`,
        type: "website",
        images: brand.image_url ? [{ url: brand.image_url, alt: brand.name }] : undefined,
      },
      alternates: {
        canonical: `/brand/${brand.slug}`,
      }
    };
  } catch (error) {
    return {
      title: "Brand Not Found - Siraj Tech",
      description: "The requested brand could not be found.",
    };
  }
}

export default async function BrandPage({ params }: Props) {
  try {
    const resolvedParams = await params;
    const brand = await fetchBrandBySlug(resolvedParams.slug);
    
    return (
      <main className="min-h-screen bg-gray-50/30">
        <BrandClient brand={brand} />
      </main>
    );
  } catch (error) {
    notFound();
  }
}
