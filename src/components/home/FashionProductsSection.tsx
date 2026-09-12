'use client';

import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import FashionProductCard from "./FashionProductCard";
import { staticProducts, FashionProduct } from "@/data/fashion/products";

interface Props {
  title?: string;
  subtitle?: string;
  id?: string;
  products?: FashionProduct[];
  seeAllHref?: string;
  bgAlt?: boolean;
}

const SLIDES_VISIBLE = 4; // approx on large screens

export default function FashionProductsSection({
  title = "Our Collection",
  subtitle = "Featured",
  id = "products",
  products,
  seeAllHref = "/shop",
  bgAlt = false,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const uid = useId().replace(/:/g, "");
  const items = (products ?? staticProducts);

  useEffect(() => { setMounted(true); }, []);
  if (!items.length) return null;

  const enableLoop = items.length > SLIDES_VISIBLE;
  const prevId = `prev-${uid}`;
  const nextId = `next-${uid}`;

  return (
    <section
      id={id}
      className={`section-padding overflow-hidden ${bgAlt ? "bg-section-alt" : "bg-white"}`}
    >
      <style>{`
        .f-swiper-${uid} { padding: 8px 8px 32px 8px !important; margin: -8px -8px -32px -8px !important; }
        .f-slide-${uid}  { width: calc(50% - 8px) !important; height: auto !important; }
        @media (min-width: 480px)  { .f-slide-${uid} { width: 210px !important; } }
        @media (min-width: 640px)  { .f-slide-${uid} { width: 230px !important; } }
        @media (min-width: 768px)  { .f-slide-${uid} { width: 260px !important; } }
        @media (min-width: 1024px) { .f-slide-${uid} { width: 285px !important; } }
      `}</style>

      <div className="container-main">
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-3">
          <div>
            <p className="section-label mb-2">{subtitle}</p>
            <h2 className="text-heading-1 text-foreground">{title}</h2>
          </div>
          <Link
            href={seeAllHref}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-600 transition-colors group self-start sm:self-auto"
          >
            View All <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        {/* ── Slider ─────────────────────────────────────────────────────── */}
        <div className="relative group/slider">
          {/* Prev button */}
          <button
            id={prevId}
            className="absolute left-0 top-[38%] -translate-y-1/2 -translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Previous products"
          >
            <ChevronLeft size={18} strokeWidth={2.5} />
          </button>

          {/* Next button */}
          <button
            id={nextId}
            className="absolute right-0 top-[38%] -translate-y-1/2 translate-x-3 z-10 w-9 h-9 rounded-full bg-white shadow-lg border border-border flex items-center justify-center text-foreground hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 opacity-0 group-hover/slider:opacity-100 disabled:opacity-0 disabled:pointer-events-none"
            aria-label="Next products"
          >
            <ChevronRight size={18} strokeWidth={2.5} />
          </button>

          {mounted ? (
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={16}
              slidesPerView="auto"
              navigation={{ nextEl: `#${nextId}`, prevEl: `#${prevId}` }}
              autoplay={enableLoop
                ? { delay: 3500, disableOnInteraction: false, pauseOnMouseEnter: true }
                : false
              }
              loop={enableLoop}
              className={`f-swiper-${uid}`}
            >
              {items.map((p, i) => (
                <SwiperSlide key={`${p.id}-${i}`} className={`f-slide-${uid}`}>
                  <FashionProductCard product={p} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            /* SSR skeleton — no Swiper on server */
            <div className={`flex gap-4 overflow-hidden f-swiper-${uid} opacity-70`}>
              {items.slice(0, 4).map((p, i) => (
                <div key={`ssr-${i}`} className={`f-slide-${uid} shrink-0`}>
                  <FashionProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
