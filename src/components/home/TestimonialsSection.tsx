'use client';

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { staticTestimonials, Testimonial } from "@/data/fashion/testimonials";
import { cn } from "@/lib/utils";

interface Props {
  testimonials?: Testimonial[];
}

export default function TestimonialsSection({ testimonials }: Props) {
  const items = testimonials ?? staticTestimonials;
  const [active, setActive] = useState(0);
  const count = items.length;
  if (!count) return null;

  const prev = () => setActive((a) => (a - 1 + count) % count);
  const next = () => setActive((a) => (a + 1) % count);
  const t = items[active];

  return (
    <section className="section-padding bg-white">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="section-label mb-2">Reviews</p>
          <h2 className="text-heading-1">What Our Customers Say</h2>
        </div>

        {/* Testimonial card */}
        <div className="max-w-2xl mx-auto">
          <div className="relative bg-stone-50 rounded-2xl p-8 sm:p-10 text-center border border-border/50 shadow-sm">
            <Quote className="w-8 h-8 text-primary/20 mx-auto mb-5" aria-hidden />

            {/* Stars */}
            <div className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={18}
                  className={i < t.rating ? "fill-amber-400 text-amber-400" : "fill-stone-200 text-stone-200"}
                />
              ))}
            </div>

            {/* Text */}
            <blockquote className="text-base sm:text-lg text-foreground/80 leading-relaxed mb-6 italic">
              "{t.text}"
            </blockquote>

            {/* Product reference */}
            {t.product && (
              <p className="text-xs text-primary/70 font-semibold uppercase tracking-widest mb-4">
                {t.product}
              </p>
            )}

            {/* Author */}
            <div>
              <p className="font-bold text-foreground text-sm">{t.name}</p>
              <p className="text-muted-foreground text-xs mt-0.5">{t.location}</p>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={18} />
            </button>
            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {items.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-300",
                    i === active ? "w-6 bg-primary" : "w-1.5 bg-border hover:bg-primary/50"
                  )}
                  aria-label={`Review ${i + 1}`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:border-primary hover:text-primary transition-all duration-200"
              aria-label="Next testimonial"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Stats row */}
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { value: "10,000+", label: "Happy Customers" },
            { value: "4.8★", label: "Average Rating" },
            { value: "500+", label: "Styles Available" },
            { value: "30-Day", label: "Easy Returns" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl sm:text-3xl font-bold text-foreground mb-1">{value}</p>
              <p className="text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
