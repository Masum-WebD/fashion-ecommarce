'use client';

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  ShoppingCart,
  MessageCircle,
  ChevronRight,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import "@/text-editor.css";

import {
  fetchCustomPageBySlug,
  getImageUrl,
  type CustomPageProduct,
} from "@/lib/api";
import { ContentSkeleton } from "@/components/PageLoader";

const CustomPageClient = ({ slug }: { slug: string }) => {
  const router = useRouter();

  const {
    data: page,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["custom-page", slug],
    queryFn: () => fetchCustomPageBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <ContentSkeleton />
      </div>
    );
  }

  if (isError || !page) {
    return (
      <div className="min-h-screen bg-white">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-12 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-600 text-center">Could not load this page.</p>
          <Button onClick={() => refetch()} disabled={isFetching}>
            {isFetching ? <Loader2 size={16} className="animate-spin mr-2" /> : null}
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const activeProducts = page.products?.filter((p) => p.status === "active") || [];

  return (
    <div className="min-h-screen w-full bg-white">

      {/* Breadcrumb */}
      <div className="w-full bg-gray-50 border-b border-gray-200">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3 md:py-4">
          <div className="flex items-center gap-2 text-xs md:text-sm">
            <button
              onClick={() => router.push("/")}
              className="text-gray-600 hover:text-blue-600 transition-colors font-medium whitespace-nowrap"
            >
              HOME
            </button>
            <ChevronRight size={14} className="text-gray-400 flex-shrink-0" />
            <span className="text-gray-900 font-semibold truncate">
              {page.title}
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-blue-50 to-white py-6 md:py-12 lg:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl bg-white px-2 md:px-3 py-8 rounded mx-auto text-center space-y-3 md:space-y-5 lg:space-y-6">
            {/* Title */}
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 leading-tight px-2">
              {page.title}
            </h1>

            {/* Description */}
            {page.description && (
              <div
                className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed  mx-auto px-2 text-editor-content"
                dangerouslySetInnerHTML={{ __html: page.description }}
              />
            )}

            {/* CTA Buttons */}
            <div className="flex flex-col gap-2.5 sm:gap-3 pt-3 md:pt-5 lg:pt-6 px-2">
              {page.whatsapp_btn_text && (
                <a
                  href="https://wa.me/8801706176403"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-xs sm:text-sm md:text-base"
                >
                  <MessageCircle size={16} className="flex-shrink-0" />
                  <span>{page.whatsapp_btn_text}</span>
                </a>
              )}
              {page.messenger_btn_text && (
                <a
                  href="https://m.me/sirajtech"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 md:px-8 py-2.5 md:py-3 rounded-lg font-semibold transition-all duration-300 hover:shadow-lg text-xs sm:text-sm md:text-base"
                >
                  <MessageCircle size={16} className="flex-shrink-0" />
                  <span>{page.messenger_btn_text}</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      {activeProducts.length > 0 && (
        <section className="w-full py-6 md:py-12 lg:py-16 bg-white">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-6 md:mb-10 lg:mb-12">
              <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-gray-900 mb-1 md:mb-2">
                আমাদের পণ্যসমূহ
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm md:text-base">
                {activeProducts.length} টি পণ্য পাওয়া গেছে
              </p>
            </div>

            {/* Product Grid - Mobile optimized */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              {activeProducts.map((product, index) => {
                const salePrice = parseFloat(product.sale_price);
                const regularPrice = parseFloat(product.regular_price);
                const hasDiscount = salePrice > 0 && regularPrice > salePrice;
                const displayPrice = salePrice > 0 ? salePrice : regularPrice;
                const discountPercent = hasDiscount
                  ? Math.round(((regularPrice - salePrice) / regularPrice) * 100)
                  : 0;
                const thumbnailUrl = getImageUrl(product.thumbnail_image);

                return (
                  <div
                    key={product.id}
                    className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col group h-full"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                      {hasDiscount && (
                        <div className="absolute top-1 left-1 z-10 bg-red-500 text-white text-[9px] sm:text-xs font-bold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded">
                          {discountPercent}% OFF
                        </div>
                      )}

                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={product.name}
                          className="w-full h-full object-contain p-2 sm:p-3 md:p-4 group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <Package size={32} className="text-gray-300" />
                      )}

                      {/* View Details Button - Hidden on mobile, visible on hover desktop */}
                      <button
                        onClick={() => router.push(`/product/${product.slug}`)}
                        className="hidden sm:flex absolute inset-0 bg-black/0 group-hover:bg-black/20 items-center justify-center transition-colors duration-300 opacity-0 group-hover:opacity-100"
                      >
                        <span className="bg-white text-gray-900 text-xs md:text-sm font-bold px-3 md:px-4 py-1.5 md:py-2 rounded-lg shadow-lg">
                          বিস্তারিত
                        </span>
                      </button>
                    </div>

                    {/* Product Info */}
                    <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1">
                      {/* Name */}
                      <h3 className="text-xs sm:text-sm md:text-base font-semibold text-gray-900 line-clamp-2 mb-1 cursor-pointer hover:text-blue-600 transition-colors">
                        {product.name}
                      </h3>

                      {/* Variants */}
                      {product.variants.length > 0 && (
                        <p className="text-[10px] sm:text-xs text-gray-500 mb-1.5 sm:mb-2">
                          {product.variants.length} অপশন
                        </p>
                      )}

                      {/* Price and Button */}
                      <div className="mt-auto space-y-1.5 sm:space-y-2 pt-1.5 sm:pt-2">
                        {/* Price */}
                        <div className="flex items-baseline gap-1 sm:gap-2 flex-wrap">
                          <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                            ৳{displayPrice}
                          </span>
                          {hasDiscount && (
                            <span className="text-[9px] sm:text-xs text-gray-400 line-through">
                              ৳{regularPrice}
                            </span>
                          )}
                        </div>

                        {/* Order Button */}
                        <button
                          onClick={() => router.push(`/product/${product.slug}`)}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white px-2 sm:px-4 py-1.5 sm:py-2 md:py-2.5 rounded-lg font-semibold text-[10px] sm:text-xs md:text-sm transition-colors duration-300 flex items-center justify-center gap-1"
                        >
                          <ShoppingCart size={12} className="sm:w-4 sm:h-4" />
                          <span>অর্ডার করুন</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
};

export default CustomPageClient;
