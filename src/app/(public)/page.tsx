import { Metadata } from "next";
import HeroSectionEnhanced from "@/components/home/HeroSectionEnhanced";
import FeaturedCategoriesSection from "@/components/home/FeaturedCategoriesSection";
import FashionProductsSection from "@/components/home/FashionProductsSection";
import PromoBannerSection from "@/components/home/PromoBannerSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AnimatedSection from "@/components/home/AnimatedSection";
import { staticSliders } from "@/data/fashion/sliders";
import { staticCategories } from "@/data/fashion/categories";
import { newArrivals, popularProducts, saleProducts } from "@/data/fashion/products";
import { staticTestimonials } from "@/data/fashion/testimonials";

export const metadata: Metadata = {
  title: {
    absolute: "Velura Fashion | Premium Clothing & Accessories",
  },
  description:
    "Discover Velura Fashion — Bangladesh's premier online fashion destination. Shop premium women's, men's and kids' clothing, accessories, and more. Free shipping over ৳2,500.",
  alternates: { canonical: "/" },
  openGraph: {
    images: [{ url: "/assets/logo.png", width: 800, height: 600, alt: "Velura Fashion" }],
  },
};

export default async function HomePage() {
  // ── Static data (swap these imports with API calls to go dynamic) ──
  const sliders    = staticSliders;
  const categories = staticCategories;
  const featured   = newArrivals;
  const popular    = popularProducts;
  const onSale     = saleProducts;
  const reviews    = staticTestimonials;

  return (
    <main id="main-content" role="main">
      {/* 1. Hero slider */}
      <HeroSectionEnhanced sliders={sliders} />

      {/* 2. Category grid */}
      <AnimatedSection delay={100}>
        <FeaturedCategoriesSection categories={categories} />
      </AnimatedSection>

      {/* 3. New Arrivals carousel */}
      <AnimatedSection>
        <FashionProductsSection
          title="New Arrivals"
          subtitle="Just Landed"
          id="new-arrivals"
          products={featured}
          seeAllHref="/shop/new-arrivals"
        />
      </AnimatedSection>

      {/* 4. Promo banner */}
      <PromoBannerSection />

      {/* 5. Popular products carousel */}
      <AnimatedSection delay={100}>
        <FashionProductsSection
          title="Most Loved"
          subtitle="Top Picks"
          id="popular"
          products={popular}
          seeAllHref="/shop"
          bgAlt
        />
      </AnimatedSection>

      {/* 6. Sale section */}
      <AnimatedSection>
        <FashionProductsSection
          title="On Sale"
          subtitle="Best Deals"
          id="sale"
          products={onSale}
          seeAllHref="/shop/sale"
        />
      </AnimatedSection>

      {/* 7. Testimonials */}
      <AnimatedSection delay={100}>
        <TestimonialsSection testimonials={reviews} />
      </AnimatedSection>
    </main>
  );
}
