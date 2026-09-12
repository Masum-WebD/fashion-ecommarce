'use client';

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { staticSliders, HeroSlider } from "@/data/fashion/sliders";

interface HeroProps {
  sliders?: HeroSlider[];
}

const AUTO_PLAY_MS = 5500;

export default function HeroSectionEnhanced({ sliders }: HeroProps) {
  const active = (sliders ?? staticSliders).filter((s) => s.status === "active");
  const count = active.length;
  const multi = count > 1;

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<"next" | "prev">("next");

  const goTo = useCallback(
    (idx: number) => {
      setDirection(idx > current ? "next" : "prev");
      setCurrent((idx + count) % count);
    },
    [count, current]
  );

  useEffect(() => {
    if (!multi || paused) return;
    const t = setInterval(() => {
      setDirection("next");
      setCurrent((p) => (p + 1) % count);
    }, AUTO_PLAY_MS);
    return () => clearInterval(t);
  }, [multi, count, paused]);

  if (!active.length) return null;

  const slide = active[current];

  return (
    <section
      className="relative w-full overflow-hidden bg-stone-900"
      style={{ minHeight: "clamp(380px, 62vw, 780px)" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label="Featured banner"
    >
      {/* Slides */}
      {active.map((s, i) => (
        <div
          key={s.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
          )}
        >
          <Image
            src={s.image_url}
            alt={s.title}
            fill
            priority={i === 0}
            className="object-cover object-center"
            sizes="100vw"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
          {/* Content */}
          <div className="absolute inset-0 flex items-center">
            <div className="container-main">
              <div className="max-w-xl animate-slide-up">
                {i === current && (
                  <>
                    <p className="section-label text-primary/90 mb-3">New Collection 2025</p>
                    <h1 className="text-display-2 text-white mb-4 drop-shadow-sm font-serif-display leading-tight">
                      {s.title}
                    </h1>
                    {s.subtitle && (
                      <p className="text-base sm:text-lg text-white/75 mb-8 leading-relaxed">
                        {s.subtitle}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <Link
                        href={s.cta_href || "/shop"}
                        className="btn-primary text-sm px-7 py-3 rounded-full shadow-lg"
                      >
                        {s.cta_text || "Shop Now"} <ArrowRight size={15} />
                      </Link>
                      <Link
                        href="/shop/new-arrivals"
                        className="inline-flex items-center gap-2 px-7 py-3 rounded-full border border-white/40 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200"
                      >
                        New Arrivals
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Prev / Next */}
      {multi && (
        <>
          <button
            onClick={() => goTo(current - 1)}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
            aria-label="Previous slide"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={() => goTo(current + 1)}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full glass-dark flex items-center justify-center text-white hover:bg-white/20 transition-all duration-200 opacity-0 hover:opacity-100 focus:opacity-100 group-hover:opacity-100"
            aria-label="Next slide"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Indicators */}
      {multi && (
        <div className="absolute bottom-5 left-0 right-0 z-20 flex items-center justify-center gap-2">
          {active.map((_, idx) => (
            <button
              key={idx}
              onClick={() => goTo(idx)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-400",
                idx === current ? "w-8 bg-primary" : "w-2 bg-white/50 hover:bg-white/80"
              )}
              aria-label={`Slide ${idx + 1}`}
              aria-current={idx === current}
            />
          ))}
        </div>
      )}

      {/* Slide counter */}
      {multi && (
        <div className="absolute bottom-5 right-6 z-20 text-white/50 text-xs font-medium tabular-nums">
          {String(current + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}
        </div>
      )}
    </section>
  );
}
