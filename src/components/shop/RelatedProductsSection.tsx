'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/autoplay';
import 'swiper/css/pagination';

import ProductCardEnhanced from '@/components/home/ProductCardEnhanced';
import { useAuth } from '@/providers/AuthProvider';
import { fetchRelatedProducts, formatProductPrice, formatOriginalPrice, Product } from '@/lib/api/products';
import { getImageUrl } from '@/lib/api/images';
import { useScrollFadeIn } from '@/hooks/use-scroll-fade-in';

interface RelatedProductsSectionProps {
  productSlug: string;
  categorySlug?: string;
}

const ProductCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-900 rounded-[20px] h-[340px] w-full border border-gray-100 dark:border-gray-800 p-3 shadow-sm flex flex-col animate-pulse">
    <div className="w-full h-44 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4" />
    <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2" />
    <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
    <div className="mt-auto">
      <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-3" />
      <div className="h-9 w-full bg-gray-100 dark:bg-gray-800 rounded-lg" />
    </div>
  </div>
);

const RelatedProductsSection = ({ productSlug, categorySlug }: RelatedProductsSectionProps) => {
  const { ref, isVisible } = useScrollFadeIn(0.1);
  const { user } = useAuth();
  const isWholesaler = user?.role === 'wholesaler';

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetched, setFetched] = useState<boolean>(false);
  const [isMounted, setIsMounted] = useState<boolean>(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch only when user scrolls down to this section
  useEffect(() => {
    if (isVisible && !fetched) {
      setLoading(true);
      fetchRelatedProducts(productSlug)
        .then((data) => {
          setProducts(data);
        })
        .catch((err) => {
          console.error('Failed to fetch related products:', err);
        })
        .finally(() => {
          setLoading(false);
          setFetched(true);
        });
    }
  }, [isVisible, fetched, productSlug]);

  if (!fetched && !isVisible) {
    return (
      <div ref={ref} className="w-full h-20">
        {/* Intersection Observer Trigger */}
      </div>
    );
  }

  if (fetched && products.length === 0) {
    return null;
  }

  const displayProducts = products.map((p) => ({
    image: getImageUrl(p.thumbnail_image || ''),
    title: p.name,
    price: formatProductPrice(p, isWholesaler),
    originalPrice: formatOriginalPrice(p, isWholesaler),
    badge: p.sale_price ? 'Sale' : undefined,
    productId: p.slug || String(p.id),
  }));

  const sliderId = 'related-products';

  return (
    <section ref={ref} className="mt-12 md:mt-16 pt-8 border-t border-border/40 overflow-hidden group">
      <style>{`
        .related-products-swiper {
          padding: 10px 10px 10px 10px !important;
          margin: -10px -10px -10px -10px !important;
        }
        .related-swiper-slide {
          width: calc(50% - 10px) !important;
          height: auto !important;
        }
        @media (min-width: 640px) {
          .related-swiper-slide {
            width: 220px !important;
          }
        }
        @media (min-width: 768px) {
          .related-swiper-slide {
            width: 270px !important;
          }
        }
        .related-swiper-pagination {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 6px !important;
          margin-top: 16px !important;
          min-height: 16px !important;
        }
        .related-swiper-pagination .swiper-pagination-bullet {
          width: 8px !important;
          height: 8px !important;
          background: #cbd5e1 !important;
          opacity: 1 !important;
          transition: all 0.3s ease !important;
          border-radius: 9999px !important;
          cursor: pointer !important;
          margin: 0 !important;
        }
        .related-swiper-pagination .swiper-pagination-bullet-active {
          background: #16a34a !important;
          width: 24px !important;
          border-radius: 9999px !important;
        }
      `}</style>

      {/* Section Header */}
      <div className="flex items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="flex items-center gap-3">
          <span className="w-1.5 h-8 md:h-10 rounded-full bg-gradient-to-b from-primary to-primary-600 shrink-0" />
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <Sparkles size={13} className="text-primary animate-pulse" />
              <p className="text-[11px] font-bold text-primary uppercase tracking-widest leading-none">
                You May Also Like
              </p>
            </div>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
              Related Products
            </h2>
          </div>
        </div>

        {categorySlug && (
          <Link
            href={`/shop/${categorySlug}`}
            className="text-xs font-semibold text-primary hover:text-primary-700 hover:underline shrink-0"
          >
            View More
          </Link>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading ? (
        <div className="flex gap-4 md:gap-5 overflow-hidden pb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="related-swiper-slide shrink-0">
              <ProductCardSkeleton />
            </div>
          ))}
        </div>
      ) : (
        /* Swiper Product Slider */
        <div className="relative group/slider">
          {/* Custom Navigation Prev */}
          <button
            className={`${sliderId}-prev absolute left-0 top-[40%] -translate-y-1/2 z-10 w-9 h-9 hidden md:flex items-center justify-center rounded-full bg-white shadow-md text-primary opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-0 disabled:pointer-events-none`}
            aria-label="Previous Products"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          {/* Custom Navigation Next */}
          <button
            className={`${sliderId}-next absolute right-0 top-[40%] -translate-y-1/2 z-10 w-9 h-9 hidden md:flex items-center justify-center rounded-full bg-white shadow-md text-primary opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-0 disabled:pointer-events-none`}
            aria-label="Next Products"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {isMounted ? (
            <>
              <Swiper
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={16}
                slidesPerView="auto"
                navigation={{
                  nextEl: `.${sliderId}-next`,
                  prevEl: `.${sliderId}-prev`,
                }}
                pagination={{
                  el: `.${sliderId}-pagination`,
                  clickable: true,
                }}
                autoplay={{ delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                loop={displayProducts.length > 4}
                className="related-products-swiper"
              >
                {displayProducts.map((p, idx) => (
                  <SwiperSlide key={`${p.productId}-${idx}`} className="related-swiper-slide">
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

              {/* Dedicated Pagination Dots Container */}
              <div className={`${sliderId}-pagination related-swiper-pagination`} />
            </>
          ) : (
            <div className="flex gap-4 md:gap-5 overflow-hidden related-products-swiper opacity-50">
              {displayProducts.slice(0, 4).map((p, idx) => (
                <div key={`init-${idx}`} className="related-swiper-slide shrink-0">
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
      )}
    </section>
  );
};

export default RelatedProductsSection;
