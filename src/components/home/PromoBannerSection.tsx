'use client';

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function PromoBannerSection() {
  return (
    <section
      className="relative overflow-hidden"
      aria-label="Summer sale promotion"
    >
      {/* Gradient background */}
      <div className="bg-gradient-to-br from-stone-900 via-zinc-800 to-stone-900 py-14 sm:py-20">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-primary/8 blur-3xl pointer-events-none" />

        <div className="container-main relative z-10 text-center">
          <p className="section-label text-primary/80 mb-4">Limited Time Offer</p>
          <h2 className="text-display-2 font-serif-display text-white mb-4">
            Summer Sale — Up to
            <span className="text-gradient-primary"> 50% Off</span>
          </h2>
          <p className="text-white/60 text-base sm:text-lg mb-8 max-w-xl mx-auto leading-relaxed">
            Refresh your wardrobe with our biggest sale of the season. Premium styles at unbeatable prices — for a limited time only.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/shop/sale"
              className="btn-primary text-sm px-8 py-3 rounded-full shadow-lg btn-bling"
            >
              Shop the Sale <ArrowRight size={15} />
            </Link>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full border border-white/25 text-white text-sm font-semibold hover:bg-white/10 transition-all duration-200"
            >
              Browse All
            </Link>
          </div>
          {/* Countdown-style chips */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {[
              { value: "৳0", label: "Free Shipping over ৳2,500" },
              { value: "30", label: "Day Easy Returns" },
              { value: "100%", label: "Authentic Products" },
            ].map(({ value, label }) => (
              <div
                key={label}
                className="flex items-center gap-2 bg-white/8 border border-white/12 rounded-full px-4 py-2"
              >
                <span className="text-primary font-bold text-sm">{value}</span>
                <span className="text-white/60 text-xs">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
