// ────────────────────────────────────────────────────────────────────────────
// STATIC HERO SLIDERS
// ────────────────────────────────────────────────────────────────────────────

export interface HeroSlider {
  id: number;
  title: string;
  subtitle?: string;
  image_url: string;
  cta_text?: string;
  cta_href?: string;
  status: "active" | "inactive";
}

export const staticSliders: HeroSlider[] = [
  {
    id: 1,
    title: "New Season, New You",
    subtitle: "Explore the Summer 2025 Collection",
    image_url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1920&q=85",
    cta_text: "Shop Collection",
    cta_href: "/shop",
    status: "active",
  },
  {
    id: 2,
    title: "Effortless Elegance",
    subtitle: "Premium fabrics. Timeless silhouettes.",
    image_url: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1920&q=85",
    cta_text: "Discover Women",
    cta_href: "/shop/women",
    status: "active",
  },
  {
    id: 3,
    title: "Men's Essentials",
    subtitle: "Refined basics for the modern man",
    image_url: "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=1920&q=85",
    cta_text: "Shop Men",
    cta_href: "/shop/men",
    status: "active",
  },
];
