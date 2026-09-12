'use client';

import { useState, useEffect } from "react";
import { useScrollFadeIn } from "@/hooks/use-scroll-fade-in";
import ProductsSectionEnhanced from "./ProductsSectionEnhanced";
import type { Product } from "@/lib/api/products";
import { API_BASE_URL } from "@/lib/api/config";

interface LazyCategoryProductsSectionProps {
  title: string;
  subtitle: string;
  id: string;
  slugs: string[];
}

export default function LazyCategoryProductsSection({ title, subtitle, id, slugs }: LazyCategoryProductsSectionProps) {
  const { ref, isVisible } = useScrollFadeIn(0.1);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [fetched, setFetched] = useState<boolean>(false);

  useEffect(() => {
    if (isVisible && !fetched) {
      const fetchProducts = async () => {
        try {
          const res = await fetch(`${API_BASE_URL}/api/v1/home-page/category-products?slugs=${slugs.join(',')}`);
          const json = await res.json();
          if (json.success && json.data && json.data.length > 0) {
            // Find the first matching category that has products
            for (const slug of slugs) {
              const category = json.data.find((c: any) => c.slug === slug);
              if (category && category.products && category.products.length > 0) {
                setProducts(category.products);
                break;
              }
            }
          }
        } catch (error) {
          console.error("Failed to fetch category products", error);
        } finally {
          setLoading(false);
          setFetched(true);
        }
      };

      fetchProducts();
    }
  }, [isVisible, fetched, slugs]);

  if (!fetched && !isVisible) {
    return (
      <div ref={ref} className="w-full h-40">
        {/* Placeholder invisible div to trigger intersection observer */}
      </div>
    );
  }

  if (loading) {
    return (
      <section ref={ref} className="section-padding bg-gradient-to-b from-white to-[#f8fafc] overflow-hidden group">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          {/* Skeleton Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div className="flex items-start gap-3">
              {/* Vertical line skeleton */}
              <span className="w-1.5 h-10 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0 self-center" />
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
                <div className="h-8 w-48 sm:w-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
            </div>
            {/* Button skeleton */}
            <div className="h-10 w-28 bg-gray-200 dark:bg-gray-700 rounded-full self-start sm:self-auto"></div>
          </div>

          {/* Skeleton Product Cards (Swiper Layout) */}
          <div className="flex gap-5 overflow-hidden pb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-[calc(50%-10px)] sm:w-[220px] md:w-[270px]"
              >
                <div className="bg-white dark:bg-gray-900 rounded-[20px] h-[340px] w-full border border-gray-100 dark:border-gray-800 p-3 shadow-sm flex flex-col">
                  {/* Image skeleton */}
                  <div className="w-full h-44 bg-gray-200 dark:bg-gray-700 rounded-xl mb-4"></div>
                  {/* Title skeleton */}
                  <div className="h-4 w-full bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
                  <div className="h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                  <div className="mt-auto">
                    {/* Price skeleton */}
                    <div className="h-6 w-24 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                    {/* Add to cart skeleton */}
                    <div className="h-9 w-full bg-gray-100 dark:bg-gray-800 rounded-lg"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div
      ref={ref}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease-out, transform 0.7s ease-out`,
      }}
    >
      <ProductsSectionEnhanced
        title={title}
        subtitle={subtitle}
        id={id}
        products={products}
      />
    </div>
  );
}
