'use client';

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCardEnhanced from "@/components/home/ProductCardEnhanced";
import Pagination from "@/components/shop/Pagination";
import AnimatedSection from "@/components/home/AnimatedSection";
import { fetchProductsByTag, formatProductPrice, formatOriginalPrice } from "@/lib/api/products";
import { useAuth } from "@/providers/AuthProvider";
import { Loader2, PackageOpen, RefreshCw, ArrowRight } from "lucide-react";
import Link from "next/link";

interface ProductTagClientProps {
  slug: string;
}

const ProductSkeleton = () => (
  <div className="bg-white rounded-t-xl rounded-b-none overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-border/60 flex flex-col h-full">
    <div className="relative w-full aspect-[4/3] bg-[#f8fafc] border-b border-border/30">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
    </div>
    <div className="p-2 md:p-4 flex flex-col flex-grow bg-white gap-1 md:gap-2">
      <div className="h-3 md:h-4 w-full bg-gray-200 animate-pulse rounded mt-1"></div>
      <div className="h-3 md:h-4 w-2/3 bg-gray-200 animate-pulse rounded mb-1 md:mb-2"></div>
      <div className="mt-auto pt-1 md:pt-2 flex flex-col gap-2.5">
        <div className="h-4 md:h-5 w-1/3 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-full h-[34px] md:h-[42px] bg-gray-200 animate-pulse rounded-md mt-1"></div>
      </div>
    </div>
  </div>
);

export default function ProductTagClient({ slug }: ProductTagClientProps) {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const isWholesaler = user?.role === "wholesaler";

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["products-by-tag", slug, page],
    queryFn: () => fetchProductsByTag(slug, page),
    staleTime: 2 * 60 * 1000,
  });

  const products = data?.data || [];
  const pagination = data
    ? {
      currentPage: data.current_page,
      lastPage: data.last_page,
    }
    : null;

  const decodedSlug = useMemo(() => {
    try {
      return decodeURIComponent(slug);
    } catch (e) {
      return slug;
    }
  }, [slug]);

  const tagName = decodedSlug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

  return (
    <main className="flex-grow bg-gradient-to-b from-section-alt/40 via-background to-background">
      <div className="bg-slate-100 py-3 md:py-4">
        <div className="container-main">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <span className="text-muted-foreground uppercase">Tag</span>
            <span className="text-muted-foreground">/</span>
            <span className="text-foreground font-medium truncate max-w-[300px]">
              {tagName}
            </span>
          </div>
        </div>
      </div>

      <div className="container-main px-3 py-4 sm:px-4 sm:py-10 md:px-6 md:py-12 min-h-[50vh]">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-2">
            Products tagged with "{tagName}"
          </h1>
          {data && (
            <p className="text-slate-600 text-sm md:text-base">
              Showing {data.from || 0} - {data.to || 0} of {data.total} results
            </p>
          )}
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <AnimatedSection>
            <div className="mx-auto max-w-md rounded-2xl border border-destructive/20 bg-white p-8 text-center shadow-card">
              <p className="mb-4 text-muted-foreground">
                Could not load products. Please try again.
              </p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary/90 disabled:opacity-60"
              >
                {isFetching ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <RefreshCw size={16} />
                )}
                Retry
              </button>
            </div>
          </AnimatedSection>
        ) : products.length > 0 ? (
          <AnimatedSection>
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-5 mb-10">
              {products.map((product) => (
                <ProductCardEnhanced
                  key={product.id}
                  image={product.thumbnail_image || ""}
                  title={product.name}
                  price={formatProductPrice(product, isWholesaler)}
                  originalPrice={formatOriginalPrice(product, isWholesaler)}
                  badge={product.sale_price ? "Sale" : undefined}
                  productId={product.slug}
                />
              ))}
            </div>

            {pagination && pagination.lastPage > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={pagination.currentPage}
                  lastPage={pagination.lastPage}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>

              <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 tracking-tight">Oops! Nothing Found</h3>
              <p className="text-slate-500 max-w-md text-base md:text-lg mb-8 leading-relaxed">
                We couldn't find any products associated with the <span className="font-semibold text-primary">"{tagName}"</span> tag right now.
              </p>

              <Link
                href="/shop"
                className="group relative inline-flex items-center gap-2 justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-primary border border-transparent rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                View All Products
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>
        )}
      </div>
    </main>
  );
}
