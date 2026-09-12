'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import ProductCardEnhanced from "./ProductCardEnhanced";
import { useAuth } from "@/providers/AuthProvider";
import { Product } from "@/lib/api/products";
import { getImageUrl } from "@/lib/api/images";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";

import { formatProductPrice, formatOriginalPrice } from "@/lib/api/products";

interface ProductsSectionEnhancedProps {
  products?: Product[];
  title?: string;
  subtitle?: string;
  id?: string;
}

const ProductsSectionEnhanced = ({ 
  products,
  title = "Our Popular Products",
  subtitle = "Popular Products",
  id = "popular"
}: ProductsSectionEnhancedProps) => {
  const { user } = useAuth();
  const [isMounted, setIsMounted] = useState(false);
  const isWholesaler = user?.role === "wholesaler";

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!products || products.length === 0) return null;

  const displayProducts = products.map((p) => {
    return {
      image:         getImageUrl(p.thumbnail_image || ''),
      title:         p.name,
      price:         formatProductPrice(p, isWholesaler),
      originalPrice: formatOriginalPrice(p, isWholesaler),
      badge:         p.sale_price ? "সেল" : undefined,
      productId:     p.slug || String(p.id),
      categorySlug:  p.category?.slug,
    };
  });

  const seeAllHref = displayProducts[0]?.categorySlug
    ? `/shop/${displayProducts[0].categorySlug}`
    : "/shop";

  return (
    <section id="products" className="section-padding bg-gradient-to-b from-white to-[#f8fafc] overflow-hidden group">
      <style>{`
        .popular-products-swiper {
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

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div className="flex items-start gap-3">
            <span className="w-1.5 h-10 rounded-full bg-gradient-to-b from-primary to-primary-600 shrink-0 self-center" />
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <p className="text-[11px] font-bold text-primary uppercase tracking-widest leading-none">
                  {subtitle}
                </p>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
                {title}
              </h2>
            </div>
          </div>

          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-white border border-primary/45 hover:bg-primary bg-white px-4 py-2 rounded-full transition-all duration-300 shadow-sm hover:shadow-md whitespace-nowrap self-start sm:self-auto"
          >
            See All <ArrowRight size={13} />
          </Link>
        </div>

        {/* Premium Smooth Swiper Slider */}
        <div className="relative group/slider">
          {/* Custom Navigation */}
          <button className={`${id}-swiper-prev absolute left-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-[#16a34a] opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[#16a34a] hover:text-white disabled:opacity-0 disabled:hidden`}>
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>
          <button className={`${id}-swiper-next absolute right-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-[#16a34a] opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-[#16a34a] hover:text-white disabled:opacity-0 disabled:hidden`}>
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {isMounted ? (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={20}
              slidesPerView="auto"
              navigation={{
                nextEl: `.${id}-swiper-next`,
                prevEl: `.${id}-swiper-prev`,
              }}
              autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
              loop={displayProducts.length > 3}
              className="popular-products-swiper"
            >
              {displayProducts.map((p, i) => (
                <SwiperSlide key={`${p.productId}-${i}`} className="swiper-slide-custom">
                  <ProductCardEnhanced
                    image={p.image}
                    title={p.title}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    badge={p.badge}
                    productId={p.productId}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="flex gap-5 overflow-hidden popular-products-swiper opacity-50">
              {displayProducts.slice(0, 4).map((p, i) => (
                <div key={`skeleton-${i}`} className="swiper-slide-custom shrink-0">
                  <ProductCardEnhanced
                    image={p.image}
                    title={p.title}
                    price={p.price}
                    originalPrice={p.originalPrice}
                    badge={p.badge}
                    productId={p.productId}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </section>
  );
};

export default ProductsSectionEnhanced;
