import { Metadata } from "next";
import ProductTagClient from "./ProductTagClient";

type Props = {
  params: {
    slug: string;
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const decodedSlug = decodeURIComponent(slug);
  const tagName = decodedSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return {
    title: {
      absolute: `${tagName}`,
    },
    description: `Browse all products related to ${tagName} at Siraj Tech. Find high-quality items tagged with ${tagName}.`,
    alternates: {
      canonical: `/product-tag/${decodedSlug}`,
    },
    openGraph: {
      title: `${tagName}`,
      description: `Browse all products related to ${tagName} at Siraj Tech.`,
      url: `/product-tag/${decodedSlug}`,
    },
  };
}

export default async function ProductTagPage({ params }: Props) {
  const resolvedParams = await params;
  return <ProductTagClient slug={resolvedParams.slug} />;
}
