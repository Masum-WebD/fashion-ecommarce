'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { Category, getHomeCategories } from "@/lib/api/home";
import { getCategoryImageUrl } from "@/lib/api/images";

interface HomeCategoriesSectionProps {
  categories?: Category[];
}

const DEMO_CATEGORY_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f0fdf4' rx='12'/><circle cx='50' cy='50' r='30' fill='%23dcfce7'/><path d='M50 30 C38 45 38 65 50 70 C62 65 62 45 50 30 Z' fill='%2316a34a'/><path d='M50 30 L50 70' stroke='%23dcfce7' stroke-width='2'/></svg>";

const HomeCategoriesSection = ({ categories }: HomeCategoriesSectionProps) => {
  const homeCategories = getHomeCategories(categories ?? []);

  if (homeCategories.length === 0) {
    return null;
  }

  return (
    <section className="section-padding bg-section-alt">
      <div className="max-w-[1200px] mx-auto px-2 sm:px-3 lg:px-4">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="w-1 h-7 rounded-full bg-gradient-to-b from-primary to-primary-600 shrink-0"></span>
            <div>
              <p className="text-[11px] font-semibold text-primary uppercase tracking-widest leading-none mb-0.5">
                Categories
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                Our Product Categories
              </h2>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 md:gap-2.5 items-stretch">
          {homeCategories.map((category) => (
            <Link
              key={category.slug ?? category.name}
              href={`/shop/${category.slug}`}
              className="group h-full"
            >
              {/* Card */}
              <div className="h-full bg-white rounded-xl shadow-[0_1px_6px_rgba(0,0,0,0.08)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.12)] border border-border/50 hover:border-primary/20 transition-all duration-300 hover:-translate-y-0.5 overflow-hidden flex flex-col items-center px-1.5 pt-2 pb-2 gap-1.5">

                {/* Image Box */}
                <div className="w-full bg-white rounded-lg overflow-hidden flex items-center justify-center" style={{ height: "80px" }}>
                  <Image
                    src={category.image && category.image.trim() !== "" ? getCategoryImageUrl(category.image) : DEMO_CATEGORY_IMAGE}
                    alt={category.name}
                    width={200}
                    height={160}
                    onError={(e) => {
                      e.currentTarget.src = DEMO_CATEGORY_IMAGE;
                      e.currentTarget.srcset = DEMO_CATEGORY_IMAGE;
                    }}
                    className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                  />
                </div>

                {/* Title */}
                <p className="text-xs sm:text-[13px] md:text-sm font-bold text-foreground text-center leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200 w-full px-1">
                  {category.name}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HomeCategoriesSection;
