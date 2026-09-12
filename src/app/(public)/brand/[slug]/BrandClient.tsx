'use client';

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCardEnhanced from "@/components/home/ProductCardEnhanced";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import AnimatedSection from "@/components/home/AnimatedSection";
import Link from "next/link";
import { fetchProducts, formatProductPrice, formatOriginalPrice } from "@/lib/api/products";
import { useAuth } from "@/providers/AuthProvider";
import { Loader2, PackageOpen, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Brand } from "@/lib/api/brands";

interface BrandClientProps {
  brand: Brand;
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

export default function BrandClient({ brand }: BrandClientProps) {
  const [page, setPage] = useState(1);
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const isWholesaler = user?.role === "wholesaler";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Use the existing fetchProducts which supports brand_id
  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["products-by-brand", brand.id, page],
    queryFn: () => fetchProducts({ brand_id: brand.id, page }),
    staleTime: 2 * 60 * 1000,
  });

  const products = data?.data || [];
  const pagination = data
    ? {
      currentPage: data.current_page,
      lastPage: data.last_page,
    }
    : null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Brand Header Banner */}
      <div className="bg-white rounded-3xl p-6 md:p-10 mb-8 md:mb-12 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 md:gap-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none transform translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none transform -translate-x-1/2 translate-y-1/3" />
        
        <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 shrink-0 bg-gray-50 rounded-2xl flex items-center justify-center p-4 border border-gray-100 shadow-sm">
          {brand.image_url ? (
            <img 
              src={brand.image_url} 
              alt={brand.name} 
              className="w-full h-full object-contain"
            />
          ) : (
            <span className="text-5xl font-bold text-gray-300">
              {brand.name.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        
        <div className="relative z-10 text-center md:text-left flex-1">
          <h1 className="text-2xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            {brand.name}
          </h1>
          <p className="text-gray-500 max-w-2xl text-sm md:text-base">
            Explore the complete range of premium products from {brand.name}. 
            Known for high quality and durability, {brand.name} brings you the best garden materials and geotextiles.
          </p>
        </div>
      </div>

      {/* Products Section */}
      <div className="min-h-[400px] relative">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[8px] md:gap-4 lg:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : isError ? (
          <div className="text-center py-20 text-red-500 bg-red-50 rounded-2xl border border-red-100">
            <p className="font-semibold text-lg">Failed to load products</p>
            <p className="text-sm mt-1 opacity-80">Please check your connection and try again.</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <PackageOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-700">No products found</h3>
            <p className="text-gray-500 mt-2">There are currently no products available for this brand.</p>
          </div>
        ) : (
          <div className="space-y-6">
            <style>{`
              .brand-products-swiper {
                padding: 10px 10px 30px 10px !important;
                margin: -10px -10px -30px -10px !important;
              }
              .swiper-slide-custom {
                width: calc(50% - 10px) !important;
                height: auto !important;
              }
              @media (min-width: 640px) {
                .swiper-slide-custom {
                  width: 220px !important;
                }
              }
              @media (min-width: 768px) {
                .swiper-slide-custom {
                  width: 270px !important;
                }
              }
            `}</style>
            
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 px-2">
              <div className="flex items-start gap-3">
                <span className="w-1.5 h-10 rounded-full bg-gradient-to-b from-primary to-primary-600 shrink-0 self-center" />
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest leading-none">
                      {brand.name}
                    </p>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight">
                    Featured Products
                  </h2>
                </div>
              </div>

              <Link
                href={`/shop?brand_id=${brand.id}`}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white border border-primary/45 hover:bg-primary bg-white px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap self-start sm:self-auto"
              >
                View All <ArrowRight size={13} />
              </Link>
            </div>

            {/* Premium Smooth Swiper Slider */}
            <AnimatedSection className="relative group/slider px-2">
              {/* Custom Navigation */}
              <button className={`brand-swiper-prev absolute left-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg text-[#16a34a] opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[#16a34a] hover:text-white disabled:opacity-0 disabled:hidden -ml-2 md:-ml-4 border border-gray-100`}>
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
              <button className={`brand-swiper-next absolute right-0 top-[40%] -translate-y-1/2 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-lg text-[#16a34a] opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[#16a34a] hover:text-white disabled:opacity-0 disabled:hidden -mr-2 md:-mr-4 border border-gray-100`}>
                <ChevronRight size={20} strokeWidth={2.5} />
              </button>

              {isMounted ? (
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={20}
                  slidesPerView="auto"
                  navigation={{
                    nextEl: `.brand-swiper-next`,
                    prevEl: `.brand-swiper-prev`,
                  }}
                  autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                  loop={products.length > 3}
                  className="brand-products-swiper"
                >
                  {products.slice(0, 20).map((product) => (
                    <SwiperSlide key={product.id} className="swiper-slide-custom">
                      <ProductCardEnhanced
                        image={product.image_url || ''}
                        title={product.name}
                        price={formatProductPrice(product, isWholesaler)}
                        originalPrice={formatOriginalPrice(product, isWholesaler)}
                        badge={product.sale_price ? "সেল" : undefined}
                        productId={product.slug || String(product.id)}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="flex gap-5 overflow-hidden brand-products-swiper opacity-50">
                  {products.slice(0, 4).map((product, i) => (
                    <div key={`skeleton-${i}`} className="swiper-slide-custom shrink-0">
                      <ProductCardEnhanced
                        image={product.image_url || ''}
                        title={product.name}
                        price={formatProductPrice(product, isWholesaler)}
                        originalPrice={formatOriginalPrice(product, isWholesaler)}
                        badge={product.sale_price ? "সেল" : undefined}
                        productId={product.slug || String(product.id)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </AnimatedSection>
          </div>
        )}
      </div>
    </div>
  );
}
