// ────────────────────────────────────────────────────────────────────────────
// STATIC FASHION CATEGORIES
// ────────────────────────────────────────────────────────────────────────────

export interface FashionCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  description?: string;
  product_count?: number;
}

export const staticCategories: FashionCategory[] = [
  {
    id: 1,
    name: "Women",
    slug: "women",
    image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&q=80",
    description: "Elegant styles for every occasion",
    product_count: 124,
  },
  {
    id: 2,
    name: "Men",
    slug: "men",
    image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80",
    description: "Sharp, modern essentials",
    product_count: 98,
  },
  {
    id: 3,
    name: "Kids",
    slug: "kids",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
    description: "Playful comfort for little ones",
    product_count: 67,
  },
  {
    id: 4,
    name: "Accessories",
    slug: "accessories",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&q=80",
    description: "Complete your look",
    product_count: 85,
  },
  {
    id: 5,
    name: "New Arrivals",
    slug: "new-arrivals",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=80",
    description: "Fresh styles just landed",
    product_count: 42,
  },
  {
    id: 6,
    name: "Sale",
    slug: "sale",
    image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80",
    description: "Up to 50% off selected styles",
    product_count: 55,
  },
];
