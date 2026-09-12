import { API_BASE_URL } from "./config";
import type { CategoryBlog } from "./blog";
import type { Product } from "./products";

export interface Slider {
  id: number;
  title: string;
  image: string;
  image_url: string;
  status: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
  status: string;
  is_home: number;
  image: string;
  sort_order: number;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  created_at: string;
  updated_at: string;
}

export interface HomeCategoryProducts {
  id: number;
  name: string;
  slug: string;
  products: Product[];
}

export interface HomePageData {
  sliders: Slider[];
  categories: Category[];
  products: Product[];
  popular_products: Product[];
  category_blogs: CategoryBlog[];
  category_products?: HomeCategoryProducts[];
}

export interface HomePageResponse {
  success: boolean;
  message: string;
  data: HomePageData;
}

/** Active categories flagged for the home page, sorted by sort_order. */
export const getHomeCategories = (categories: Category[]): Category[] =>
  categories
    .filter((c) => c.status === 'active' && c.is_home === 1)
    .sort((a, b) => a.sort_order - b.sort_order || a.id - b.id);

export const fetchHomePageData = async (): Promise<HomePageData> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/home-page`);
  if (!response.ok) {
    throw new Error(`Failed to fetch home page data: ${response.status}`);
  }
  const result: HomePageResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data;
};
