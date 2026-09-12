'use client';

import { useState, useEffect } from "react";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getCategoryImageUrl } from "@/lib/api";


const DEMO_CATEGORY_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f0fdf4' rx='12'/><circle cx='50' cy='50' r='30' fill='%23dcfce7'/><path d='M50 30 C38 45 38 65 50 70 C62 65 62 45 50 30 Z' fill='%2316a34a'/><path d='M50 30 L50 70' stroke='%23dcfce7' stroke-width='2'/></svg>";

interface Category {
  slug?: string;
  name: string;
  image?: string;
}

interface RelatedCategoriesSliderProps {
  categories: Category[];
}

export default function RelatedCategoriesSlider({ categories }: RelatedCategoriesSliderProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!categories || categories.length === 0) return null;

  return (
    <div className="relative group/slider">
      <style>{`
        .blog-categories-swiper {
          padding: 10px 5px 25px 5px !important;
          margin: -10px -5px -25px -5px !important;
        }
      `}</style>
      
      <button className="blog-categories-swiper-prev absolute left-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-primary opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-0 disabled:hidden">
        <ChevronLeft size={18} />
      </button>
      <button className="blog-categories-swiper-next absolute right-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-primary opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-0 disabled:hidden">
        <ChevronRight size={18} />
      </button>

      {isMounted ? (
        <Swiper
          modules={[Navigation, Autoplay]}
          spaceBetween={10}
          slidesPerView={2}
          navigation={{
            nextEl: ".blog-categories-swiper-next",
            prevEl: ".blog-categories-swiper-prev",
          }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 3, spaceBetween: 16 },
            1024: { slidesPerView: 4, spaceBetween: 20 },
          }}
          className="blog-categories-swiper"
        >
          {categories.map((category) => (
            <SwiperSlide key={category.slug ?? category.name} className="h-auto">
              <Link
                href={`/shop/${category.slug}`}
                className="group block h-full"
              >
                <div className="h-full bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center p-2.5 sm:p-3 gap-3 group/cat">
                  <div className="w-full aspect-[4/3] relative bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center p-3 sm:p-4">
                    <img
                      src={category.image && category.image.trim() !== "" ? category.image : DEMO_CATEGORY_IMAGE}
                      alt={category.name}
                      className="w-full h-full object-contain transition-transform duration-500 group-hover/cat:scale-110 mix-blend-multiply p-2"
                    />
                  </div>
                  <p className="text-sm sm:text-[15px] font-bold text-foreground text-center leading-snug line-clamp-2 group-hover/cat:text-primary transition-colors duration-300 w-full px-2 pb-1 sm:pb-2">
                    {category.name}
                  </p>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div className="flex gap-2 sm:gap-4 overflow-hidden blog-categories-swiper opacity-50">
          {categories.slice(0, 4).map((category, i) => (
            <div key={`skeleton-${i}`} className="w-1/2 sm:w-1/3 lg:w-1/4 shrink-0 h-auto">
              <div className="block h-full">
                <div className="h-full bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center p-2.5 sm:p-3 gap-3">
                  <div className="w-full aspect-[4/3] relative bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center p-3 sm:p-4">
                    <img
                      src={category.image && category.image.trim() !== "" ? category.image : DEMO_CATEGORY_IMAGE}
                      alt={category.name}
                      className="w-full h-full object-contain mix-blend-multiply p-2"
                    />
                  </div>
                  <p className="text-sm sm:text-[15px] font-bold text-foreground text-center leading-snug line-clamp-2 w-full px-2 pb-1 sm:pb-2">
                    {category.name}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
