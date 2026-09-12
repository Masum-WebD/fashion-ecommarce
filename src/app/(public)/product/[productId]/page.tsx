import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { staticProducts } from "@/data/fashion/products";
import ProductDetailClient from "./ProductDetailClient";

export const revalidate = 60;

type Props = { params: Promise<{ productId: string }> };

function findProduct(slug: string) {
  return staticProducts.find((p) => p.slug === slug) ?? null;
}

export async function generateStaticParams() {
  return staticProducts.map((p) => ({ productId: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productId } = await params;
  const product = findProduct(productId);
  if (!product) return { title: "Product Not Found | Velura Fashion" };
  return {
    title: { absolute: `${product.name} | Velura Fashion` },
    description: `Buy ${product.name} at Velura Fashion. Premium fashion at the best prices.`,
    alternates: { canonical: `/product/${product.slug}` },
    openGraph: {
      images: [{ url: product.thumbnail_image, width: 800, height: 800, alt: product.name }],
    },
  };
}

export default async function ProductDetailsPage({ params }: Props) {
  const { productId } = await params;
  const product = findProduct(productId);
  if (!product) notFound();

  return (
    <main id="main-content" className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="bg-stone-50 border-b border-border">
        <div className="container-main py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <ChevronRight size={12} />
            <Link href={`/shop/${product!.category.slug}`} className="hover:text-primary transition-colors capitalize">
              {product!.category.name}
            </Link>
            <ChevronRight size={12} />
            <span className="text-foreground font-medium truncate max-w-[200px]">{product!.name}</span>
          </nav>
        </div>
      </div>

      {/* Product content (client component handles interactivity) */}
      <ProductDetailClient product={product!} />
    </main>
  );
}