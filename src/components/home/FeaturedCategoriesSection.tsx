'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { staticCategories, FashionCategory } from "@/data/fashion/categories";

interface Props {
  categories?: FashionCategory[];
}

export default function FeaturedCategoriesSection({ categories }: Props) {
  const items = (categories ?? staticCategories).slice(0, 6);
  if (!items.length) return null;

  const [hero, ...rest] = items;

  return (
    <section className="section-padding bg-section-alt">
      <div className="container-main">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <p className="section-label mb-2">Explore</p>
            <h2 className="text-heading-1 text-foreground">Shop by Category</h2>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-600 transition-colors group self-start sm:self-auto">
            View all <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* Grid: hero left + 5 small right */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
          {/* Hero category — spans 2 rows on md+ */}
          <Link
            href={`/shop/${hero.slug}`}
            className="relative col-span-2 md:col-span-1 md:row-span-2 rounded-2xl overflow-hidden group bg-stone-200 aspect-[4/3] md:aspect-auto"
            style={{ minHeight: 300 }}
          >
            <Image
              src={hero.image}
              alt={hero.name}
              fill
              className="object-cover object-center transition-transform duration-600 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="text-white text-xl sm:text-2xl font-bold mb-1">{hero.name}</h3>
              <p className="text-white/70 text-xs mb-3">{hero.product_count} styles</p>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/15 hover:bg-primary backdrop-blur-sm px-3 py-1.5 rounded-full transition-all duration-200">
                Shop Now <ArrowRight size={12} />
              </span>
            </div>
          </Link>

          {/* Remaining categories */}
          {rest.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop/${cat.slug}`}
              className="relative rounded-2xl overflow-hidden group bg-stone-200 aspect-[4/3]"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className="object-cover object-center transition-transform duration-600 group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
                <h3 className="text-white text-sm sm:text-base font-bold leading-tight">{cat.name}</h3>
                {cat.slug === "sale" ? (
                  <p className="text-primary/90 text-xs font-semibold mt-0.5">Up to 50% Off</p>
                ) : (
                  <p className="text-white/60 text-xs mt-0.5">{cat.product_count} styles</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
