import { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { staticProducts, FashionProduct } from "@/data/fashion/products";
import { staticCategories } from "@/data/fashion/categories";
import FashionProductCard from "@/components/home/FashionProductCard";

export const revalidate = 60;

type Props = { params: Promise<{ categorySlug?: string | string[] }> };

function resolveSlug(slugArray: string | string[] | undefined): string {
  if (!slugArray) return "";
  return Array.isArray(slugArray) ? slugArray[slugArray.length - 1] : slugArray;
}

function getCategoryLabel(slug: string): string {
  const cat = staticCategories.find((c) => c.slug === slug);
  return cat?.name ?? (slug ? slug.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()) : "All Products");
}

function filterProducts(slug: string): FashionProduct[] {
  if (!slug || slug === "all") return staticProducts;
  if (slug === "new-arrivals") return staticProducts.filter((p) => p.is_new_arrival);
  if (slug === "sale") return staticProducts.filter((p) => p.sale_price !== null);
  return staticProducts.filter((p) => p.category.slug === slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = resolveSlug((await params).categorySlug);
  const label = getCategoryLabel(slug);
  return {
    title: { absolute: `${label} | Velura Fashion` },
    description: `Shop ${label} at Velura Fashion. Premium quality at the best prices.`,
    alternates: { canonical: slug ? `/shop/${slug}` : "/shop" },
  };
}

export default async function ShopCategoryPage({ params }: Props) {
  const slug = resolveSlug((await params).categorySlug);
  const categoryLabel = getCategoryLabel(slug);
  const products = filterProducts(slug);

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Shop", href: "/shop" },
    ...(slug ? [{ label: categoryLabel, href: `/shop/${slug}` }] : []),
  ];

  return (
    <main id="main-content" className="min-h-screen bg-background">
      <div className="bg-stone-50 border-b border-border">
        <div className="container-main py-3">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground">
            {breadcrumbs.map((crumb, i) => (
              <span key={crumb.href} className="flex items-center gap-1.5">
                {i > 0 && <ChevronRight size={12} />}
                {i < breadcrumbs.length - 1 ? (
                  <Link href={crumb.href} className="hover:text-primary transition-colors">{crumb.label}</Link>
                ) : (
                  <span className="text-foreground font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        </div>
      </div>

      <div className="container-main py-8 md:py-12">
        <div className="flex items-end justify-between mb-8 gap-4">
          <div>
            <p className="section-label mb-1">Collection</p>
            <h1 className="text-heading-1 text-foreground">{categoryLabel}</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {products.length} {products.length === 1 ? "style" : "styles"} available
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { label: "All", slug: "" },
            { label: "New Arrivals", slug: "new-arrivals" },
            { label: "Women",        slug: "women"        },
            { label: "Men",          slug: "men"          },
            { label: "Kids",         slug: "kids"         },
            { label: "Accessories",  slug: "accessories"  },
            { label: "Sale",         slug: "sale"         },
          ].map((chip) => {
            const isActive = slug === chip.slug;
            return (
              <Link
                key={chip.slug}
                href={chip.slug ? `/shop/${chip.slug}` : "/shop"}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-sm"
                    : "bg-white text-foreground border-border hover:border-primary hover:text-primary"
                }`}
              >
                {chip.label}
              </Link>
            );
          })}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-3">🛍️</p>
            <h2 className="text-xl font-bold text-foreground mb-2">No products found</h2>
            <p className="text-muted-foreground text-sm mb-6">No products in this category yet.</p>
            <Link href="/shop" className="btn-primary">Browse All Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
            {products.map((product) => (
              <FashionProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}