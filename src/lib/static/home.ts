// ────────────────────────────────────────────────────────────────────────────
// STATIC HOME PAGE DATA FETCHER
//
// This file mirrors the signature of @/lib/api/home fetchHomePageData()
// so that swapping to dynamic API calls later only requires changing this file.
//
// To make dynamic: replace the imports below with actual API calls.
// ────────────────────────────────────────────────────────────────────────────

import { staticProducts, popularProducts, newArrivals } from "@/data/fashion/products";
import { staticCategories } from "@/data/fashion/categories";
import { staticSliders } from "@/data/fashion/sliders";
import { staticSettings } from "@/data/fashion/settings";

export async function fetchStaticHomePageData() {
  // Simulate a small async operation (remove in production API version)
  await Promise.resolve();

  return {
    sliders: staticSliders,
    categories: staticCategories,
    popular_products: popularProducts,
    products: newArrivals,
    settings: staticSettings,
    category_blogs: [], // Will be populated when dynamic
  };
}

export { staticSettings };
