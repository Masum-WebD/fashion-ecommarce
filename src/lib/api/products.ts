import { API_BASE_URL } from "./config";

/** An image associated with a product (from the images array) */
export interface ProductImage {
  id: number;
  product_id: number;
  image: string;
  created_at: string;
  updated_at: string;
}

export interface BulkDiscount {
  id: number;
  product_id: number;
  min_qty: number;
  max_qty: number;
  discount_type: 'percentage' | 'fixed';
  discount_value: string;
  is_active: number;
}

/** Attribute combination for a variant (e.g. Weight → 100 gm) */
export interface AttributeCombination {
  id: number;
  variant_id: number;
  attribute_id: number;
  attribute_value_id: number;
  attribute: string;
  attribute_value: string;
  created_at: string;
  updated_at: string;
}

/** Inventory info for a variant at the default branch */
export interface BranchInventory {
  id: number;
  variant_id: number;
  stock: number;
}

/** A product variant with its own pricing */
export interface Variant {
  id: number;
  product_id: number;
  name: string;
  regular_price: string | null;
  sale_price: string | null;
  purchase_price: string | null;
  wholesale_price: string | null;
  calculated_wholesale_price?: number;
  sku: string | null;
  barcode: string | null;
  weight_kg: string | null;
  length_cm: string | null;
  width_cm: string | null;
  height_cm: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  attribute_combinations: AttributeCombination[];
  default_branch_inventory: BranchInventory | null;
  default_inventory?: BranchInventory | null;
  min_quantity?: number | null;
  max_quantity?: number | null;
}

/** Minimal category info nested in product responses */
export interface NestedCategory {
  id: number;
  name: string;
  slug: string;
}

/** Minimal brand info nested in product responses */
export interface NestedBrand {
  id: number;
  name: string;
  slug: string;
}

/** Product as returned in list endpoints */
export interface Product {
  id: number;
  name: string;
  slug: string;
  brand_id: number;
  category_id: number;
  sub_category_id: number | null;
  thumbnail_image: string | null;
  image_url?: string;
  short_description: string;
  regular_price: string | null;
  sale_price: string | null;
  calculated_wholesale_price?: number;
  discount_type: string | null;
  discount_value: string | null;
  sku: string | null;
  is_home: number;
  product_type: string;
  created_at: string;
  category: NestedCategory;
  categories?: NestedCategory[];
  category_chains?: Array<Array<{ id: number; name: string; slug: string }>>;
  brand: NestedBrand;
  default_inventory: unknown | null;
  default_branch_inventory?: unknown | null;
  variants: Variant[];
  weight_kg?: number | null;
  min_quantity?: number | null;
  max_quantity?: number | null;
  min_price?: string | number | null;
  max_price?: string | number | null;
}

/** Full product detail as returned by GET /api/v1/products/{slug} */
export interface ProductDetail extends Product {
  description: string;
  long_description?: string;
  images: ProductImage[];
  youtube_video?: string | null;
  avg_rating: number | null;
  reviews_count: number | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  purchase_price: string | null;
  wholesale_price: string | null;
  min_quantity: number | null;
  max_quantity: number | null;
  weight_kg: number | null;
  sub_category: NestedCategory | null;
  child_category: NestedCategory | null;
  bulk_discounts: BulkDiscount[] | null;
}

export interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number | null;
  to: number | null;
  first_page_url: string;
  last_page_url: string;
  next_page_url: string | null;
  prev_page_url: string | null;
  path: string;
  links: Array<{ url: string | null; label: string; page: number | null; active: boolean }>;
}

export interface ProductsListResponse {
  success: boolean;
  message: string;
  data: PaginationInfo & { data: Product[] };
}

export interface ProductDetailResponse {
  success: boolean;
  message: string;
  data: ProductDetail;
}

/** Fetch paginated products, optionally filtered by category and/or subcategory. */
export const fetchProducts = async (params?: {
  categoryId?: number;
  subCategoryId?: number;
  childCategoryId?: number;
  brand_id?: number;
  page?: number;
}): Promise<PaginationInfo & { data: Product[] }> => {
  const query = new URLSearchParams();
  if (params?.categoryId) query.set('category_id', String(params.categoryId));
  if (params?.subCategoryId) query.set('sub_category_id', String(params.subCategoryId));
  if (params?.childCategoryId) query.set('child_category_id', String(params.childCategoryId));
  if (params?.brand_id) query.set('brand_id', String(params.brand_id));
  if (params?.page) query.set('page', String(params.page));

  const qs = query.toString();
  const url = `${API_BASE_URL}/api/v1/products${qs ? `?${qs}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }
  const result: ProductsListResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data;
};

/** Fetch paginated products filtered by a specific tag. */
export const fetchProductsByTag = async (slug: string, page?: number): Promise<PaginationInfo & { data: Product[] }> => {
  const query = new URLSearchParams();
  if (page) query.set('page', String(page));

  const qs = query.toString();
  const url = `${API_BASE_URL}/api/v1/product-tags/${slug}/products${qs ? `?${qs}` : ''}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch products by tag: ${response.status}`);
  }
  const result: ProductsListResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data;
};

/** Combine thumbnail and gallery images for a product detail page. */
export const getProductImages = (product: ProductDetail): string[] => {
  const urls: string[] = [];
  if (product.thumbnail_image) {
    urls.push(product.thumbnail_image);
  }
  if (product.images && product.images.length > 0) {
    for (const img of product.images) {
      if (img.image) {
        const url = img.image;
        if (!urls.includes(url)) {
          urls.push(url);
        }
      }
    }
  }
  return urls;
};

/** Fetch a single product by its slug. */
export const fetchProductBySlug = async (slug: string): Promise<ProductDetail | null> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/products/${slug}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Failed to fetch product: ${response.status}`);
  }
  const result: ProductDetailResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data;
};

/** Format a product price for display. */
export const formatProductPrice = (product: { 
  sale_price?: string | null; 
  regular_price?: string | null; 
  calculated_wholesale_price?: number;
  min_price?: string | number | null;
  max_price?: string | number | null;
}, isWholesaler?: boolean): string => {
  if (isWholesaler && product.calculated_wholesale_price && product.calculated_wholesale_price > 0) {
    return `৳${product.calculated_wholesale_price}`;
  }
  
  if (product.min_price && product.max_price && Number(product.min_price) !== Number(product.max_price)) {
    return `৳${product.min_price} - ৳${product.max_price}`;
  }

  if (product.sale_price) return `৳${product.sale_price}`;
  if (product.regular_price) return `৳${product.regular_price}`;
  return 'যোগাযোগ করুন';
};

/** Format original (strikethrough) price if on sale. */
export const formatOriginalPrice = (product: { 
  sale_price?: string | null; 
  regular_price?: string | null; 
  calculated_wholesale_price?: number;
  min_price?: string | number | null;
  max_price?: string | number | null;
}, isWholesaler?: boolean): string | undefined => {
  
  // If it's a range, don't show a single strikethrough price
  if (product.min_price && product.max_price && Number(product.min_price) !== Number(product.max_price)) {
    return undefined;
  }

  if (isWholesaler && product.calculated_wholesale_price && product.calculated_wholesale_price > 0 && product.regular_price) {
    return `৳${product.regular_price}`;
  }
  if (product.sale_price && product.regular_price) {
    return `৳${product.regular_price}`;
  }
  return undefined;
};

/** Search products quickly */
export const searchProductsAPI = async (query: string): Promise<PaginationInfo & { data: Product[] }> => {
  const qs = new URLSearchParams({ q: query }).toString();
  const url = `${API_BASE_URL}/api/v1/products/search?${qs}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to search products: ${response.status}`);
  }
  const result: ProductsListResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data;
};

/** Fetch related products for a product slug */
export const fetchRelatedProducts = async (slug: string): Promise<Product[]> => {
  const url = `${API_BASE_URL}/api/v1/products/${slug}/related`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch related products: ${response.status}`);
  }
  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data || [];
};

