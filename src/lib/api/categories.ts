import { API_BASE_URL } from "./config";
import { getCategoryImageUrl } from "./images";

export interface ShopCategorySubChild {
  id: number;
  name: string;
  slug: string;
  image: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  short_description?: string;
  long_description?: string;
}

/** Child category from GET /api/v1/categories */
export interface ShopCategoryChild {
  id: number;
  name: string;
  slug: string;
  image: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  short_description?: string;
  long_description?: string;
  children?: ShopCategorySubChild[];
}

/** Root category with nested children from GET /api/v1/categories */
export interface ShopCategory {
  id: number;
  name: string;
  slug: string;
  image: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  short_description?: string;
  long_description?: string;
  children: ShopCategoryChild[];
}

export type ShopCategoryItem = ShopCategory | ShopCategoryChild | ShopCategorySubChild;

export interface CategoriesListResponse {
  success: boolean;
  message: string;
  data: ShopCategory[];
}

export const getShopCategoryImageUrl = (image: string | null | undefined): string => {
  if (!image) return '';
  if (image.startsWith('http')) return image;
  return getCategoryImageUrl(image);
};

export const fetchShopCategories = async (): Promise<ShopCategory[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/categories`);
  if (!response.ok) {
    throw new Error(`Failed to fetch categories: ${response.status}`);
  }
  const result: CategoriesListResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data;
};

export const isShopRootCategory = (
  categories: ShopCategory[],
  item: ShopCategoryItem
): item is ShopCategory => categories.some((c) => c.id === item.id);

export const findShopCategoryBySlug = (
  categories: ShopCategory[],
  slug: string
): { category: ShopCategoryItem; parent: ShopCategory | ShopCategoryChild | null } | null => {
  for (const root of categories) {
    if (root.slug === slug) {
      return { category: root, parent: null };
    }
    for (const child of root.children) {
      if (child.slug === slug) {
        return { category: child, parent: root };
      }
      if (child.children) {
        for (const subChild of child.children) {
          if (subChild.slug === slug) {
            return { category: subChild, parent: child };
          }
        }
      }
    }
  }
  return null;
};

export interface ShopCategoryView {
  items: ShopCategoryItem[];
  title: string;
  description: string;
  parent: ShopCategory | ShopCategoryChild | null;
  current: ShopCategoryItem | null;
  isLeaf: boolean;
  notFound: boolean;
}

export const getShopCategoryView = (
  categories: ShopCategory[],
  categorySlug?: string
): ShopCategoryView => {
  if (!categorySlug) {
    return {
      items: categories,
      title: 'Our Product Categories',
      description: 'Browse our selection of farming, gardening, and construction categories.',
      parent: null,
      current: null,
      isLeaf: false,
      notFound: false,
    };
  }

  const found = findShopCategoryBySlug(categories, categorySlug);
  if (!found) {
    return {
      items: [],
      title: 'Category Not Found',
      description: 'The category you are looking for does not exist.',
      parent: null,
      current: null,
      isLeaf: false,
      notFound: true,
    };
  }

  const { category, parent } = found;

  if (isShopRootCategory(categories, category) && category.children.length > 0) {
    return {
      items: category.children,
      title: category.name,
      description: `Explore sub-categories under ${category.name}.`,
      parent: null,
      current: category,
      isLeaf: false,
      notFound: false,
    };
  }

  if ('children' in category && category.children && category.children.length > 0) {
    return {
      items: category.children,
      title: category.name,
      description: `Explore child categories under ${category.name}.`,
      parent: parent,
      current: category,
      isLeaf: false,
      notFound: false,
    };
  }

  return {
    items: [],
    title: category.name,
    description: `Browse products in ${category.name}.`,
    parent,
    current: category,
    isLeaf: true,
    notFound: false,
  };
};
