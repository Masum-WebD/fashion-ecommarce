// ────────────────────────────────────────────────────────────────────────────
// STATIC FASHION PRODUCTS DATA
// Replace with API calls when going dynamic.
// ────────────────────────────────────────────────────────────────────────────

export interface FashionProduct {
  id: number;
  name: string;
  slug: string;
  thumbnail_image: string;
  price: number;
  sale_price: number | null;
  wholesale_price?: number | null;
  status: 'active' | 'inactive';
  is_new_arrival?: boolean;
  badge?: string;
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  rating?: number;
  reviews_count?: number;
  category: { id: number; name: string; slug: string };
}

export const staticProducts: FashionProduct[] = [
  {
    id: 1,
    name: "Floral Wrap Midi Dress",
    slug: "floral-wrap-midi-dress",
    thumbnail_image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&q=80",
    price: 3200, sale_price: 2400, status: "active", is_new_arrival: true,
    sizes: ["XS","S","M","L","XL"],
    colors: [{ name: "Rose", hex: "#f4a5b5" }, { name: "Cream", hex: "#f5f0e8" }],
    rating: 4.8, reviews_count: 127,
    category: { id: 1, name: "Women", slug: "women" },
  },
  {
    id: 2,
    name: "Premium Linen Blazer",
    slug: "premium-linen-blazer",
    thumbnail_image: "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600&q=80",
    price: 5500, sale_price: null, status: "active", is_new_arrival: true,
    sizes: ["XS","S","M","L"],
    colors: [{ name: "Camel", hex: "#c19a6b" }, { name: "White", hex: "#ffffff" }],
    rating: 4.9, reviews_count: 84,
    category: { id: 1, name: "Women", slug: "women" },
  },
  {
    id: 3,
    name: "High-Waist Wide Leg Trousers",
    slug: "high-waist-wide-leg-trousers",
    thumbnail_image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    price: 2800, sale_price: 2100, status: "active",
    sizes: ["XS","S","M","L","XL","XXL"],
    colors: [{ name: "Black", hex: "#1a1a1a" }, { name: "Navy", hex: "#1b2a4a" }],
    rating: 4.6, reviews_count: 213,
    category: { id: 1, name: "Women", slug: "women" },
  },
  {
    id: 4,
    name: "Silk Satin Slip Skirt",
    slug: "silk-satin-slip-skirt",
    thumbnail_image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
    price: 2200, sale_price: null, status: "active", is_new_arrival: true,
    sizes: ["XS","S","M","L"],
    colors: [{ name: "Champagne", hex: "#f7e7ce" }, { name: "Dusty Rose", hex: "#d4a5a5" }],
    rating: 4.7, reviews_count: 56,
    category: { id: 1, name: "Women", slug: "women" },
  },
  {
    id: 5,
    name: "Knit Crop Cardigan",
    slug: "knit-crop-cardigan",
    thumbnail_image: "https://images.unsplash.com/photo-1561861422-a549073e547a?w=600&q=80",
    price: 1800, sale_price: 1350, status: "active",
    sizes: ["XS","S","M","L","XL"],
    colors: [{ name: "Ivory", hex: "#f8f5ef" }, { name: "Terracotta", hex: "#c16a4c" }],
    rating: 4.5, reviews_count: 189,
    category: { id: 1, name: "Women", slug: "women" },
  },
  {
    id: 6,
    name: "Classic Oxford Button-Down",
    slug: "classic-oxford-button-down",
    thumbnail_image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    price: 2500, sale_price: null, status: "active", is_new_arrival: true,
    sizes: ["S","M","L","XL","XXL"],
    colors: [{ name: "White", hex: "#ffffff" }, { name: "Blue", hex: "#4a7fa5" }],
    rating: 4.7, reviews_count: 302,
    category: { id: 2, name: "Men", slug: "men" },
  },
  {
    id: 7,
    name: "Slim-Fit Chino Trousers",
    slug: "slim-fit-chino-trousers",
    thumbnail_image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    price: 3200, sale_price: 2560, status: "active",
    sizes: ["28","30","32","34","36"],
    colors: [{ name: "Khaki", hex: "#c3a882" }, { name: "Olive", hex: "#6b7c3b" }],
    rating: 4.6, reviews_count: 148,
    category: { id: 2, name: "Men", slug: "men" },
  },
  {
    id: 8,
    name: "Merino Wool Crewneck",
    slug: "merino-wool-crewneck",
    thumbnail_image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80",
    price: 4200, sale_price: null, status: "active",
    sizes: ["S","M","L","XL"],
    colors: [{ name: "Charcoal", hex: "#374151" }, { name: "Navy", hex: "#1e3a5f" }],
    rating: 4.9, reviews_count: 77,
    category: { id: 2, name: "Men", slug: "men" },
  },
  {
    id: 9,
    name: "Relaxed Linen Shirt",
    slug: "relaxed-linen-shirt",
    thumbnail_image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    price: 2800, sale_price: null, status: "active", is_new_arrival: true,
    sizes: ["S","M","L","XL","XXL"],
    colors: [{ name: "Sand", hex: "#e8d5b7" }, { name: "Sage", hex: "#7c9a7e" }],
    rating: 4.8, reviews_count: 94,
    category: { id: 2, name: "Men", slug: "men" },
  },
  {
    id: 10,
    name: "Leather Crossbody Bag",
    slug: "leather-crossbody-bag",
    thumbnail_image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80",
    price: 6500, sale_price: 5200, status: "active",
    colors: [{ name: "Tan", hex: "#c4935e" }, { name: "Black", hex: "#1a1a1a" }],
    rating: 4.9, reviews_count: 221,
    category: { id: 3, name: "Accessories", slug: "accessories" },
  },
  {
    id: 11,
    name: "Silk Scarf — Floral Print",
    slug: "silk-scarf-floral-print",
    thumbnail_image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&q=80",
    price: 1500, sale_price: null, status: "active", is_new_arrival: true,
    colors: [{ name: "Blush", hex: "#f4a5b5" }, { name: "Ivory", hex: "#f8f5ef" }],
    rating: 4.7, reviews_count: 63,
    category: { id: 3, name: "Accessories", slug: "accessories" },
  },
  {
    id: 12,
    name: "Minimalist Gold Earrings",
    slug: "minimalist-gold-earrings",
    thumbnail_image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    price: 1200, sale_price: null, status: "active", is_new_arrival: true,
    colors: [{ name: "Gold", hex: "#d4af37" }, { name: "Silver", hex: "#c0c0c0" }],
    rating: 4.8, reviews_count: 145,
    category: { id: 3, name: "Accessories", slug: "accessories" },
  },
];

export const popularProducts = staticProducts.slice(0, 8);
export const newArrivals = staticProducts.filter((p) => p.is_new_arrival);
export const saleProducts = staticProducts.filter((p) => p.sale_price !== null);
